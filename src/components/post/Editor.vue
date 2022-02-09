<template>
	<div class="relative">
		<div class="flex">
			<section class="w-full">
				<!-- Title, subtitle -->
				<article class="flex flex-col px-2">
					<button
						v-if="isSaving === `false` && this.$route.name !== 'home'"
						class="bg-gray1 focus:outline-none absolute right-0 top-0 m-8 rounded-full p-1"
						@click="saveContent"
					>
						<XIcon />
					</button>
					<article v-else-if="isSaving === `true`" class="modal-animation absolute right-0 top-0 p-8">
						<div class="loader"></div>
					</article>
					<p v-else class="text-positive modal-animation absolute right-0 top-0 p-8 pt-10">
						<span v-if="this.$route.name !== 'home'">Saved!</span>
					</p>
					<p class="text-lightError text-xs">{{ titleError }}</p>
					<label for="title" class="hidden">Title</label>
					<textarea
						id="title"
						ref="title"
						placeholder="Title"
						class="text-4xl focus:outline-none w-11/12 break-words -mt-2 mb-2 bg-transparent font-serif"
						wrap="soft"
						@input="handleTitle"
					/>
				</article>

				<article class="flex flex-col px-2">
					<p class="text-lightError text-xs">{{ subtitleError }}</p>
					<label for="subtitle" class="hidden">Subtitle</label>
					<textarea
						id="subtitle"
						ref="subtitle"
						placeholder="Subtitle"
						class="text-h2 text-gray5 focus:outline-none mt-2 w-full break-words bg-transparent font-serif"
						wrap="soft"
						@input="handleSubtitle"
					/>
				</article>

				<!-- WYSIWYG -->
				<input v-show="false" id="getFile" accept="image/png, image/jpeg" type="file" @change="handleImage($event)" />
				<div class="relative">
					<div
						id="editor"
						ref="editor"
						class="editable focus:outline-none content max-w-none p-2"
						v-html="sanitize($store.state.draft.drafts[$store.state.draft.activeIndex].content)"
					></div>
					<AddContent
						v-show="toggleAddContent"
						class="absolute modal-animation"
						:style="`top:` + this.addContentPosTop + `px;` + `left:` + this.addContentPosLeft + `px`"
						@image="actionsUpload"
					/>
				</div>
				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					id="metaButton"
					class="from-lightBGStart to-lightBGStop border-lightBorder text-xs text-gray5 modal-animation card-animation-delay1 animatedraftButton absolute bottom-0 right-0 z-10 m-4 mb-8 flex rounded-lg bg-gradient-to-r px-5 py-3 shadow-lg"
				>
					<p v-if="!isCollapsed">Time to publish?</p>
					<PencilIcon v-else class="fill-current p-1" @close="$router.push(`/post`)" />
					<button class="text-primary focus:outline-none ml-2" @click="$router.push(`/post`)">Add meta</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DOMPurify from 'dompurify'
import Turndown from 'turndown'
// @ts-ignore
import { strikethrough } from 'turndown-plugin-gfm'
import Quill from 'quill'
// @ts-ignore
import QuillMarkdown from 'quilljs-markdown'
import imageCompression from 'browser-image-compression'
import XIcon from '@/components/icons/X.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import AddContent from '@/components/post/EditorActions.vue'
import { ImageBlot, preRule, ipfsImageRule, createPostImagesArray } from '@/pages/post/editorExtensions'
import { createRegularPost, sendRegularPost } from '@/backend/post'
import { addPhotoToIPFS, preUploadPhoto } from '@/backend/photos'

interface IData {
	title: string
	subtitle: string
	input: string
	editor: Quill | null
	qeditor: Quill | null
	wordCount: number
	titleError: string
	subtitleError: string
	hasPosted: boolean
	isSaving: `true` | `false` | `done`
	isX: boolean
	isCollapsed: boolean
	postImages: Set<string>
	toggleAddContent: boolean
	addContentPosTop: number
	addContentPosLeft: number
}

