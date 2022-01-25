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
						placeholder="Enter Title"
						class="text-h1 focus:outline-none w-full break-words bg-transparent font-serif font-semibold"
						wrap="soft"
						@beforeinput="handleTitle"
						@input="updateTitle"
					/>
				</article>

				<article class="flex flex-col px-2">
					<p class="text-lightError text-xs">{{ subtitleError }}</p>
					<label for="subtitle" class="hidden">Subtitle</label>
					<textarea
						id="subtitle"
						ref="subtitle"
						placeholder="Enter Subtitle"
						class="text-h2 text-gray5 focus:outline-none mt-2 w-full break-words bg-transparent font-serif"
						wrap="soft"
						@beforeinput="handleSubtitle"
						@input="updateSubtitle"
					/>
				</article>

				<!-- WYSIWYG -->
				<input
					v-show="false"
					id="getFile"
					accept="image/png, image/jpeg"
					type="file"
					@change="uploadFunction($event)"
				/>
				<div
					id="editor"
					ref="editor"
					class="editable focus:outline-none content max-w-none p-2"
					v-html="$store.state.draft.drafts[$store.state.draft.activeIndex].content"
				></div>

				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					id="metaButton"
					class="from-lightBGStart to-lightBGStop border-lightBorder test-xs text-gray5 modal-animation card-animation-delay1 animatedraftButton absolute bottom-0 right-0 z-10 m-4 mb-8 flex rounded-lg bg-gradient-to-r px-5 py-3 shadow-lg"
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
import Quill from 'quill'
// @ts-ignore
import QuillMarkdown from 'quilljs-markdown'
import imageCompression from 'browser-image-compression'
import XIcon from '@/components/icons/X.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
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
}

const toolbarOptions = [
	[`bold`, `italic`, `underline`, `strike`],
	[`blockquote`, `code-block`, `link`],
	[{ header: 2 }],
	[{ list: `ordered` }, { list: `bullet` }],
	[`image`],
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
			handlers: {
				image() {
					document.getElementById(`getFile`)?.click()
				},
			},
		},
	},
}

const turndownService = new Turndown()
turndownService.addRule(`codeblock`, preRule)
turndownService.addRule(`ipfsimage`, ipfsImageRule)

export default Vue.extend({
	components: {
		XIcon,
		PencilIcon,
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
			},
			true,
		)
		const editor = new Quill(`#editor`, options)
		this.qeditor = editor
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
	methods: {
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
		async uploadFunction(e: { target: HTMLInputElement }) {
			const target = e.target
			if (e.target.files?.length !== 1) {
				return
			}
			const image: File = (target.files as FileList)[0]
			if (!image) {
				return
			}

			try {
				const compressedImage = await imageCompression(image, {
					maxSizeMB: 5,
					maxWidthOrHeight: 1920,
					useWebWorker: true,
					initialQuality: 0.9,
				})
				const reader = new FileReader()
				reader.readAsDataURL(compressedImage)
				reader.onload = async (i) => {
					if (i.target !== null) {
						const cid = await addPhotoToIPFS(i.target.result as any)
						// If we have already added this image in the past, we don't need to reupload it to the server
						if (!this.postImages.has(cid)) {
							this.postImages.add(cid)
							this.$store.commit(`draft/updatePostImages`, Array.from(this.postImages))
							await preUploadPhoto(cid, compressedImage)
						}
						if (!this.qeditor) {
							return
						}
						const range = this.qeditor.getSelection(true)
						this.qeditor.insertEmbed(range.index, `image`, { alt: cid.toString(), url: i.target.result }, `user`)
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
		getInputHTML(): string {
			const input = document.getElementsByClassName(`ql-editor`)[0]
			if (!input) {
				return ``
			}
			// Sanitize HTML
			const clean = DOMPurify.sanitize(input.innerHTML, {
				USE_PROFILES: { html: true, svg: true },
				ALLOWED_TAGS: [`pre`],
			})
			return clean
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
			// Check if using a subtitle
			if (this.subtitle !== `` && (!this.$qualityText(this.subtitle) || this.subtitleError !== ``)) {
				this.$toastError(`Invalid subtitle!`)
				return
			}
			if (this.subtitle !== `` && this.subtitle.length > 180) {
				this.$toastError(`Subtitle too long!`)
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
			if (clean.length < 280) {
				this.$toastError(`Post body too short. Write more before posting`)
				return
			}
			if (clean.length > 100000) {
				this.$toastError(`Post body too long for IPFS deliverability`)
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
			titleInput.style.height = `auto`
			titleInput.style.height = `${titleInput.scrollHeight}px`
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
			subtitleInput.style.height = `auto`
			subtitleInput.style.height = `${subtitleInput.scrollHeight}px`
		},
		updateTitle(updateStore: boolean = true) {
			const titleInput = this.$refs.title as HTMLTextAreaElement
			const titleInputValue = titleInput.value.trim()
			if (updateStore) {
				this.$store.commit(`draft/updateTitle`, titleInputValue.trim())
			}
			if (titleInputValue.trim().length === 0) {
				this.titleError = `Please enter a title.`
				return
			}
			if (titleInputValue.trim().length < 12) {
				this.titleError = `Title is too short.`
				return
			}
			if (titleInputValue.trim().length > 90) {
				this.titleError = `Title is too long.`
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
			if (subtitleInputValue.length === 0) {
				this.subtitleError = ``
				return
			}
			if (subtitleInputValue.length > 0 && subtitleInputValue.length < 12) {
				this.subtitleError = `Subtitle is too short.`
				return
			}
			if (subtitleInputValue.length > 180) {
				this.subtitleError = `Subtitle is too long.`
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
	transform: translateX(6.4rem);
	padding: 0.7rem;
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
