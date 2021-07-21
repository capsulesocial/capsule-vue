<template>
  <section
    class="w-full h-auto border-l border-r"
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'"
  >
    <!-- Header and close button -->
    <article
      :class="this.$store.state.settings.darkMode ? 'text-lightOnSurfaceVariantText bg-lightSurfaceVariant bg-opacity-25' : 'text-darkOnSurfaceVariantText bg-darkSurfaceVariant bg-opacity-75'"
      class="flex items-center justify-between p-5 border-b"
    >
      <div class="flex items-center">
        <h3 class="font-bold text-2xl pr-4">
          New Post
        </h3>
        <h6
          :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryVariant' : 'text-darkPrimaryVariant'"
        >
          Category
        </h6>
      </div>
      <button class="flex items-center" @click="updateStore">
        Save and Close
        <CloseIcon class="ml-2" />
      </button>
    </article>

    <!-- Title, subtitle, author -->
    <article class="p-5 flex justify-between">
      <div>
        <label for="title" class="hidden">Title</label>
        <input
          v-model="title"
          type="text"
          placeholder="Enter Title"
          :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG placeholder-lightSecondaryText' : 'text-darkPrimaryText bg-darkBG placeholder-darkSecondaryText'"
          class="text-4xl focus:outline-none text-xl w-full pb-2"
        />
        <label for="subtitle" class="hidden">Subtitle:</label>
        <input
          v-model="subtitle"
          type="text"
          placeholder="Enter Subtitle"
          :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG placeholder-lightSecondaryText' : 'text-darkPrimaryText bg-darkBG placeholder-darkSecondaryText'"
          class="text-2xl focus:outline-none text-xl w-full pb-2"
        />
        <h6
          :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
          class="text-sm pb-4"
        >
          By: {{ this.$store.state.session.name }}
        </h6>
      </div>
      <div>
        <!-- Upload Featured Image -->
        <button
          class="rounded-lg px-4 py-2"
          :class="this.$store.state.settings.darkMode ? 'bg-lightSecondary text-lightOnSecondaryText' : 'bg-darkSecondary text-darkOnSecondaryText'"
          @click="$refs.featuredPhoto.click()"
        >
          <input
            id="featured-photo"
            ref="featuredPhoto"
            class="hidden"
            name="photo"
            type="file"
            accept="image/*"
            @change="handleImage"
          >
          <div
            class="flex justify-center items-center focus:outline-none"
          >
            <CameraIcon class="mr-2" />
            <span class="w-32">Featured Photo</span>
          </div>
        </button>
      </div>
    </article>

    <article class="px-5">
      <img
        v-if="this.featuredPhoto !== null"
        :src="this.featuredPhoto"
      />
    </article>

    <!-- WYSIWYG -->
    <article class="px-5">
      <div
        :v-model="this.input"
        class="editable focus:outline-none h-64 border-t border-b py-5"
      ></div>
    </article>

    <article class="flex">
      <!-- Bottom footer: Tags and Publish button -->
      <footer
        class="w-full p-5 flex flex-row justify-between"
      >
        <TagCard v-for="t in this.tags" :key="t.name" :tag="t.name" />
        <div
          :class="this.$store.state.settings.darkMode ? 'border-lightBorder bg-lightBG' : 'border-darkBorder bg-darkBG'"
          class="flex flex-nowrap overflow-x-auto items-center border rounded-full"
        >
          <span
            :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
            class="flex flex-no-wrap items-center rounded-full pl-4"
          >
            <label for="tag" class="hidden" value="Enter hashtags"></label>
            #<input
              v-model="tag"
              type="text"
              placeholder="tag"
              :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText placeholder-lightSecondaryText' : 'bg-darkBG  text-darkPrimaryText placeholder-darkSecondaryText'"
              class="focus:outline-none w-32 pr-1 py-2 pl-1"
            />
          </span>
          <button
            class="rounded-full bg-primary border border-white p-2 focus:outline-none"
            @click="addTag"
          >
            <span class="text-white"><PlusIcon /></span>
          </button>
          <span v-for="t in this.tags" :key="t.name" class="flex flex-no-wrap items-center mx-2">
            <h6 class="inline">#{{ t['name'] }}</h6>
            <button class="ml-1" @click="removeTag(t)">❌</button></span>
        </div>
      </footer>
      <BrandedButton
        text="Publish"
        :action="post"
        class="preview justify-self-end w-32 h-12 self-center mr-5"
      />
    </article>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'
// import { postsMutationType, namespace as postsStoreNamespace, Posts} from '~/store/posts'

import _ from 'lodash'
import DOMPurify from 'dompurify'
import MediumEditor from 'medium-editor'
import Turndown from 'turndown'

import CameraIcon from '@/components/icons/Camera.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PlusIcon from '@/components/icons/Plus.vue'
import TagCard from '@/components/Tag.vue'
import CloseIcon from '@/components/icons/Close.vue'