const toolbarOptions = [
	[`bold`, `italic`, `underline`, `strike`],
	[`blockquote`, `code-block`, `link`],
	[{ header: 2 }],
	[{ list: `ordered` }, { list: `bullet` }],
]
const options = {
	placeholder: `Start typing here...`,
	readOnly: false,
	theme: `bubble`,
	bounds: `#editor`,
	modules: {
		counter: true,
		toolbar: {
			container: toolbarOptions,
		},
	},
}

const turndownService = new Turndown()
turndownService.addRule(`codeblock`, preRule)
turndownService.addRule(`ipfsimage`, ipfsImageRule)
turndownService.use(strikethrough)

type ImageData = { cid: string; url: string | ArrayBuffer }
function isImageData(data: any): data is ImageData {
	return typeof data === `object`
}

export default Vue.extend({
	components: {
		XIcon,
		PencilIcon,
		AddContent,
	},
	data(): IData {
		let input: string = ``
		const { content, title, subtitle, postImages } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		if (content !== ``) {
			input = content
		} else {
			input = ``
		}
		return {
			title,
			subtitle,
			input,
			wordCount: 0,
			titleError: ``,
			subtitleError: ``,
			hasPosted: false,
			isSaving: `false`,
			isX: false,
			isCollapsed: false,
			postImages: new Set(postImages),
			qeditor: null,
			editor: null,
			toggleAddContent: false,
			addContentPosTop: 0,
			addContentPosLeft: 0,
		}
	},
	beforeDestroy() {
		if (this.isX || this.$store.state.settings.recentlyPosted) {
			return
		}
		const titleInput = this.$refs.title as HTMLInputElement
		const subtitleInput = this.$refs.subtitle as HTMLInputElement
		const input = this.getInputHTML()
		if (input.length > 11 || titleInput.value.trim() !== `` || subtitleInput.value.trim() !== ``) {
			this.doSave()
		} else {
			const i: number = this.$store.state.draft.activeIndex
			this.$store.commit(`draft/deleteDraft`, i)
		}
	},
	mounted() {
		this.setupEditor()
	},
	methods: {
		// Quilljs Editor init
		setupEditor(): void {
			Quill.register(ImageBlot, true)
			Quill.register(
				`modules/counter`,
				(quill: Quill) => {
					const metaButton = document.getElementById(`metaButton`)
					quill.on(`text-change`, () => {
						this.$emit(`isWriting`, true)
						if (metaButton) {
							metaButton.classList.add(`hidemetaButton`)
						}
						this.isCollapsed = true
						const text = quill.getText()
						const n = text.split(/\s+/).length
						this.updateWordCount(n)
					})
					quill.on(`selection-change`, (range) => {
						if (!range) {
							this.$emit(`isWriting`, false)
							if (metaButton) {
								metaButton.classList.remove(`hidemetaButton`)
							}
							this.isCollapsed = false
						}
					})
					quill.on(`editor-change`, (eventName: string, ...args: any) => {
						if (eventName === `selection-change`) {
							if (!args[0]) {
								this.toggleAddContent = false
								return
							}
							this.calculateAddPos(args[0].index)
						}
					})
				},
				true,
			)
			const editor = new Quill(`#editor`, options)
			this.qeditor = editor
			this.qeditor.root.addEventListener(`drop`, (ev: DragEvent) => {
				this.handleDroppedImage(ev)
			})
			this.qeditor.root.addEventListener(`paste`, (ev: ClipboardEvent) => {
				this.handlePastedContent(ev)
			})
			this.qeditor.focus()
			// Set link placeholder
			const qe: HTMLElement | null = document.querySelector(`.ql-tooltip-editor input`)
			if (qe) {
				qe.setAttribute(`data-link`, `https://capsule.social`)
			}
			this.editor = new QuillMarkdown(editor, {})
			const titleInput = this.$refs.title as HTMLInputElement
			const subtitleInput = this.$refs.subtitle as HTMLInputElement

			const { title, subtitle } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			titleInput.value = title
			subtitleInput.value = subtitle
			this.handleTitle(true)
			this.updateTitle(false)
			this.handleSubtitle(true)
			this.updateSubtitle(false)
		},
		actionsUpload() {
			document.getElementById(`getFile`)?.click()
		},
		blobExtension(blob: Blob): string | null {
			switch (blob.type) {
				case `image/png`:
					return `.png`
				case `image/jpeg`:
					return `.jpeg`
				case `image/jpg`:
					return `.jpg`
				default:
					return null
			}
		},
		async updatePostImages(cid: string, compressedImage: Blob, imageName: string) {
			// If we have already added this image in the past, we don't need to reupload it to the server
			if (this.postImages.has(cid)) {
				return
			}
			this.postImages.add(cid)
			this.$store.commit(`draft/updatePostImages`, Array.from(this.postImages))
			await preUploadPhoto(cid, compressedImage, imageName, this.$store.state.session.id)
		},
		insertContent(content: string | ImageData) {
			if (!this.qeditor) {
				return
			}
			const range = this.qeditor.getSelection(true)
			if (!isImageData(content)) {
				this.qeditor.clipboard.dangerouslyPasteHTML(range.index, content, `user`)
			} else {
				const { cid, url } = content
				this.qeditor.insertEmbed(range.index, `image`, { alt: cid.toString(), url }, `user`)
			}
			const contentLength = this.qeditor.getContents().length()
			setTimeout(() => this.qeditor?.setSelection(contentLength, 0, `user`), 0)
		},
		getCompressedImage(file: File) {
			return imageCompression(file, {
				maxSizeMB: 5,
				maxWidthOrHeight: 1920,
				useWebWorker: true,
				initialQuality: 0.9,
			})
		},
		handleDroppedImage(e: DragEvent) {
			e.stopPropagation()
			e.preventDefault()
			if (!e.dataTransfer) {
				return
			}
			const { files } = e.dataTransfer
			if (files.length !== 1) {
				this.$toastError(`Can not drop more than 1 image at a time`)
				return
			}
			const file = files[0]
			const fileType = /^image\/(jpeg|jpg|png)$/
			if (!fileType.test(file.type)) {
				return
			}
			this.uploadPhoto(file)
		},
		async handlePastedContent(e: ClipboardEvent) {
			e.stopPropagation()
			e.preventDefault()

			if (!this.qeditor) {
				return
			}
			if (!e.clipboardData) {
				return
			}
			const clipboard = e.clipboardData
			let content = this.sanitize(clipboard.getData(`text/html`))
			const imgTagRegex = /<img [^>]*>/g
			const imgSrcRegex = /src="([^\s|"]*)"/
			const contentImgs = Array.from(content.matchAll(imgTagRegex))
			if (contentImgs.length === 0) {
				this.insertContent(content)
				return
			}
			for (const img of contentImgs) {
				const imgSrc = imgSrcRegex.exec(img[0])
				if (!imgSrc) {
					continue
				}
				const src = imgSrc[1]
				const response = await fetch(src)
				const blob = await response.blob()
				const blobExtension = this.blobExtension(blob)
				if (!blobExtension) {
					this.$toastError(`Invalid image type`)
				}
				const file = new File([blob], `image${Date.now()}${blobExtension}`, { type: blob.type })
				const compressedImage = await this.getCompressedImage(file)
				const reader = new FileReader()
				reader.readAsDataURL(compressedImage)
				// eslint-disable-next-line no-loop-func
				reader.onload = async (ev) => {
					if (ev.target !== null) {
						const cid = await addPhotoToIPFS(ev.target.result as any)
						await this.updatePostImages(cid, compressedImage, file.name)
						content = content.replace(img[0], `<img alt="${cid}" src="${src}">`)
						this.insertContent(content)
					}
					return null
				}
			}
		},
		handleImage(e: Event) {
			e.stopPropagation()
			e.preventDefault()

			const { files } = e.target as any
			if (!files) {
				return
			}
			if (files.length !== 1) {
				return
			}
			this.uploadPhoto(files[0])
		},
		calculateAddPos(index: number) {
			if (!this.qeditor) {
				return
			}
			const line = this.qeditor.getLine(index)
			const pos = this.qeditor.getBounds(index)
			if (line[1] === 0 && line[0].domNode.innerHTML === `<br>`) {
				this.toggleAddContent = true
				if (index === 0) {
					this.addContentPosTop = pos.top + 50
					this.addContentPosLeft = pos.left
				} else {
					this.addContentPosTop = pos.top
					this.addContentPosLeft = pos.left + 20
				}
			} else {
				this.toggleAddContent = false
			}
		},
		doSave() {
			const titleInput = this.$refs.title as HTMLInputElement
			const titleInputValue = titleInput.value.trim()
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const subtitleInputValue = subtitleInput.value.trim()
			const input = this.getInputHTML()
			this.$store.commit(`draft/updateContent`, input)
			this.$store.commit(`draft/setTimestamp`, new Date())
			if (titleInputValue !== ``) {
				this.$store.commit(`draft/updateTitle`, titleInputValue)
			}
			if (subtitleInputValue !== ``) {
				this.$store.commit(`draft/updateSubtitle`, subtitleInputValue)
			}
			if (this.$store.state.draft.handleDraftWidget) {
				this.$store.commit(`draft/createDraft`)
				this.$store.commit(`draft/handleDraftWidget`, false)
			}
		},
		updateContent() {
			const input = this.getInputHTML()
			if (input !== ``) {
				this.$store.commit(`draft/updateContent`, input)
			}
		},
		async uploadPhoto(image: File) {
			try {
				const compressedImage = await this.getCompressedImage(image)
				const reader = new FileReader()
				reader.readAsDataURL(compressedImage)
				reader.onload = async (i) => {
					if (i.target !== null && i.target.result !== null) {
						const cid = await addPhotoToIPFS(i.target.result)
						await this.updatePostImages(cid, compressedImage, image.name)
						this.insertContent({ cid, url: i.target.result })
					}
				}
			} catch (err) {
				this.$toastError(`error`)
			}
		},
		async saveContent(): Promise<void> {
			this.isX = true
			const titleInput = this.$refs.title as HTMLInputElement
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const input = this.getInputHTML()
			if (input.length > 11 || titleInput.value.trim() !== `` || subtitleInput.value.trim() !== ``) {
				this.isSaving = `true`
				this.doSave()
				await this.sleep(600)
				this.isSaving = `done`
				await this.sleep(800)
			} else {
				const i: number = this.$store.state.draft.activeIndex
				this.$store.commit(`draft/deleteDraft`, i)
			}
			if (this.$route.name === `post`) {
				this.$router.go(-1)
			}
		},
		updateWordCount(n: number) {
			this.wordCount = n - 1
			this.$emit(`update`, this.wordCount)
		},
		sanitize(html: string): string {
			return DOMPurify.sanitize(html, {
				USE_PROFILES: { html: true, svg: true },
				ALLOWED_TAGS: [`pre`],
			})
		},
		getInputHTML(): string {
			const input = document.getElementsByClassName(`ql-editor`)[0]
			if (!input) {
				return ``
			}
			// Sanitize HTML
			return this.sanitize(input.innerHTML)
		},
		async post(): Promise<void> {
			const title = this.$refs.title as HTMLInputElement
			const subtitle = this.$refs.subtitle as HTMLInputElement
			this.title = title.value.trim()
			this.subtitle = subtitle.value.trim()
			const { category, tags, featuredPhotoCID, featuredPhotoCaption } =
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			// Check for quality title
			const titleCheck = this.$qualityTitle(this.title)
			if (this.$isError(titleCheck)) {
				this.$toastError(titleCheck.error)
				return
			}
			// Check if using a subtitle and is a quality subtitle
			const subtitleCheck = this.$qualitySubtitle(this.subtitle)
			if (this.$isError(subtitleCheck)) {
				this.$toastError(subtitleCheck.error)
				return
			}
			if (category === ``) {
				this.$toastError(`Missing category`)
				return
			}

			for (const { name } of tags) {
				if (name.replace(/\s/, ``).trim() !== name) {
					this.$toastError(`Tag with spaces is not allowed`)
					return
				}
			}

			const clean = turndownService.turndown(this.getInputHTML())
			// Check content quality
			const contentQualityCheck = this.$qualityContent(clean)
			if (this.$isError(contentQualityCheck)) {
				this.$toastError(contentQualityCheck.error)
				return
			}
			if (this.hasPosted) {
				return
			}
			this.hasPosted = true
			const postImages = createPostImagesArray(clean, this.postImages)
			const p = createRegularPost(
				this.title,
				this.subtitle === `` ? null : this.subtitle,
				clean,
				category,
				tags,
				this.$store.state.session.id,
				featuredPhotoCID,
				featuredPhotoCaption,
				postImages,
			)
			const cid = await sendRegularPost(p)
			this.title = ``
			this.subtitle = ``
			this.input = ``
			this.$store.commit(`draft/reset`)
			this.$store.commit(`settings/setRecentlyPosted`, true)
			this.$router.push(`/post/` + cid)
		},
		handleTitle(e: any) {
			if (!e) {
				return
			}
			const titleInput = this.$refs.title as HTMLTextAreaElement
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
				e.preventDefault()
				subtitleInput.focus()
			}
			titleInput.style.height = `60px`
			titleInput.style.height = `${titleInput.scrollHeight}px`
			this.updateTitle()
		},
		handleSubtitle(e: any) {
			if (!e) {
				return
			}
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			subtitleInput.style.height = `${subtitleInput.scrollHeight}px`
			if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
				e.preventDefault()
			}
			subtitleInput.style.height = `40px`
			subtitleInput.style.height = `${subtitleInput.scrollHeight}px`
			this.updateSubtitle()
		},
		updateTitle(updateStore: boolean = true) {
			const titleInput = this.$refs.title as HTMLTextAreaElement
			const titleInputValue = titleInput.value.trim()
			if (updateStore) {
				this.$store.commit(`draft/updateTitle`, titleInputValue)
			}
			const titleQualityCheck = this.$qualityTitle(titleInputValue)
			if (this.$isError(titleQualityCheck)) {
				if (titleQualityCheck.error === `Please enter a title.`) {
					return
				}
				this.titleError = titleQualityCheck.error
				return
			}
			this.titleError = ``
		},
		updateSubtitle(updateStore: boolean = true) {
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			const subtitleInputValue = subtitleInput.value.trim()
			if (updateStore) {
				this.$store.commit(`draft/updateSubtitle`, subtitleInputValue)
			}
			const subtitleQualityCheck = this.$qualitySubtitle(subtitleInputValue)
			if (this.$isError(subtitleQualityCheck)) {
				this.subtitleError = subtitleQualityCheck.error
				return
			}
			this.subtitleError = ``
		},
		sleep(ms: any) {
			return new Promise((resolve) => setTimeout(resolve, ms))
		},
	},
})
</script>

<style>
textarea#title {
	border: none;
	resize: none;
	overflow-y: hidden;
	min-height: 4rem;
	box-sizing: border-box;
}
textarea#subtitle {
	border: none;
	resize: none;
	overflow-y: hidden;
	min-height: 2.5rem;
	box-sizing: border-box;
}
.hidemetaButton {
	transform: translateX(5.15rem);
	padding: 0.7rem;
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
