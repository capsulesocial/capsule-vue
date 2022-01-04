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
					/>
				</article>

				<!-- WYSIWYG -->
				<div
					id="editor"
					ref="editor"
					class="max-w-none focus:outline-none p-2 content"
					v-html="$store.state.draft.drafts[$store.state.draft.activeIndex].content"
				></div>

				<div
					v-if="this.$store.state.widgets.primary === `editor` && this.$route.name === `home`"
					class="absolute bottom-0 right-0 z-10 m-4 px-5 py-3 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder rounded-lg shadow-lg test-xs text-gray5 modal-animation card-animation-delay1"
				>
					Time to publish?<button class="text-primary ml-2 focus:outline-none" @click="$router.push(`/post`)">
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
import Quill from 'quill'
// @ts-ignore
import QuillMarkdown from 'quilljs-markdown'
import XIcon from '@/components/icons/X.vue'
import { createRegularPost, sendRegularPost } from '@/backend/post'

interface IData {
	title: string
	subtitle: string
	input: string
	editor: Quill
	turndownService: Turndown
	wordCount: number
	titleError: string
	subtitleError: string
	hasPosted: boolean
	isSaving: string
	isX: boolean
}

export default Vue.extend({
	components: {
		XIcon,
	},
	data(): IData {
		let input: string = ``
		if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].content !== ``) {
			input = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].content
		} else {
			input = ``
		}
		return {
			title: this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].title,
			subtitle: this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].subtitle,
			input,
			// @ts-ignore
			turndownService: Turndown,
			wordCount: 0,
			titleError: ``,
			subtitleError: ``,
			hasPosted: false,
			isSaving: `false`,
			isX: false,
		}
	},
	beforeDestroy() {
		if (this.isX) {
			return
		}
		const titleInput = this.$refs.title as HTMLInputElement
		const subtitleInput = this.$refs.subtitle as HTMLInputElement
		const input = this.getInputHTML()
		if (input.length > 11 || titleInput.value !== `` || subtitleInput.value !== ``) {
			if (input.length > 11) {
				this.$store.commit(`draft/updateContent`, input)
			}
			if (titleInput.value !== ``) {
				this.$store.commit(`draft/updateTitle`, titleInput.value)
			}
			if (subtitleInput.value !== ``) {
				this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
			}
		} else {
			const i: number = this.$store.state.draft.activeIndex
			this.$store.commit(`draft/deleteDraft`, i)
		}
	},
	mounted() {
		Quill.register(`modules/counter`, (quill: Quill) => {
			quill.on(`text-change`, () => {
				const text = quill.getText()
				const n = text.split(/\s+/).length
				this.updateWordCount(n)
			})
		})
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
				toolbar: toolbarOptions,
			},
		}
		const editor = new Quill(`#editor`, options)
		this.editor = new QuillMarkdown(editor, {})
		this.turndownService = new Turndown()
		this.turndownService.addRule(`codeblock`, {
			filter: [`pre`],
			replacement: (content) => {
				// eslint-disable-next-line quotes
				return '``` \n' + content + '```'
			},
		})
		const titleInput = this.$refs.title as HTMLInputElement
		const subtitleInput = this.$refs.subtitle as HTMLInputElement
		titleInput.value = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].title
		subtitleInput.value = this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].subtitle
		this.handleTitle(null)
	},
	methods: {
		async saveContent(): Promise<void> {
			this.isX = true
			const titleInput = this.$refs.title as HTMLInputElement
			const subtitleInput = this.$refs.subtitle as HTMLInputElement
			const input = this.getInputHTML()
			if (input.length > 11 || titleInput.value !== `` || subtitleInput.value !== ``) {
				this.isSaving = `true`
				if (input.length > 11) {
					this.$store.commit(`draft/updateContent`, input)
				}
				if (titleInput.value !== ``) {
					this.$store.commit(`draft/updateTitle`, titleInput.value)
				}
				if (subtitleInput.value !== ``) {
					this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
				}
				await this.sleep(600)
				this.isSaving = `done`
				await this.sleep(800)
				if (this.$route.name === `post`) {
					this.$router.go(-1)
				}
			} else {
				if (this.$route.name === `post`) {
					this.$router.go(-1)
				}
				const i: number = this.$store.state.draft.activeIndex
				this.$store.commit(`draft/deleteDraft`, i)
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
			// Check for quality title
			if (!this.$qualityText(this.title) || this.title.length < 12 || this.title.length > 90) {
				this.$toastError(`Invalid title!`)
				return
				// Check if using a subtitle
			}
			if (this.subtitle !== `` && this.subtitle && !this.$qualityText(this.subtitle)) {
				this.$toastError(`Invalid subtitle!`)
				return
			}
			if (this.subtitle !== `` && this.subtitle.length > 180) {
				this.$toastError(`Subtitle too long!`)
				return
			}
			if (this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].category === ``) {
				this.$toastError(`Missing category`)
				return
			}
			const clean = this.getInputHTML()
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
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].category,
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].tags,
				this.$store.state.session.id,
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].featuredPhotoCID,
				this.$store.state.draft.drafts[this.$store.state.draft.activeIndex].featuredPhotoCaption,
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
			this.$store.commit(`draft/updateTitle`, titleInput.value)
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
				e.preventDefault()
				subtitleInput.focus()
			}
			titleInput.style.height = `auto`
			titleInput.style.height = `${titleInput.scrollHeight}px`
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
		handleSubtitle(e: any) {
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
			subtitleInput.style.height = `${subtitleInput.scrollHeight}px`
			if (e.inputType === `insertLineBreak` || (e.inputType === `insertText` && e.data === null)) {
				e.preventDefault()
			}
			subtitleInput.style.height = `auto`
			subtitleInput.style.height = `${subtitleInput.scrollHeight}px`
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
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