import { Post } from '@/interfaces/Post'
import { Tag } from '@/interfaces/Tag'
import { Profile } from '@/interfaces/Profile'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { actionType, namespace as settingStoreNamespace } from '~/store/settings'

export default Vue.extend({
	components: {
		BrandedButton,
		CameraIcon,
		PlusIcon,
		TagCard,
		CloseIcon,
	},
	data () {
		let input: string = ``
		if (this.$store.state.draft.content !== ``) {
			input = this.$store.state.draft.content
		} else {
			input = ``
		}
		const tags: Tag[] = []
		return {
			title: this.$store.state.draft.title,
			subtitle: this.$store.state.draft.subtitle,
			input,
			showPreview: false,
			mobileState: `edit`,
			tags,
			tag: ``,
			featuredPhoto: null,
			featuredPhotoCID: ``,
			editor: MediumEditor,
			turndownService: Turndown,
		}
	},
	mounted () {
		this.editor = new MediumEditor(`.editable`, {
			spellcheck: false,
			placeholder: {
				text: `Click to edit`,
			},
			paste: {
				cleanPastedHTML: true,
			},
		})
		this.turndownService = new Turndown()
	},
	methods: {
		...mapActions(settingStoreNamespace, {
			toggleDraftMode: actionType.TOGGLE_DRAFT_MODE,
		}),
		...mapMutations({
			toggle: `draft/toggleCompose`,
			updateDraft: `draft/updateDraft`,
		}),
		...mapMutations(sessionStoreNamespace, {
			addPost: MutationType.ADD_POST,
			changeCID: MutationType.CHANGE_CID,
		}),
		toggleComposeState (state): void {
			this.mobileState = state
		},
		update: _.debounce(function (this: any, e): void {
			const clean: string = DOMPurify.sanitize(e.target.value, {
				USE_PROFILES: { html: true, svg: true },
			})
			// eslint-disable-next-line no-invalid-this
			this.input = clean
		}, 300),
		addTag (): void {
			if (this.tag === `` || !this.$qualityText(this.tag)) {
				alert(`Invalid tag!`)
			} else {
				const t: Tag = {
					name: this.tag,
					posts: ``,
				}
				this.tags.push(t)
				this.tag = ``
			}
		},
		removeTag (tag): void {
			// Remove
			const index = this.tags.indexOf(tag)
			if (index > -1) {
				this.tags.splice(index, 1)
			}
		},
		handleImage (e): void {
			const image = e.target.files[0]
			const reader = new FileReader()
			reader.readAsDataURL(image)
			reader.onload = (i) => {
				if (i.target !== null) {
					this.uploadImage(i.target.result)
				}
			}
		},
		uploadImage (image): void {
			this.$sendPhoto(image).then((cid) => {
				this.featuredPhotoCID = cid
				this.downloadImage(cid)
			})
		},
		downloadImage (cid): void {
			this.$getPhoto(cid).then((image) => {
				this.featuredPhoto = image
			})
		},
		post (): void {
			// eslint-disable-next-line
      // this.input = this.turndownService.turndown(this.editor.getContent())
			this.input = this.editor.getContent()
			if (this.title === `` || !this.$qualityText(this.title)) {
				alert(`Invalid title!`)
			} else if (this.subtitle === `` || !this.$qualityText(this.subtitle)) {
				alert(`Invalid subtitle!`)
			} else {
				const date = new Date()
				const p: Post = {
					title: this.title,
					subtitle: this.subtitle,
					content: this.input,
					cid: ``,
					id: ``,
					timestamp: date,
					tags: this.tags,
					comments: [],
					bookmarks: [],
					authorID: this.$store.state.session.id,
					authorCID: this.$store.state.session.cid,
					featuredPhotoCID: this.featuredPhotoCID,
				}
				// sending post to IPFS. Returns Content Address
				this.$sendPost(p).then((cid) => {
					// eslint-disable-next-line no-console
					p.cid = cid
					// Adding post to local profile object
					this.$store.commit(`posts/addPost`, p)
					this.addPost(p)
					const profile: Profile = this.$store.state.session
					// Sending updated profile to IPFS.
					// Returns upd ated content address
					this.$sendProfile(profile).then((pcid) => {
						this.changeCID(pcid)
						// Reset draft & redirect
						this.toggleDraftMode()
						this.title = ``
						this.subtitle = ``
						this.input = ``
						this.tags = []
						this.$router.push(`/post/` + cid)
					})
				})
			}
		},
		updateStore (): void {
			this.input = this.editor.getContent()
			this.$store.commit(`draft/updateDraft`, {
				title: this.title,
				subtitle: this.subtitle,
				content: this.input,
				tags: this.tags,
			})
			this.$router.go(-1)
		},
	},
})
</script>

<style>
.medium-toolbar-arrow-under:after {
  border-color: #242424 transparent transparent transparent
}
.medium-toolbar-arrow-over:before {
  border-color: transparent transparent #242424 transparent
}
.medium-editor-anchor-preview a  {
  color: red;
}
</style>
