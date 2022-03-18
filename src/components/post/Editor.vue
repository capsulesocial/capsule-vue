<template>
	<div ref="scrollContainer" class="relative">
		<div class="flex">
			<section class="w-full">
				<!-- Title, subtitle -->
				<article class="flex flex-col px-2">
					<button
						v-if="isSaving === `false` && this.$route.name !== 'home'"
						class="bg-gray1 dark:bg-gray5 focus:outline-none absolute right-0 top-0 m-8 rounded-full p-1"
						@click="saveContent"
					>
						<XIcon />
					</button>
					<article v-else-if="isSaving === `true`" class="modal-animation absolute right-0 top-0 p-8">
						<div
							class="loader border-2 border-gray1 dark:border-gray7 h-6 w-6 rounded-3xl"
							:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
						></div>
					</article>
					<p v-else class="text-positive modal-animation absolute right-0 top-0 p-8">
						<span v-if="this.$route.name !== 'home'">Saved!</span>
					</p>
					<p class="text-lightError text-xs">{{ titleError }}</p>
					<label for="title" class="hidden">Title</label>
					<textarea
						id="title"
						ref="title"
						placeholder="Title"
						class="text-4xl dark:text-darkPrimaryText focus:outline-none w-11/12 break-words -mt-2 mb-2 bg-transparent font-serif placeholder-gray5 dark:placeholder-gray1"
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
						class="text-h2 text-gray5 dark:text-gray2 placeholder-gray5 dark:placeholder-gray2 focus:outline-none mt-2 w-full break-words bg-transparent font-serif"
						wrap="soft"
						@input="handleSubtitle"
					/>
				</article>

				<!-- WYSIWYG -->
				<input v-show="false" id="getFile" accept="image/png, image/jpeg" type="file" @change="handleImage($event)" />
				<div class="relative flex justify-center">
					<div
						id="editor"
						ref="editor"
						class="editable focus:outline-none content max-w-none p-2 dark:placeholder-gray2 dark:text-darkPrimaryText w-full"
						v-html="sanitize($store.state.draft.drafts[$store.state.draft.activeIndex].content)"
					></div>
					<AddContent
						v-show="toggleAddContent"
						class="absolute modal-animation"
						:style="`top:` + this.addContentPosTop + `px;` + `left:` + this.addContentPosLeft + `px`"
						@image="actionsUpload"
					/>
					<div
						v-if="waitingImage"
						class="absolute w-11/12 h-44 bg-lightInput dark:bg-gray7 rounded-lg animate-pulse flex justify-center items-center"
						:style="`top:` + this.addContentPosTop + `px`"
					>
						<p class="text-sm text-gray5 dark:text-gray3">uploading image...</p>
					</div>
				</div>
				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					id="metaButton"
					class="from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG border-lightBorder text-gray5 dark:text-gray3 modal-animation card-animation-delay1 animatedraftButton absolute bottom-0 right-0 z-10 m-4 mb-8 flex rounded-lg bg-gradient-to-r px-5 py-3 shadow-lg"
				>
					<p v-if="!isCollapsed">Time to publish?</p>
					<PencilIcon v-else class="fill-current p-1" @close="$router.push(`/post`)" />
					<button class="text-primary dark:text-secondary focus:outline-none ml-2" @click="$router.push(`/post`)">
						Add meta
					</button>
				</div>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DOMPurify from 'dompurify'
import Turndown from 'turndown'
import { strikethrough } from 'turndown-plugin-gfm'
import Quill, { RangeStatic } from 'quill'
import QuillMarkdown from 'quilljs-markdown'
import axios from 'axios'
import XIcon from '@/components/icons/X.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import AddContent from '@/components/post/EditorActions.vue'
import {
	ImageBlot,
	preRule,
	ipfsImageRule,
	createPostImagesSet,
	counterModuleFactory,
} from '@/pages/post/quillExtensions'
import { createRegularPost, sendRegularPost } from '@/backend/post'
import { preUploadPhoto, uploadPhoto } from '@/backend/photos'
import { isValidFileType } from '@/backend/utilities/helpers'
import textLimits from '@/backend/utilities/text_limits'

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
	dark: boolean
	waitingImage: boolean
}

