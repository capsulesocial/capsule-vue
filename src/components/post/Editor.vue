<template>
	<div class="relative">
		<div class="flex">
			<section class="w-full">
				<!-- Title, subtitle -->
				<article class="flex flex-col px-2">
					<button
						class="absolute right-0 top-0 rounded-full bg-gray1 p-1 m-8 focus:outline-none"
						@click="$router.go(-1)"
					>
						<XIcon />
					</button>
					<p class="text-xs text-lightError">{{ titleError }}</p>
					<label for="title" class="hidden">Title</label>
					<textarea
						id="title"
						ref="title"
						placeholder="Enter Title"
						class="text-h1 font-serif font-semibold break-words w-full focus:outline-none bg-transparent"
						wrap="soft"
						@input="handleTitle"
					/>
				</article>

				<article class="flex flex-col px-2 mb-3">
					<p class="text-xs text-lightError">{{ subtitleError }}</p>
					<label for="subtitle" class="hidden">Subtitle</label>
					<textarea
						id="subtitle"
						ref="subtitle"
						placeholder="Enter Subtitle"
						class="font-serif text-h2 mt-2 text-gray5 break-words focus:outline-none w-full bg-transparent"
						wrap="soft"
						@input="handleSubtitle"
					/>
				</article>

				<!-- WYSIWYG -->
				<div
					id="editor"
					ref="editor"
					class="max-w-none focus:outline-none p-2 content"
					v-html="$store.state.draft.content"
				></div>
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
import { createPost, sendPost } from '@/backend/post'
interface IData {
	title: string
	subtitle: string
	input: string
	editor: Quill
	turndownService: Turndown
	wordCount: number
	titleError: string
	subtitleError: string
}
export default Vue.extend({
	components: {
		XIcon,
	},
	data(): IData {
		let input: string = ``
		if (this.$store.state.draft.content !== ``) {
			input = this.$store.state.draft.content
		} else {
			input = ``
		}
		return {
			title: this.$store.state.draft.title,
			subtitle: this.$store.state.draft.subtitle,
			input,
			// @ts-ignore
			turndownService: Turndown,
			wordCount: 0,
			titleError: ``,
			subtitleError: ``,
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
		// @ts-ignore
		this.$refs.title.value = this.$store.state.draft.title
		this.handleTitle(null)
		// @ts-ignore
		this.$refs.subtitle.value = this.$store.state.draft.subtitle
	},
	beforeDestroy() {
		this.saveContent()
	},
	methods: {
		saveContent(): void {
			const input = this.getInputHTML()
			if (input !== ``) {
				this.$store.commit(`draft/updateContent`, input)
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
			// @ts-ignore
			this.title = this.$refs.title.value
			// @ts-ignore
			this.subtitle = this.$refs.subtitle.value
			// Check for quality title
			if (!this.$qualityText(this.title) || this.title.length < 12 || this.title.length > 90) {
				alert(`Invalid title!`)
				return
				// Check if using a subtitle
			}
			if (this.subtitle !== `` && this.subtitle && !this.$qualityText(this.subtitle)) {
				alert(`Invalid subtitle!`)
				return
			}
			if (this.subtitle !== `` && this.subtitle.length > 180) {
				alert(`Subtitle too long!`)
				return
			}
			if (this.$store.state.draft.category === ``) {
				alert(`Missing category`)
				return
			}
			const clean = this.getInputHTML()
			// Check content quality
			if (clean.length < 280) {
				alert(`Post body too short. Write more before posting`)
				return
			}
			if (clean.length > 100000) {
				alert(`Post body too long for IPFS deliverability`)
				return
			}
			const p = createPost(
				this.title,
				this.subtitle === `` ? null : this.subtitle,
				this.turndownService.turndown(clean),
				this.$store.state.draft.category,
				this.$store.state.draft.tags,
				this.$store.state.session.id,
				this.$store.state.draft.featuredPhotoCID,
			)
			const cid = await sendPost(p)
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
			if (e.keyCode === 13 || e.keyCode === 9) {
				e.preventDefault()
				subtitleInput.focus()
			}
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
		handleSubtitle() {
			const subtitleInput = this.$refs.subtitle as HTMLTextAreaElement
			this.$store.commit(`draft/updateSubtitle`, subtitleInput.value)
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
				this.subtitleError = `Title is too long.`
				return
			}
			this.subtitleError = ``
		},
	},
})
</script>

<style>
textarea#title {
	border: none;
	resize: none;
	overflow-y: hidden;
	height: 4rem;
}
textarea#subtitle {
	border: none;
	resize: none;
	overflow-y: hidden;
	height: 2rem;
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
</style>
