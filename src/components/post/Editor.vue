<template>
	<div ref="scrollContainer" class="relative">
		<div class="flex">
			<section class="w-full">
				<!-- Title, subtitle -->
				<article class="flex flex-col px-2">
					<div
						v-if="isSaving === `false` && this.$route.name !== 'home'"
						class="absolute right-0 top-0 flex flex-row items-center m-8"
					>
						<p class="mr-5 cursor-pointer text-primary" @click="handleSave">Save</p>
						<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="saveContent">
							<XIcon />
						</button>
					</div>
					<article v-else-if="isSaving === `true`" class="modal-animation absolute right-0 top-0 p-8">
						<div
							class="loader border-2 border-gray1 dark:border-gray7 h-6 w-6 rounded-3xl"
							:style="`border-top: 2px solid` + $color.hex"
						></div>
					</article>
					<p v-else class="text-positive modal-animation absolute right-0 top-0 p-8">
						<span v-if="this.$route.name !== 'home'">Saved!</span>
					</p>
					<p class="text-negative text-xs">{{ titleError }}</p>
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
					<p class="text-negative text-xs">{{ subtitleError }}</p>
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
						<p class="text-sm text-gray5 dark:text-gray3">Uploading image...</p>
					</div>
				</div>
				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					id="metaButton"
					class="bg-lightBG dark:bg-darkBGStop border-lightBorder text-gray5 dark:text-gray3 modal-animation card-animation-delay1 animatedraftButton absolute bottom-0 right-0 z-10 m-4 mb-8 flex rounded-lg px-5 py-3 shadow-lg"
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
import hljs from 'highlight.js'
import type { RangeStatic, Quill } from 'quill'
import QuillMarkdown from 'quilljs-markdown'
import TurndownService from '../editor/TurndownService'
import XIcon from '@/components/icons/X.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import AddContent from '@/components/post/EditorActions.vue'
import { createPostImagesSet, counterModuleFactory, ImageBlotFactory } from '@/pages/post/quillExtensions'
import {
	createEncryptedPost,
	createRegularPost,
	IEncryptedPost,
	IKeyData,
	IRegularPost,
	sendEncryptedPost,
	sendRegularPost,
	Tag,
} from '@/backend/post'
import { preUploadPhoto, uploadPhoto } from '@/backend/photos'
import { validMimeTypes } from '@/backend/utilities/helpers'
import textLimits from '@/backend/utilities/text_limits'
import { BASE_ALLOWED_TAGS } from '@/plugins/helpers'

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
	postImages: Map<string, IKeyData | {}>
	toggleAddContent: boolean
	addContentPosTop: number
	addContentPosLeft: number
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
		syntax: {
			highlight: (code: string) => hljs.highlightAuto(code).value,
		},
		counter: true,
		toolbar: {
			container: toolbarOptions,
		},
	},
}

const allPostImages = new Map()