interface IImageData {
	cid: string
	url: string | ArrayBuffer
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
	scrollingContainer: `#editor`,
	modules: {
		counter: true,
		toolbar: {
			container: toolbarOptions,
		},
	},
}

const turndownService = new Turndown()
turndownService.keep([`u`])
turndownService.addRule(`codeblock`, preRule)
turndownService.addRule(`ipfsimage`, ipfsImageRule)
turndownService.use(strikethrough)

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
			dark: false,
			waitingImage: false,
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
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		this.setupEditor()
	},
	methods: {
		// Quilljs Editor init
		setupEditor(): void {
			// Handle link validation
			const Link = Quill.import(`formats/link`)
			const builtInFunc = Link.sanitize
			Link.sanitize = function customSanitizeLinkInput(linkValueInput: string) {
				let val = linkValueInput
				if (/^\w+:/.test(val)) {
					// do nothing, since this implies user's already using a custom protocol
				} else if (!/^https?:/.test(val)) {
					val = `https://` + val
				}
				return builtInFunc.call(this, val) // retain the built-in logic
			}
			const metaButton = document.getElementById(`metaButton`)
			// Handle updates to body
			const onTextChange = () => {
				this.$emit(`isWriting`, true)
				if (metaButton) {
					metaButton.classList.add(`hidemetaButton`)
				}
				this.isCollapsed = true
				const text = this.getInputHTML().replace(/(<([^>]+)>)/gi, ` `)
				const n = text.split(/\s+/).length
				this.updateWordCount(n)
			}
			// Handles draft overlay
			const onSelectionChange = (range: RangeStatic) => {
				if (!range) {
					this.$emit(`isWriting`, false)
					if (metaButton) {
						metaButton.classList.remove(`hidemetaButton`)
					}
					this.isCollapsed = false
				}
			}
			// Handles add content button
			const onEditorChange = (eventName: string, ...args: any[]) => {
				if (eventName === `selection-change`) {
					if (!args[0]) {
						this.toggleAddContent = false
						return
					}
					this.calculateAddPos(args[0].index)
				}
			}

			Quill.register(ImageBlot, true)
			Quill.register(
				`modules/counter`,
				counterModuleFactory(onTextChange.bind(this), onSelectionChange.bind(this), onEditorChange.bind(this)),
				true,
			)
			const editor = new Quill(`#editor`, options)
			this.qeditor = editor
			this.qeditor.root.addEventListener(`drop`, (ev: DragEvent) => {
				this.handleDroppedContent(ev)
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
		refreshPostImages() {
			const clean = turndownService.turndown(this.getInputHTML())
			this.postImages = createPostImagesSet(clean, this.postImages)
		},
		async updatePostImages(
			cid: string,
			compressedImage: Blob,
			imageName: string,
		): Promise<{ error: string } | { success: boolean }> {
			// If we have already added this image in the past, we don't need to reupload it to the server
			if (this.postImages.has(cid)) {
				return { success: true }
			}
			if (this.postImages.size === textLimits.post_images.max) {
				return { error: `Cannot add more than ${textLimits.post_images.max} images in a post` }
			}
			this.postImages.add(cid)
			this.$store.commit(`draft/updatePostImages`, Array.from(this.postImages))
			await preUploadPhoto(cid, compressedImage, imageName, this.$store.state.session.id)
			return { success: true }
		},
		insertContent(content: string | IImageData | null, plainText = false) {
			try {
				if (!this.qeditor || !content) {
					return
				}
				const range = this.qeditor.getSelection(true)
				if (typeof content === `string`) {
					if (plainText) {
						this.qeditor.insertText(range.index, content, `user`)
					} else {
						this.qeditor.clipboard.dangerouslyPasteHTML(range.index, content, `user`)
					}
				} else {
					const { cid, url } = content
					this.qeditor.insertEmbed(range.index, `image`, { alt: cid.toString(), url }, `user`)
				}
				const contentLength = this.qeditor.getContents().length()
				setTimeout(() => {
					this.qeditor?.setSelection(contentLength, 0, `user`)
					this.calculateAddPos(contentLength)
				}, 0)
			} catch (error: any) {
				this.$toastError(error.message)
			}
		},
		async handleDroppedContent(e: DragEvent) {
			e.stopPropagation()
			e.preventDefault()
			if (!e.dataTransfer) {
				return
			}
			const droppedHtml = this.sanitize(e.dataTransfer.getData(`text/html`))
			const droppedText = this.sanitize(e.dataTransfer.getData(`text/plain`))
			const { files } = e.dataTransfer
			const file = files[0]

			// handle dropped file
			if (file) {
				await this.handleFile(file)
				return
			}

			if (!file && (droppedHtml || droppedHtml !== ``)) {
				this.refreshPostImages()
				const content = await this.handleHtml(droppedHtml)
				this.insertContent(content)
				this.refreshPostImages()
				return
			}

			if (!file && !droppedHtml) {
				this.insertContent(droppedText, true)
			}
		},
		handleCutPaste(range: RangeStatic, pastedText: string) {
			const Delta = Quill.import(`delta`)
			const delta = new Delta().compose(new Delta().retain(range.index + range.length).insert(pastedText))
			this.qeditor?.updateContents(delta)
			setTimeout(() => this.qeditor?.setSelection(range.index + pastedText.length, 0, `user`), 0)
		},
		async handleHtml(pastedContent: string) {
			const contentImgs = this.$getContentImages(pastedContent)
			const imgSrcRegex = /src="([^\s|"]*)"/
			if (contentImgs.length > textLimits.post_images.max) {
				this.$toastError(`Can not add more than ${textLimits.post_images.max} images in a post`)
				return null
			}
			for (const img of contentImgs) {
				this.waitingImage = true
				this.toggleAddContent = false
				const imgSrc = imgSrcRegex.exec(img[0])
				if (!imgSrc) {
					continue
				}
				const src = imgSrc[1]
				const f = await this.$urlToFile(src)
				if (this.$isError(f)) {
					this.$toastError(f.error)
					pastedContent = pastedContent.replace(img[0], ``)
					continue
				}
				try {
					const { cid, url, image, imageName } = await uploadPhoto(f.file)
					const updatedPostImages = await this.updatePostImages(cid, image, imageName)
					if (this.$isError(updatedPostImages)) {
						this.$toastError(updatedPostImages.error)
						return null
					}
					pastedContent = pastedContent.replace(img[0], `<img alt="${cid}" src="${url}">`)
				} catch (err: unknown) {
					this.waitingImage = false
					if (axios.isAxiosError(err)) {
						if (!err.response) {
							this.$toastError(`Network error, please try again`)
							return null
						}
						if (err.response.status === 429) {
							this.$toastError(`Too many requests, please try again in a minute`)
							return null
						}
						this.$toastError(err.response.data.error)
					}
					if (err instanceof Error) {
						this.$toastError(err.message)
					}
					return null
				}
			}
			this.waitingImage = false
			return pastedContent
		},
		async handleFile(file: File) {
			if (!isValidFileType(file.type)) {
				this.$toastError(`image of type ${file.type} is invalid`)
				return
			}
			this.refreshPostImages()
			try {
				this.waitingImage = true
				this.toggleAddContent = false
				const { cid, url, image, imageName } = await uploadPhoto(file)
				const updatedPostImages = await this.updatePostImages(cid, image, imageName)
				if (this.$isError(updatedPostImages)) {
					this.$toastError(updatedPostImages.error)
					this.waitingImage = false
					return
				}
				this.insertContent({ cid, url })
				this.waitingImage = false
				this.refreshPostImages()
			} catch (err: unknown) {
				this.waitingImage = false
				this.refreshPostImages()
				if (axios.isAxiosError(err)) {
					if (!err.response) {
						this.$toastError(`Network error, please try again`)
						return
					}
					if (err.response.status === 429) {
						this.$toastError(`Too many requests, please try again in a minute`)
						return
					}
					this.$toastError(err.response.data.error)
					return
				}
				if (err instanceof Error) {
					this.$toastError(err.message)
					return
				}
				throw err
			}
		},
		async handlePastedContent(e: ClipboardEvent) {
			e.stopPropagation()
			e.preventDefault()

			if (!this.qeditor) {
				this.$toastError(`Something went wrong while pasting the content`)
				return
			}
			if (!e.clipboardData) {
				return
			}
			const clipboard = e.clipboardData
			const items = Array.from(clipboard.items)
			const pastedContent = this.sanitize(clipboard.getData(`text/html`))
			const pastedText = this.sanitize(clipboard.getData(`text/plain`))
			const pastedFile = items.length > 0 ? items[0].getAsFile() : null
			const contentImgs = this.$getContentImages(pastedContent)
			const range = this.qeditor.getSelection(true)

			// handle cut and paste
			if (this.qeditor.getLength() !== range.index + 1 && contentImgs.length === 0 && !pastedFile) {
				this.handleCutPaste(range, pastedText)
				this.scrollToBottom(e)
				return
			}

			// handle pasted content
			if (pastedContent || pastedContent !== ``) {
				this.refreshPostImages()
				const content = await this.handleHtml(pastedContent)
				this.insertContent(content)
				this.refreshPostImages()
				this.scrollToBottom(e)
				return
			}

			// handle pasted file
			if (pastedFile) {
				await this.handleFile(pastedFile)
				return
			}
			// handle if text only
			if (!pastedFile && (!pastedContent || pastedContent === ``)) {
				this.insertContent(pastedText, true)
			}
			this.scrollToBottom(e)
		},
		scrollToBottom(e: ClipboardEvent) {
			const scrollContainer = this.$refs.scrollContainer as HTMLElement
			if (e && e.target) {
				// @ts-ignore
				if (e.target.outerHTML === `<br>`) {
					scrollContainer.scrollTop = this.addContentPosTop
					return
				}
				// @ts-ignore
				e.target.scrollIntoView()
			}
		},
		async handleImage(e: Event) {
			e.stopPropagation()
			e.preventDefault()
			const eventTarget = e.target
			if (!eventTarget) {
				return
			}

			const target = eventTarget as HTMLInputElement

			const { files } = target
			if (!files || files.length !== 1) {
				return
			}

			await this.handleFile(files[0])
			target.value = ``
		},
		calculateAddPos(index: number) {
			if (!this.qeditor) {
				return
			}
			const line = this.qeditor.getLine(index)
			const pos = this.qeditor.getBounds(index)
			if (line[1] === 0 && line[0].domNode.innerHTML === `<br>` && !this.waitingImage) {
				if (index === 0) {
					this.addContentPosTop = pos.top + 50
					this.addContentPosLeft = pos.left
				} else {
					this.addContentPosTop = pos.top
					this.addContentPosLeft = pos.left + 20
				}
				this.toggleAddContent = true
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
			this.wordCount = n - 2
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

			// Check for quality featuredPhotoCaption
			if (featuredPhotoCaption) {
				const featuredPhotoCaptionCheck = this.$qualityFeaturedPhotoCaption(featuredPhotoCaption)
				if (this.$isError(featuredPhotoCaptionCheck)) {
					this.$toastError(featuredPhotoCaptionCheck.error)
					return
				}
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
			const postImages = Array.from(createPostImagesSet(clean, this.postImages))
			if (postImages.length > textLimits.post_images.max) {
				this.$toastError(`Cannot add more than ${textLimits.post_images.max} images in a post`)
				return
			}
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
			this.hasPosted = true
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
	transform: translateX(6.25rem);
	padding: 0.7rem;
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
