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
					<div class="w-full border-b pb-5 mb-5">
						<h6 class="text-sm">Saved to <span class="font-bold underline">Drafts</span></h6>
					</div>
					<h6 class="text-primary capitalize text-sm">{{ this.category === `` ? 'Category' : this.category }}</h6>
				</article>
				<!-- Title, subtitle, author -->
				<article class="flex justify-between px-5">
					<div>
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
						<label for="subtitle" class="hidden">Subtitle:</label>
						<input
							v-model="subtitle"
							type="text"
							placeholder="Enter Subtitle"
							:class="
								this.$store.state.settings.darkMode
									? 'text-lightPrimaryText bg-lightBG placeholder-lightSecondaryText'
									: 'text-darkPrimaryText bg-darkBG placeholder-darkSecondaryText'
							"
							class="text-xl font-medium focus:outline-none w-full pb-2"
						/>
					</div>
				</article>

				<!-- WYSIWYG -->
				<div
					:v-model="this.input"
					class="editable prose max-w-none px-5 focus:outline-none py-5"
					v-html="this.$store.state.draft.content"
				></div>

				<article class="flex"></article>
			</section>

			<!-- Right column -->
			<section
				id="editor-menu"
				class="flex flex-col relative bg-lightSecondary bg-opacity-25 border-r h-auto overflow-y-auto"
			>
				<!-- Tags tab -->
				<article class="border-b mx-4">
					<button
						class="flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('tags')"
					>
						<h3>Tags</h3>
						<ChevronUp v-if="this.tabs.tags" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.tags" class="pb-4">
						<div class="flex flex-row flex-nowrap bg-white py-2 mb-2 border">
							<label for="tag" class="hidden" value="Enter hashtags"></label>
							<input
								v-model="tag"
								type="text"
								placeholder="Add a tag..."
								class="w-32 pl-2 px-1 focus:outline-none"
								@keyup.enter="addTag"
							/>
						</div>
						<div v-for="t in this.$store.state.draft.tags" :key="t.name" class="pt-2">
							<button
								class="
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
								{{ t.name }} <XIcon class="p-1 text-lightPrimary" />
							</button>
						</div>
					</div>
				</article>
				<!-- Category tab -->
				<article class="border-b mx-4">
					<button
						class="flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('category')"
					>
						<h3>Category</h3>
						<ChevronUp v-if="this.tabs.category" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.category" class="pb-4">
						<div class="dropdown_inset flex flex-col bg-white -mx-4 py-2">
							<button
								v-for="c in this.$store.state.config.categories"
								:key="c"
								class="w-full flex items-center p-2 capitalize focus:outline-none"
								@click="changeCategory(c)"
							>
								<img :src="require(`@/assets/images/category/` + c + `/icon.png`)" class="w-10 h-10 mr-1" />
								{{ c }}
							</button>
						</div>
					</div>
				</article>
				<!-- Image tab -->
				<article class="border-b mx-4">
					<button
						class="flex w-full justify-between py-4 text-xl items-center focus:outline-none"
						@click="changeTab('image')"
					>
						<h3>Image</h3>
						<ChevronUp v-if="this.tabs.image" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-show="this.tabs.image" class="pb-4">
						<div class="dropdown_inset flex flex-col bg-white -mx-4 py-2">
							<!-- Upload Featured Image -->
							<p class="px-4 py-2 text-sm">Selecting a featured image is recommended for an optimal user experience.</p>
							<button class="w-full focus:outline-none" @click="$refs.featuredPhoto.click()">
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
								<div v-show="this.featuredPhoto === null" class="flex justify-between border mx-4 my-2 p-1">
									<span class="flex items-center text-sm"> <ImageIcon class="mr-1 p-1" />IMAGE </span>
									<span class="flex items-center text-sm text-primary"> <UploadIcon class="mr-1 p-1" />Add </span>
								</div>
							</button>
							<!-- Photo Uploaded -->
							<div v-if="this.featuredPhoto !== null" class="mx-4">
								<img :src="this.featuredPhoto" class="w-full" />
								<button
									class="border border-primary text-primary focus:outline-none text-sm mt-4 p-1"
									@click="$refs.featuredPhoto.click()"
								>
									Replace Image
								</button>
								<button class="my-2 text-sm underline text-lightError focus:outline-none" @click="removeImage()">
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
import _ from 'lodash'
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
import { MutationType, namespace as sessionStoreNamespace, getProfileFromSession, Session } from '~/store/session'
import { sendProfileServer } from '~/plugins/server'

