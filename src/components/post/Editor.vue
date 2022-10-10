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
				<qeditor
					ref="editor"
					:initialContent="$store.state.draft.drafts[$store.state.draft.activeIndex].content"
					:initialEditorImages="postImages"
					:validImageTypes="validMimeTypes"
					:imageUploader="uploadPhoto"
					:isPrimaryWidget="this.$store.state.widgets.primary === `editor`"
					:allowedTags="BASE_ALLOWED_TAGS"
					:maxPostImages="10"
					:encryptedContent="encrypted"
					@editorImageUpdates="editorImageUpdated"
					@updateWordCount="updateWordCount"
					@isWriting="isWriting"
					@onError="handleEditorError"
				/>
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
import type { Quill } from 'quill'
import TurndownService from '../editor/TurndownService'
import Qeditor from '@/components/editor/QEditor.vue'
import XIcon from '@/components/icons/X.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
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
import { createEditorImageSet } from '@/pages/post/quillExtensions'

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
	validMimeTypes: string[]
	BASE_ALLOWED_TAGS: string[]
}

const allPostImages = new Map()

export default Vue.extend({
	components: {
		XIcon,
		PencilIcon,
		Qeditor,
	},
	data(): IData {
		let input: string = ``
		// eslint-disable-next-line @typescript-eslint/no-unused-vars
		const { content, title, subtitle } = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
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
			validMimeTypes,
			BASE_ALLOWED_TAGS,
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
	mounted() {
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
	beforeDestroy() {
		if (this.isX || this.$store.state.settings.recentlyPosted) {
			return
		}
		const titleInput = this.$refs.title as HTMLInputElement
		const subtitleInput = this.$refs.subtitle as HTMLInputElement
		const input = this.editorHtml()
		if (input.length > 11 || titleInput.value.trim() !== `` || subtitleInput.value.trim() !== ``) {
			this.doSave()
		} else {
			const i: number = this.$store.state.draft.activeIndex
			this.$store.commit(`draft/deleteDraft`, i)
		}
	},
	methods: {
		uploadPhoto,
		editorImageUpdated(updates: any) {
			this.postImages = updates.editorImages
			this.updateDraftPostImages()
			if (updates.newImage) {
				const { cid, image, imageName } = updates.newImage
				preUploadPhoto(cid, image, imageName, this.$store.state.session.id, this.encrypted)
			}
		},
		isWriting(changed: boolean) {
			this.$emit(`isWriting`, changed)
			const metaButton = document.getElementById(`metaButton`)
			if (metaButton) {
				if (changed) {
					metaButton.classList.add(`hidemetaButton`)
					this.isCollapsed = true
				} else {
					metaButton.classList.remove(`hidemetaButton`)
					this.isCollapsed = false
				}
			}
		},
		handleEditorError(error: string) {
			this.$toastError(error)
		},
		editorHtml() {
			const editor = this.$refs.editor as any
			if (!editor) {
				return ``
			}
			return editor.getInputHTML()
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
		doSave() {
			const titleInput = this.$refs.title as HTMLInputElement
			const titleInputValue = titleInput.value.trim()
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const subtitleInputValue = subtitleInput.value.trim()
			const editorHtml = this.editorHtml()
			this.$store.commit(`draft/updateContent`, editorHtml)
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
			const editorHtml = this.editorHtml()
			if (editorHtml !== ``) {
				this.$store.commit(`draft/updateContent`, editorHtml)
			}
		},
		async saveContent(): Promise<void> {
			this.isX = true
			const titleInput = this.$refs.title as HTMLInputElement
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const editorHtml = this.editorHtml()
			if (editorHtml.length > 11 || titleInput.value.trim() !== `` || subtitleInput.value.trim() !== ``) {
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
			this.wordCount = n
			this.$emit(`updateWordCount`, this.wordCount)
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

			const clean = TurndownService.turndown(this.editorHtml())
			// Check content quality
			const contentQualityCheck = this.$qualityContent(clean)
			if (this.$isError(contentQualityCheck)) {
				this.$toastError(contentQualityCheck.error)
				return false
			}
			if (this.hasPosted) {
				return false
			}
			const postImages = createEditorImageSet(clean, allPostImages)
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
			const editor = this.$refs.editor as any
			editor?.setupEditor()
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
</style>
