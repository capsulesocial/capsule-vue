<template>
	<div class="relative">
		<div class="absolute flex right-0 items-center h-24">
			<BrandedButton text="Publish" :action="post" class="w-32 h-12 mr-4" />
			<button class="flex items-center bg-lightSecondary rounded-full p-2 focus:outline-none" @click="updateStore">
				<XIcon />
			</button>
		</div>

		<div class="flex h-screen pt-24 -mt-24">
			<section
				class="w-full shadow-lg border-l border-r px-10 overflow-y-auto"
				:class="
					this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'
				"
			>
				<!-- Save to Drafts & Category -->
				<article class="p-5">
					<div class="flex justify-between w-full border-b pb-5 mb-5">
						<h6 class="text-sm italic">Auto-save on Close</h6>
						<h6 class="text-sm">
							<span class="font-bold text-primary">{{ wordCount }}</span> words
						</h6>
					</div>
					<h6 class="text-primary capitalize text-sm">{{ this.category === `` ? 'Category' : this.category }}</h6>
				</article>
				<!-- Title, author -->
				<article class="flex justify-between px-5">
					<label for="title" class="hidden">Title</label>
					<input
						v-model="title"
						type="text"
						placeholder="Enter Title"
						:class="
							this.$store.state.settings.darkMode
								? 'text-lightPrimaryText bg-lightBG placeholder-lightSecondaryText'
								: 'text-darkPrimaryText bg-darkBG placeholder-darkSecondaryText'
						"
						class="font-serif font-bold text-3xl leading-loose focus:outline-none w-full pb-2"
					/>
				</article>

				<!-- WYSIWYG -->
				<div
					:v-model="this.input"
					class="editable prose max-w-none px-5 focus:outline-none py-5"
					@keyup="update"
					v-html="this.$store.state.draft.content"
				></div>
			</section>

			<!-- Right column -->
			<section
				id="editor-menu"
				class="flex flex-col relative bg-lightSecondary bg-opacity-25 border-r h-auto overflow-y-auto"
			>
				<!-- Tags tab -->
				<article class="toggle border-b mx-4">
					<button
						class="toggle flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('tags')"
					>
						<h4 class="toggle">Tags</h4>
						<ChevronUp v-if="this.tabs.tags" class="toggle" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.tags" class="hotzone pb-4">
						<div class="hotzone flex flex-row flex-nowrap bg-white py-2 mb-2 border">
							<label for="tag" class="hidden" value="Enter hashtags"></label>
							<input
								v-model="tag"
								type="text"
								placeholder="Add a tag..."
								class="w-32 pl-2 px-1 focus:outline-none"
								@keyup.enter="addTag"
							/>
						</div>
						<div v-for="t in this.$store.state.draft.tags" :key="t.name" class="hotzone pt-2">
							<button
								class="
									hotzone
									flex
									items-center
									rounded-xl
									shadow-lg
									text-primary
									bg-white
									text-sm
									pl-3
									pr-1
									mt-2
									focus:outline-none
								"
								@click="removeTag(t)"
							>
								{{ t.name }} <XIcon class="hotzone p-1 text-lightPrimary" />
							</button>
						</div>
					</div>
				</article>
				<!-- Category tab -->
				<article class="toggle border-b mx-4">
					<button
						class="toggle flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('category')"
					>
						<h4 class="toggle">Category</h4>
						<ChevronUp v-if="this.tabs.category" class="toggle" />
						<ChevronDown v-else class="toggle" />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.category" class="hotzone pb-4 py-2">
						<div class="dropdown_inset hotzone flex flex-col bg-white -mx-4 py-1">
							<button
								v-for="c in this.categoryList"
								:key="c"
								class="hotzone w-full flex items-center px-2 capitalize focus:outline-none h-10"
								@click="changeCategory(c)"
							>
								<img :src="require(`@/assets/images/category/` + c + `/icon.png`)" class="hotzone w-6 h-6 mr-1 ml-2" />
								<span
									class="border-b ml-2"
									:class="
										category === c ? 'border-primary text-primary' : ' border-transparent text-lightPrimaryVariant'
									"
								>
									{{ c }}</span
								>
							</button>
						</div>
					</div>
				</article>
				<!-- Image tab -->
				<article class="toggle border-b mx-4">
					<button
						class="toggle flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('image')"
					>
						<h4 class="toggle">Image</h4>
						<ChevronUp v-if="this.tabs.image" class="toggle" />
						<ChevronDown v-else class="toggle" />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.image" class="hotzone pb-4">
						<div class="hotzone dropdown_inset hotzone flex flex-col bg-white -mx-4 py-2">
							<!-- Upload Featured Image -->
							<p class="hotzone px-4 py-2 text-sm">
								Selecting a featured image is recommended for an optimal user experience.
							</p>
							<button class="hotzone w-full focus:outline-none" @click="$refs.featuredPhoto.click()">
								<input
									id="featured-photo"
									ref="featuredPhoto"
									class="hidden"
									name="photo"
									type="file"
									accept="image/*"
									@change="handleImage"
								/>
								<!-- No Photo Uploaded -->
								<div v-show="this.featuredPhoto === null" class="hotzone flex justify-between border mx-4 my-2 p-1">
									<span class="hotzone flex items-center text-sm"> <ImageIcon class="hotzone mr-1 p-1" />IMAGE</span>
									<span class="hotzone flex items-center text-sm text-primary">
										<UploadIcon class="hotzone mr-1 p-1" />Add
									</span>
								</div>
							</button>
							<!-- Photo Uploaded -->
							<div v-if="this.featuredPhoto !== null" class="hotzone mx-4">
								<img :src="this.featuredPhoto" class="hotzone w-full" />
								<button
									class="hotzone border border-primary text-primary focus:outline-none text-sm mt-4 p-1"
									@click="$refs.featuredPhoto.click()"
								>
									Replace Image
								</button>
								<button
									class="hotzone my-2 text-sm underline text-lightError focus:outline-none"
									@click="removeImage()"
								>
									Remove Image
								</button>
							</div>
						</div>
					</div>
				</article>
			</section>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import debounce from 'lodash/debounce'
