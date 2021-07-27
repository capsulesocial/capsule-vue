<template>
	<div>
		<header>
			<!-- Header and close button -->
			<article class="flex items-center justify-between p-5 border-b border-l border-r">
				<div class="flex items-center">
					<CapsuleIcon />
					<h3
						:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryVariant' : 'text-darkPrimaryVariant'"
						class="text-xl border-l-2 border-primary ml-4 pl-4"
					>
						New Post
					</h3>
				</div>
				<button class="flex items-center" @click="updateStore">
					<CloseIcon />
				</button>
			</article>
		</header>

		<div class="flex h-screen pt-24 -mt-24">
			<section
				class="w-full border-l"
				:class="
					this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'
				"
			>
				<!-- Title, subtitle, author -->
				<article class="p-5 flex justify-between">
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
							class="text-4xl focus:outline-none text-xl w-full pb-2"
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
							class="text-2xl focus:outline-none text-xl w-full pb-2"
						/>
						<h6
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="text-sm pb-4"
						>
							By: {{ this.$store.state.session.name }}
						</h6>
					</div>
				</article>

				<article class="px-5">
					<img v-if="this.featuredPhoto !== null" :src="this.featuredPhoto" />
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
			<section class="w-64 border-l border-r flex flex-col relative bg-lightSecondary bg-opacity-25">
				<!-- Tags tab -->
				<article class="border-b">
					<button class="flex w-full justify-between p-4 text-xl items-center" @click="changeTab('tags')">
						<h3>Tags</h3>
						<ChevronUp v-if="this.tabs.tags" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-if="this.tabs.tags">
						<label for="tag" class="hidden" value="Enter hashtags"></label>
						#<input v-model="tag" type="text" placeholder="tag" class="focus:outline-none w-32 pr-1 py-2 pl-1" />
						<button class="rounded-full bg-primary border border-white p-2 focus:outline-none" @click="addTag">
							<span class="text-white"><PlusIcon /></span>
						</button>
						<button v-for="t in this.$store.state.draft.tags" :key="t.name" class="ml-1" @click="removeTag(t)">
							<TagCard :tag="t.name" /> ❌
						</button>
					</div>
				</article>
				<!-- Category tab -->
				<article class="border-b">
					<button class="flex w-full justify-between p-4 text-xl items-center" @click="changeTab('category')">
						<h3>Category</h3>
						<ChevronUp v-if="this.tabs.category" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-if="this.tabs.category">Display category list</div>
				</article>
				<!-- Image tab -->
				<article class="border-b">
					<button class="flex w-full justify-between p-4 text-xl items-center" @click="changeTab('image')">
						<h3>Image</h3>
						<ChevronUp v-if="this.tabs.image" />
						<ChevronDown v-else />
					</button>
					<!-- Dropdown -->
					<div v-if="this.tabs.image">
						<!-- Upload Featured Image -->
						<button class="rounded-lg px-4 py-2" @click="$refs.featuredPhoto.click()">
							<input
								id="featured-photo"
								ref="featuredPhoto"
								class="hidden"
								name="photo"
								type="file"
								accept="image/*"
								@change="handleImage"
							/>
							<div class="flex justify-center items-center focus:outline-none">
								<CameraIcon class="mr-2" />
								<span class="">Photo</span>
							</div>
						</button>
					</div>
				</article>
				<div></div>

				<BrandedButton
					text="Publish"
					:action="post"
					class="absolute justify-self-end w-32 h-12 self-center mr-5 bottom-0"
				/>
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

import CameraIcon from '@/components/icons/Camera.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PlusIcon from '@/components/icons/Plus.vue'
import TagCard from '@/components/Tag.vue'
import CloseIcon from '@/components/icons/Close.vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

import { Post } from '@/interfaces/Post'
import { Tag } from '@/interfaces/Tag'
import { Profile } from '@/interfaces/Profile'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
export default Vue.extend({
	components: {
		BrandedButton,
		CameraIcon,
		PlusIcon,
		TagCard,
		CloseIcon,
		CapsuleIcon,
		ChevronUp,
		ChevronDown,
	},
	data() {
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
			turndownService: Turndown,
			tabs: {
				tags: false,
				category: false,
				image: false,
			},
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
			addPost: MutationType.ADD_POST,
			changeCID: MutationType.CHANGE_CID,
		}),
		update: _.debounce(function (this: any, e): void {
			const clean: string = DOMPurify.sanitize(e.target.value, {
				USE_PROFILES: { html: true, svg: true },
			})
			// eslint-disable-next-line no-invalid-this
			this.input = clean
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
		removeTag(t): void {
			this.$store.commit(`draft/removeTag`, t)
		},
		handleImage(e): void {
			const image = e.target.files[0]
			const reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (i) => {
				if (i.target !== null) {
					this.uploadImage(i.target.result)
				}
			}
		},
		uploadImage(image): void {
			this.$sendPhoto(image).then((cid) => {
				this.featuredPhotoCID = cid
				this.downloadImage(cid)
			})
		},
		downloadImage(cid): void {
			this.$getPhoto(cid).then((image) => {
				this.featuredPhoto = image
			})
		},
		post(): void {
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
					cid: ``,
					id: ``,
					timestamp: new Date(),
					tags: this.$store.state.draft.tags,
					comments: [],
					bookmarks: [],
					authorID: this.$store.state.session.id,
					authorCID: this.$store.state.session.cid,
					featuredPhotoCID: this.featuredPhotoCID,
				}
				this.$sendPost(p).then((cid: string) => {
					p.cid = cid
					this.$store.commit(`posts/addPost`, cid)
					this.addPost(cid)
					const profile: Profile = this.$store.state.session
					this.$sendProfile(profile).then((pcid) => {
						this.changeCID(pcid)
						this.title = ``
						this.subtitle = ``
						this.input = ``
						this.$store.commit(`draft/reset`)
						this.$router.push(`/post/` + cid)
					})
				})
			}
		},
		updateStore(): void {
			this.input = this.editor.getContent()
			this.$store.commit(`draft/updateTitle`, this.title)
			this.$store.commit(`draft/updateSubtitle`, this.subtitle)
			this.$store.commit(`draft/updateContent`, this.input)
			this.$router.go(-1)
		},
	},
})
</script>

<style>
.medium-toolbar-arrow-under:after {
	border-color: #ffffff transparent transparent transparent;
}
.medium-toolbar-arrow-over:before {
	border-color: transparent transparent #ffffff transparent;
}
.medium-editor-anchor-preview a {
	color: red;
}
</style>