export default Vue.extend({
	components: {
		XIcon,
		PencilIcon,
		AddContent,
	},
	data(): IData {
		let input: string = ``
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
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
			postImages: new Map(),
			qeditor: null,
			editor: null,
			toggleAddContent: false,
			addContentPosTop: 0,
			addContentPosLeft: 0,
			waitingImage: false,
		}
	},
	computed: {
		encrypted() {
			return this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted
		},
	},
	watch: {
		encrypted() {
			this.updateSubtitle()
		},
	},
	created() {
		const { postImages, encrypted } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
		if (!Array.isArray(postImages)) {
			return
		}

		if (postImages.length < 1) {
			return
		}

		postImages.forEach((pI) => {
			if (`imageCID` in pI) {
				const item = encrypted ? { key: pI.key, counter: pI.counter } : {}
				this.postImages.set(pI.imageCID, item)
				allPostImages.set(pI.imageCID, item)
			}
		})
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
		async setupEditor() {
			// Handle link validation
			const { default: QuillClass } = await import(`quill`)
			const Link = QuillClass.import(`formats/link`)
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
			const onTextChange = (_delta?: any, oldDelta?: any, source?: string) => {
				if (this.qeditor && source === `user`) {
					const currentContent = this.qeditor.getContents()
					const diff = currentContent.diff(oldDelta)
					const imageInCurrentContent = currentContent.ops.find((op: any) => op.insert && op.insert.image)
					const imageInDiff = diff.ops.find((op: any) => op.insert && op.insert.image)
					if (imageInCurrentContent || imageInDiff) {
						const clean = TurndownService.turndown(this.getInputHTML())
						this.postImages = createPostImagesSet(clean, this.postImages)
						this.updateDraftPostImages()
					}
				}
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

			QuillClass.register(ImageBlotFactory(QuillClass), true)
			QuillClass.register(
				`modules/counter`,
				counterModuleFactory(
					QuillClass,
					onTextChange.bind(this),
					onSelectionChange.bind(this),
					onEditorChange.bind(this),
				),
				true,
			)
			const editor = new QuillClass(`#editor`, options)
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
		updateDraftPostImages() {
			this.$store.commit(
				`draft/updatePostImages`,
				Array.from(this.postImages.keys()).map((k) => {
					const imgData = this.postImages.get(k)
					if (imgData === undefined) {
						throw new Error(`This shouldn't happen`)
					}
					if (`key` in imgData && `counter` in imgData) {
						return {
							imageCID: k,
							key: imgData.key,
							counter: imgData.counter,
						}
					}

					return { imageCID: k }
				}),
			)
		},
		async updatePostImages(
			cid: string,
			compressedImage: Blob,
			imageName: string,
			encryptionData?: IKeyData,
		): Promise<{ error: string } | { success: boolean }> {
			// If we have already added this image in the past, we don't need to reupload it to the server
			if (this.postImages.has(cid)) {
				return { success: true }
			}
			if (this.postImages.size === textLimits.post_images.max) {
				this.waitingImage = false
				return { error: `Cannot add more than ${textLimits.post_images.max} images in a post` }
			}
			this.postImages.set(cid, encryptionData ?? {})
			allPostImages.set(cid, encryptionData ?? {})
			this.updateDraftPostImages()
			await preUploadPhoto(cid, compressedImage, imageName, this.$store.state.session.id, this.encrypted)
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
				const content = await this.handleHtml(droppedHtml)
				this.insertContent(content)
				return
			}

			if (!file && !droppedHtml) {
				this.insertContent(droppedText, true)
			}
		},
		async handleCutPaste(range: RangeStatic, pastedText: string) {
			const { default: QuillClass } = await import(`quill`)
			const Delta = QuillClass.import(`delta`)
			const delta = new Delta().compose(new Delta().retain(range.index + range.length).insert(pastedText))
			this.qeditor?.updateContents(delta)
			setTimeout(() => this.qeditor?.setSelection(range.index + pastedText.length, 0, `user`), 0)
		},
		async handleHtml(pastedContent: string) {
			const domParser = new DOMParser()
			const content = domParser.parseFromString(pastedContent, `text/html`)
			const contentImgs = content.getElementsByTagName(`img`)
			if (contentImgs.length > textLimits.post_images.max) {
				this.waitingImage = false
				this.$toastError(`Cannot add more than ${textLimits.post_images.max} images in a post`)
				return null
			}
			for (const img of contentImgs) {
				this.waitingImage = true
				this.toggleAddContent = false
				const f = await this.$urlToFile(img.src)
				if (this.$isError(f)) {
					this.$toastError(f.error)
					img.remove()
					continue
				}
				try {
					const res = await uploadPhoto(f.file, this.encrypted)
					const { cid, url, image, imageName } = res
					const updatedPostImages = await this.updatePostImages(
						cid,
						image,
						imageName,
						this.encrypted ? { key: res.key, counter: res.counter } : undefined,
					)
					if (this.$isError(updatedPostImages)) {
						this.$toastError(updatedPostImages.error)
						return null
					}
					const newImg = document.createElement(`img`)
					newImg.setAttribute(`src`, url.toString())
					newImg.setAttribute(`alt`, cid)
					img.replaceWith(newImg)
				} catch (err: unknown) {
					this.waitingImage = false
					this.$handleError(err)
					return null
				}
			}
			this.waitingImage = false
			return content.body.innerHTML
		},
		async handleFile(file: File) {
			if (!validMimeTypes.includes(file.type)) {
				this.$toastError(`image of type ${file.type} is invalid`)
				return
			}
			try {
				this.waitingImage = true
				this.toggleAddContent = false
				const res = await uploadPhoto(file, this.encrypted)
				const { cid, url, image, imageName } = res
				const updatedPostImages = await this.updatePostImages(
					cid,
					image,
					imageName,
					this.encrypted ? { key: res.key, counter: res.counter } : undefined,
				)
				if (this.$isError(updatedPostImages)) {
					this.$toastError(updatedPostImages.error)
					this.waitingImage = false
					return
				}
				this.insertContent({ cid, url })
				this.waitingImage = false
			} catch (err: unknown) {
				this.waitingImage = false
				this.$handleError(err)
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
				const content = await this.handleHtml(pastedContent)
				this.insertContent(content)
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
				const target = e.target as HTMLElement
				if (target.outerHTML === `<br>`) {
					scrollContainer.scrollTop = this.addContentPosTop
					return
				}

				target.scrollIntoView()
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
				ALLOWED_TAGS: BASE_ALLOWED_TAGS,
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
		checkPost(checksOnly: boolean = false): boolean {
			const title = this.$refs.title as HTMLInputElement
			const subtitle = this.$refs.subtitle as HTMLInputElement
			this.title = title.value.trim()
			this.subtitle = subtitle.value.trim()
			const { category, tags, featuredPhotoCID, featuredPhotoCaption, encrypted } =
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]

			// Check for tiers on premium post
			if (
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted &&
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].accessTiers.length === 0
			) {
				this.$toastError(`At least one subscription tier must be selected`)
				return false
			}

			// Check for quality title
			const titleCheck = this.$qualityTitle(this.title)
			if (this.$isError(titleCheck)) {
				this.$toastError(titleCheck.error)
				return false
			}

			// Check for subtitle on encrypted posts
			if (encrypted && this.subtitle === ``) {
				this.$toastError(`Subtitles are required on encrypted premium posts`)
				return false
			}

			// Check if using a subtitle and is a quality subtitle
			const subtitleCheck = this.$qualitySubtitle(this.subtitle)
			if (this.$isError(subtitleCheck)) {
				this.$toastError(subtitleCheck.error)
				return false
			}

			// Check for quality featuredPhotoCaption
			if (featuredPhotoCaption) {
				const featuredPhotoCaptionCheck = this.$qualityFeaturedPhotoCaption(featuredPhotoCaption)
				if (this.$isError(featuredPhotoCaptionCheck)) {
					this.$toastError(featuredPhotoCaptionCheck.error)
					return false
				}
			}

			if (category === ``) {
				this.$toastError(`Missing category`)
				return false
			}

			for (const { name } of tags) {
				if (name.replace(/\s/, ``).trim() !== name) {
					this.$toastError(`Tag with spaces is not allowed`)
					return false
				}
			}

			const clean = TurndownService.turndown(this.getInputHTML())
			// Check content quality
			const contentQualityCheck = this.$qualityContent(clean)
			if (this.$isError(contentQualityCheck)) {
				this.$toastError(contentQualityCheck.error)
				return false
			}
			if (this.hasPosted) {
				return false
			}
			const postImages = createPostImagesSet(clean, allPostImages)
			if (postImages.size > textLimits.post_images.max) {
				this.$toastError(`Cannot add more than ${textLimits.post_images.max} images in a post`)
				return false
			}
			if (checksOnly) {
				return true
			}
			this.sendPost(clean, category, tags, featuredPhotoCID, featuredPhotoCaption, postImages)
			return true
		},
		async sendPost(
			clean: string,
			category: string,
			tags: Tag[],
			featuredPhotoCID?: string | null,
			featuredPhotoCaption?: string | null,
			postImages?: Map<string, IKeyData | {}>,
		): Promise<void> {
			const isEncrypted = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted
			const images = postImages ? Array.from(postImages.keys()) : undefined
			if (isEncrypted) {
				const p: IEncryptedPost = createEncryptedPost(
					this.title,
					this.subtitle,
					clean,
					category,
					tags,
					this.$store.state.session.id,
					featuredPhotoCID,
					featuredPhotoCaption,
					images,
				)
				try {
					const tiers: string[] = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].accessTiers
					const cid: string = await sendEncryptedPost(p, tiers, postImages)
					this.postImages.clear()
					allPostImages.clear()
					this.$router.push(`/post/` + cid)
				} catch (err: unknown) {
					this.$handleError(err)
				}
			} else {
				const p: IRegularPost = createRegularPost(
					this.title,
					this.subtitle === `` ? null : this.subtitle,
					clean,
					category,
					tags,
					this.$store.state.session.id,
					featuredPhotoCID,
					featuredPhotoCaption,
					images,
				)
				try {
					this.hasPosted = true
					const cid: string = await sendRegularPost(p)
					this.title = ``
					this.subtitle = ``
					this.input = ``
					this.postImages.clear()
					allPostImages.clear()
					this.$store.commit(`draft/reset`)
					this.$store.commit(`settings/setRecentlyPosted`, true)
					this.$router.push(`/post/` + cid)
				} catch (err: unknown) {
					this.hasPosted = false
					this.$handleError(err)
				}
			}
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
			if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].encrypted && subtitleInputValue === ``) {
				this.subtitleError = `Subtitle is required on encrypted posts`
				return
			}
			const subtitleQualityCheck = this.$qualitySubtitle(subtitleInputValue)
			if (this.$isError(subtitleQualityCheck)) {
				this.subtitleError = subtitleQualityCheck.error
				return
			}
			this.subtitleError = ``
		},
		async handleSave() {
			this.isSaving = `true`
			this.updateContent()
			await this.sleep(600)
			this.isSaving = `done`
			await this.sleep(800)
			this.isSaving = `false`
			this.setupEditor()
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