import DOMPurify from 'dompurify'
import MediumEditor from 'medium-editor'
import Turndown from 'turndown'

import ImageIcon from '@/components/icons/Image.vue'
import UploadIcon from '@/components/icons/Upload.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import XIcon from '@/components/icons/X.vue'

import { Post } from '@/interfaces/Post'
import { Tag } from '@/interfaces/Tag'
import { categories } from '@/config'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

interface IData {
	categoryList: string[]
	title: string
	input: string
	tag: string
	featuredPhoto: null | any
	featuredPhotoCID: string | null
	// @ts-ignore
	editor: MediumEditor
	turndownService: Turndown
	tabs: {
		tags: boolean
		category: boolean
		image: boolean
	}
	category: string
	wordCount: number
}

export default Vue.extend({
	components: {
		BrandedButton,
		ImageIcon,
		UploadIcon,
		ChevronUp,
		ChevronDown,
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
			categoryList: categories,
			title: this.$store.state.draft.title,
			input,
			tag: ``,
			featuredPhoto: null,
			featuredPhotoCID: null,
			editor: MediumEditor,
			// @ts-ignore
			turndownService: Turndown,
			tabs: {
				tags: false,
				category: false,
				image: false,
			},
			category: this.$store.state.draft.category,
			wordCount: 0,
		}
	},
	mounted() {
		this.editor = new MediumEditor(`.editable`, {
			spellcheck: false,
			placeholder: {
				text: `Click to edit`,
			},
			paste: {
				cleanPastedHTML: true,
			},
			toolbar: {
				buttons: [`bold`, `italic`, `underline`, `anchor`, `h1`, `h2`, `h3`, `quote`],
			},
		})
		this.turndownService = new Turndown()
	},
	created() {
		// Set filter dropdown event handler
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown)
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			appendPostCID: MutationType.APPEND_POSTCID,
		}),
		update: debounce(function (this: any, e: { target: { value: any } }): void {
			if (e.target) {
				// eslint-disable-next-line
				const clean: string = DOMPurify.sanitize(this.editor.getContent(), {
					USE_PROFILES: { html: true, svg: true },
				})
				// eslint-disable-next-line no-invalid-this
				this.input = clean
				let count = clean.replace(/<[^>]*>/g, ` `)
				count = count.replace(/\s+/g, ` `)
				count.trim()
				// eslint-disable-next-line no-invalid-this
				this.wordCount = count.split(` `).length - 2
			}
		}, 300),
		changeTab(t: string) {
			if (t === `tags`) {
				this.tabs.tags = !this.tabs.tags
			} else if (t === `category`) {
				this.tabs.category = !this.tabs.category
			} else if (t === `image`) {
				this.tabs.image = !this.tabs.image
			}
		},
		changeCategory(c: string) {
			this.category = c
		},
		addTag(): void {
			if (this.tag === `` || !this.$qualityText(this.tag)) {
				alert(`Invalid tag!`)
				return
			}
			const tagList = this.$store.state.draft.tags
			if (tagList.some((t: Tag) => t.name === this.tag)) {
				alert(`Duplicate tag!`)
				return
			}
			if (tagList.length > 2) {
				alert(`Max: 3 tags`)
				return
			}
			const t: Tag = {
				name: this.tag,
			}
			this.$store.commit(`draft/addTag`, t)
			this.tag = ``
		},
		removeTag(t: Tag): void {
			this.$store.commit(`draft/removeTag`, t)
		},
		removeImage(): void {
			this.featuredPhoto = null
			this.featuredPhotoCID = null
		},
		handleImage(e: Event): void {
			// @ts-ignore
			const image = e.target.files[0]
			if (image) {
				const reader = new FileReader()
				reader.readAsDataURL(image)
				reader.onload = (i) => {
					if (i.target !== null) {
						this.uploadImage(i.target.result)
					}
				}
			}
		},
		async uploadImage(image: any): Promise<void> {
			const cid = await this.$sendPhoto(image)
			this.featuredPhotoCID = cid
			this.downloadImage(cid)
		},
		async downloadImage(cid: string): Promise<void> {
			this.featuredPhoto = await this.$getPhoto(cid)
		},
		async post(): Promise<void> {
			if (!this.$qualityText(this.title)) {
				alert(`Invalid title!`)
			} else {
				// Sanitize HTML
				const clean: string = DOMPurify.sanitize(this.editor.getContent(), {
					USE_PROFILES: { html: true, svg: true },
				})
				// Convert to Markdown
				this.input = this.turndownService.turndown(clean)
				const p: Post = {
					title: this.title.trim(),
					content: this.input,
					category: this.category,
					timestamp: Date.now(),
					tags: this.$store.state.draft.tags,
					authorID: this.$store.state.session.id,
					featuredPhotoCID: this.featuredPhotoCID,
				}
				const cid = await this.$sendPost(p)
				this.appendPostCID(cid)
				this.$axios.post(`/content`, { cid, data: p })
				this.title = ``
				this.input = ``
				this.$store.commit(`draft/reset`)
				this.$store.commit(`settings/setRecentlyPosted`, true)
				this.$router.push(`/post/` + cid)
			}
		},
		updateStore(): void {
			this.input = this.editor.getContent()
			this.$store.commit(`draft/updateTitle`, this.title)
			this.$store.commit(`draft/updateContent`, this.input)
			this.$store.commit(`draft/updateCategory`, this.category)
			this.$router.go(-1)
		},
		handleDropdown(e: any): void {
			// Check if any tabs are open
			if (this.tabs.tags || this.tabs.category || this.tabs.image) {
				// Check if event is outside HTML to prevent errors
				if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
					return
				}
				// Check if clicking a button to open a tab
				if (e.target.parentNode.classList.contains(`toggle`)) {
					return
				}
				// Check if clicking inside a dropdown
				if (e.target.parentNode.classList.contains(`hotzone`)) {
					return
				}
				// Close tabs
				this.tabs.tags = false
				this.tabs.category = false
				this.tabs.image = false
			}
		},
	},
})
</script>

<style>
#editor-menu {
	width: 18rem;
}
.medium-editor-toolbar {
	background-color: #ffffff;
	border-color: black;
	border-radius: 0.75rem;
	--tw-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
	box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), var(--tw-shadow);
}
.medium-toolbar-arrow-under:after {
	border-color: #ffffff transparent transparent transparent;
}
.medium-toolbar-arrow-over:before {
	border-color: transparent transparent #ffffff transparent;
}
.medium-editor-anchor-preview a {
	color: red;
}
.dropdown_inset {
	box-shadow: inset 0px 0px 3px #0020ff;
}
</style>
