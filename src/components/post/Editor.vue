<template>
	<div class="relative">
		<div class="flex">
			<section class="w-full">
				<!-- Title, subtitle -->
				<article class="flex flex-col px-2">
					<button
						v-if="isSaving === `false` && this.$route.name !== 'home'"
						class="absolute right-0 top-0 rounded-full bg-gray1 p-1 m-8 focus:outline-none"
						@click="saveContent"
					>
						<XIcon />
					</button>
					<article v-else-if="isSaving === `true`" class="absolute right-0 top-0 p-8 modal-animation">
						<div class="loader"></div>
					</article>
					<p v-else class="absolute right-0 top-0 p-8 pt-10 text-positive modal-animation">
						<span v-if="this.$route.name !== 'home'">Saved!</span>
					</p>
					<p class="text-xs text-lightError">{{ titleError }}</p>
					<label for="title" class="hidden">Title</label>
					<textarea
						id="title"
						ref="title"
						placeholder="Enter Title"
						class="text-h1 font-serif font-semibold break-words w-full focus:outline-none bg-transparent"
						wrap="soft"
						@beforeinput="handleTitle"
						@input="updateTitle"
					/>
				</article>

				<article class="flex flex-col px-2">
					<p class="text-xs text-lightError">{{ subtitleError }}</p>
					<label for="subtitle" class="hidden">Subtitle</label>
					<textarea
						id="subtitle"
						ref="subtitle"
						placeholder="Enter Subtitle"
						class="font-serif text-h2 mt-2 text-gray5 break-words focus:outline-none w-full bg-transparent"
						wrap="soft"
						@beforeinput="handleSubtitle"
						@input="updateSubtitle"
					/>
				</article>

				<!-- WYSIWYG -->
				<input v-show="false" id="getFile" type="file" @change="uploadFunction($event)" />
				<div
					id="editor"
					ref="editor"
					class="max-w-none editable prose focus:outline-none p-2 content"
					v-html="$store.state.draft.drafts[$store.state.draft.activeIndex].content"
				></div>

				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					id="metaButton"
					class="absolute bottom-0 right-0 z-10 m-4 px-5 py-3 mb-8 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder rounded-lg shadow-lg test-xs text-gray5 modal-animation card-animation-delay1 animatedraftButton flex"
				>
					<p v-if="!isCollapsed">Time to publish?</p>
					<PencilIcon v-else class="fill-current p-1" @close="$router.push(`/post`)" />
					<button class="text-primary ml-2 focus:outline-none" @click="$router.push(`/post`)">Add meta</button>
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
import { createRegularPost, sendRegularPost } from '@/backend/post'
import { addPhotoToIPFS, preUploadPhoto } from '@/backend/photos'
const BlockEmbed = Quill.import(`blots/block/embed`)

class ImageBlot extends BlockEmbed {
	static create(value: any) {
		const node = super.create()
		node.setAttribute(`alt`, value.alt)
		node.setAttribute(`src`, value.url)
		return node
	}

	static value(node: any) {
		return {
			alt: node.getAttribute(`alt`),
			url: node.getAttribute(`src`),
		}
	}
}

ImageBlot.blotName = `image`
ImageBlot.tagName = `img`

interface IData {
	title: string
	subtitle: string
	input: string
	editor: Quill
	qeditor: Quill
	turndownService: Turndown
	wordCount: number
	titleError: string
	subtitleError: string
	hasPosted: boolean
	isSaving: string
	isX: boolean
	isCollapsed: boolean
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

export default Vue.extend({
	components: {
		XIcon,
		PencilIcon,
	},
	data(): IData {
		let input: string = ``
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
			// @ts-ignore
			turndownService: Turndown,
			wordCount: 0,
			titleError: ``,
			subtitleError: ``,
			hasPosted: false,
			isSaving: `false`,
			isX: false,
			isCollapsed: false,
		}
	},
	beforeDestroy() {
		if (this.isX || this.$store.state.settings.recentlyPosted) {
			return
		}
		const titleInput = this.$refs.title as HTMLInputElement
		const subtitleInput = this.$refs.subtitle as HTMLInputElement
		const input = this.getInputHTML()
		if (input.length > 11 || titleInput.value !== `` || subtitleInput.value !== ``) {
			this.doSave()
		} else {
			const i: number = this.$store.state.draft.activeIndex
			this.$store.commit(`draft/deleteDraft`, i)
		}
	},
	mounted() {
		Quill.register(ImageBlot)
		Quill.register(`modules/counter`, (quill: Quill) => {
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
		})
		const editor = new Quill(`#editor`, options)
		this.qeditor = editor
		this.editor = new QuillMarkdown(editor, {})
		this.turndownService = new Turndown()
		this.turndownService.addRule(`codeblock`, {
			filter: [`pre`],
			replacement: (_, node) => {
				// eslint-disable-next-line quotes
				return '```\n' + node.textContent + '```'
			},
		})
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
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const input = this.getInputHTML()
			this.$store.commit(`draft/updateContent`, input)
			this.$store.commit(`draft/setTimestamp`, new Date())
			if (titleInput.value !== ``) {
				this.$store.commit(`draft/updateTitle`, titleInput.value)
			}
			if (subtitleInput.value !== ``) {
				this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
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
						await preUploadPhoto(cid, compressedImage)
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
			if (input.length > 11 || titleInput.value !== `` || subtitleInput.value !== ``) {
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
			const clean: string = DOMPurify.sanitize(input.innerHTML, {
				USE_PROFILES: { html: true, svg: true },
				ALLOWED_TAGS: [`pre`],
			})
			return clean
		},
		async post(): Promise<void> {
			const title = this.$refs.title as HTMLInputElement
			const subtitle = this.$refs.subtitle as HTMLInputElement
			this.title = title.value
			this.subtitle = subtitle.value
			const { category, tags, featuredPhotoCID, featuredPhotoCaption } =
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex]
			// Check for quality title
			if (
				!this.$qualityText(this.title) ||
				this.title.length < 12 ||
				this.title.length > 90 ||
				this.titleError !== ``
			) {
				this.$toastError(`Invalid title!`)
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
			let clean = this.getInputHTML()
			const images = clean.match(/<img.*?[^\>]+>/gm) // eslint-disable-line
			const parser = new DOMParser()
			if (images) {
				for (const i of images) {
					const img = parser.parseFromString(i, `text/html`)
					const cid = img.querySelector(`img`)?.getAttribute(`alt`)
					clean = clean.replace(i, `![](${cid})`)
				}
			}
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
			const p = createRegularPost(
				this.title,
				this.subtitle === `` ? null : this.subtitle,
				this.turndownService.turndown(clean),
				category,
				tags,
				this.$store.state.session.id,
				featuredPhotoCID,
				featuredPhotoCaption,
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
			if (updateStore) {
				this.$store.commit(`draft/updateTitle`, titleInput.value)
			}
			if (titleInput.value.length === 0) {
				this.titleError = `Please enter a title.`
				return
			}
			if (titleInput.value.length < 12) {
				this.titleError = `Title is too short.`
				return
			}
			if (titleInput.value.length > 90) {
				this.titleError = `Title is too long.`
				return
			}
			this.titleError = ``
		},
		updateSubtitle(updateStore: boolean = true) {
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			if (updateStore) {
				this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
			}
			if (subtitleInput.value.length === 0) {
				this.subtitleError = ``
				return
			}
			if (subtitleInput.value.length > 0 && subtitleInput.value.length < 12) {
				this.subtitleError = `Subtitle is too short.`
				return
			}
			if (subtitleInput.value.length > 180) {
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