interface IData {
	title: string
	subtitle: string
	input: string
	tag: string
	featuredPhoto: null | any
	featuredPhotoCID: string
	// @ts-ignore
	editor: MediumEditor
	turndownService: Turndown
	tabs: {
		tags: boolean
		category: boolean
		image: boolean
	}
	category: string
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
			title: this.$store.state.draft.title,
			subtitle: this.$store.state.draft.subtitle,
			input,
			tag: ``,
			featuredPhoto: null,
			featuredPhotoCID: ``,
			editor: MediumEditor,
			// @ts-ignore
			turndownService: Turndown,
			tabs: {
				tags: false,
				category: false,
				image: false,
			},
			category: this.$store.state.draft.category,
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
	methods: {
		...mapMutations({
			toggle: `draft/toggleCompose`,
			updateDraft: `draft/updateDraft`,
		}),
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			appendPostCID: MutationType.APPEND_POSTCID,
		}),
		update: _.debounce(function (this: any, e: { target: { value: any } }): void {
			if (e.target) {
				// eslint-disable-next-line
				const clean: string = DOMPurify.sanitize(e.target.value, {
					USE_PROFILES: { html: true, svg: true },
				})
				// eslint-disable-next-line no-invalid-this
				this.input = clean
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
			} else {
				const t: Tag = {
					name: this.tag,
					posts: ``,
				}
				this.$store.commit(`draft/addTag`, t)
				this.tag = ``
			}
		},
		removeTag(t: Tag): void {
			this.$store.commit(`draft/removeTag`, t)
		},
		removeImage(): void {
			this.featuredPhoto = null
			this.featuredPhotoCID = ``
		},
		handleImage(e: Event): void {
			// @ts-ignore
			const image = e.target.files[0]
			const reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (i) => {
				if (i.target !== null) {
					this.uploadImage(i.target.result)
				}
			}
		},
		async uploadImage(image: any): Promise<void> {
			const cid = await this.$sendPhoto(image)
			this.featuredPhotoCID = cid
			this.downloadImage(cid)
		},
		async downloadImage(cid: any): Promise<void> {
			this.featuredPhoto = await this.$getPhoto(cid)
		},
		async post(): Promise<void> {
			this.input = this.turndownService.turndown(this.editor.getContent())
			if (this.title === `` || !this.$qualityText(this.title)) {
				alert(`Invalid title!`)
			} else if (this.subtitle === `` || !this.$qualityText(this.subtitle)) {
				alert(`Invalid subtitle!`)
			} else {
				const p: Post = {
					title: this.title,
					subtitle: this.subtitle,
					content: this.input,
					category: this.category,
					timestamp: Date.now(),
					tags: this.$store.state.draft.tags,
					authorID: this.$store.state.session.id,
					featuredPhotoCID: this.featuredPhotoCID,
				}
				const cid = await this.$sendPost(p)
				this.appendPostCID(cid)
				const profile = this.$store.state.session as Session
				this.$axios.post(`/content`, { cid, data: p })
				const pcid = await this.$sendProfile(getProfileFromSession(profile))
				const serverProfile = await sendProfileServer(pcid, getProfileFromSession(profile))
				if (!serverProfile.success) {
					alert(`Server Profile could not be updated`)
				} else {
					this.changeCID(pcid)
					const profileSet = await this.$setProfileNEAR(pcid)
					// eslint-disable-next-line no-console
					console.log(`Profile set`, profileSet)
					this.title = ``
					this.subtitle = ``
					this.input = ``
					this.$store.commit(`draft/reset`)
					this.$router.push(`/post/` + cid)
				}
			}
		},
		updateStore(): void {
			this.input = this.editor.getContent()
			this.$store.commit(`draft/updateTitle`, this.title)
			this.$store.commit(`draft/updateSubtitle`, this.subtitle)
			this.$store.commit(`draft/updateContent`, this.input)
			this.$store.commit(`draft/updateCategory`, this.category)
			this.$store.commit(`draft/updateCategory`, this.category)
			this.$router.go(-1)
		},
	},
})
</script>

<style>
#editor-menu {
	width: 18rem;
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
