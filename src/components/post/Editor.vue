<template>
  <section
    class="w-full h-auto mt-16 pt-2 border-l border-r"
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
        >Category</h6>
      </div>
      <h6>Saved to drafts</h6>
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

    <article class="p-5">
      <!-- Preview Content -->
      <div
        v-if="showPreview"
        class="preview w-full"
        @click="showPreview = false"
      >
        <div class="flex items-center h-12 border-b">
          <PencilIcon />
          <p class="pl-2">
            Post preview: Click to Edit
          </p>
        </div>
        <div
          class="prose preview w-full h-64"
          v-html="compiledMarkdown"
        ></div>
      </div>
      <!-- Show Editor -->
      <!-- <div v-else class="editor">
        <div
          :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
          class="w-full flex editor h-12"
        >
          <button class="p-2 editor" @click="addMarkdown('**', true)">
            <BoldIcon class="editor" />
          </button>
          <button class="p-2 editor" @click="addMarkdown('*', true)">
            <ItalicIcon class="editor" />
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n* ')">
            <ListIcon class="editor" />
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n1. ')">
            1.
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n# ')">
            H1
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n## ')">
            H2
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n### ')">
            H3
          </button>
          <button class="p-2 editor" @click="addMarkdown('\n> ')">
            <QuoteIcon class="editor" />
          </button>
          <button class="px-2 editor" @click="addMarkdown('\n```\n', true)">
            <CodeIcon class="editor" />
          </button>
          <button class="p-2 editor" @click="addMarkdown('[title](https://www.example.com)')">
            <LinkIcon class="editor" />
          </button>
          <button
            class="px-2 editor"
            @click="addMarkdown('![alt text](https://picsum.photos/200)')"
          >
            <ImageIcon class="editor" />
          </button>
        </div> -->
        <!-- Text area -->
        <!-- <textarea
          ref="ta"
          :value="input"
          :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText border-lightBorder bg-lightBG' : 'text-darkPrimaryText border-darkBorder bg-darkBG focus:outline-none'"
          class="w-full border-t border-b h-64 focus:outline-none"
          @input="update"
        ></textarea> -->
        <VueSimplemde v-model="input" :sanitize="true" :highlight="false" :configs=" { spellChecker: false }" />
        <!-- <h6> {{ this.input.length }} characters</h6> -->
      <!-- </div> -->
    </article>

    <article class="flex">
      <!-- Bottom footer: Tags and Publish button -->
      <footer v-if="this.showPreview === true" class="w-full p-5">
        <TagCard v-for="t in this.tags" :key="t.name" :tag="t.name" />
      </footer>
      <footer
        v-else
        class="editor w-full p-5 flex flex-row justify-between"
      >
        <div
          :class="this.$store.state.settings.darkMode ? 'border-lightBorder bg-lightBG' : 'border-darkBorder bg-darkBG'"
          class="editor flex flex-nowrap overflow-x-auto items-center border rounded-full"
        >
          <span
            :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
            class="editor flex flex-no-wrap items-center rounded-full pl-4"
          >
            <label for="tag" class="hidden" value="Enter hashtags"></label>
            #<input
              v-model="tag"
              type="text"
              placeholder="tag"
              :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText placeholder-lightSecondaryText' : 'bg-darkBG  text-darkPrimaryText placeholder-darkSecondaryText'"
              class="editor focus:outline-none w-32 pr-1 py-2 pl-1"
            />
          </span>
          <button
            class="editor rounded-full bg-primary border border-white p-2 focus:outline-none"
            @click="addTag"
          >
            <span class="editor text-white"><PlusIcon class="editor" /></span>
          </button>
          <span v-for="t in this.tags" :key="t.name" class="editor flex flex-no-wrap items-center mx-2">
            <h6 class="editor inline">#{{ t['name'] }}</h6>
            <button class="editor ml-1" @click="removeTag(t)">❌</button></span>
        </div>
      </footer>
      <BrandedButton
        text="Publish"
        :action="post"
        class="editor preview justify-self-end w-32 h-12 self-center mr-5"
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
import marked from 'marked'

import CameraIcon from '@/components/icons/Camera.vue'
// import BoldIcon from '@/components/icons/md/Bold.vue'
// import CodeIcon from '@/components/icons/md/Code.vue'
// import ItalicIcon from '@/components/icons/md/Italic.vue'
// import ListIcon from '@/components/icons/md/List.vue'
// import LinkIcon from '@/components/icons/md/Link.vue'
// import ImageIcon from '@/components/icons/md/Image.vue'
// import QuoteIcon from '@/components/icons/md/Quote.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PlusIcon from '@/components/icons/Plus.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import TagCard from '@/components/Tag.vue'
import markdown from '@/mixins/markdown.js'
import { Post } from '@/interfaces/Post'
import { Tag } from '@/interfaces/Tag'
import { Profile } from '@/interfaces/Profile'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { actionType, namespace as settingStoreNamespace } from '~/store/settings'

export default Vue.extend({
	components: {
		// BoldIcon,
		// CodeIcon,
		// ItalicIcon,
		// ListIcon,
		// LinkIcon,
		// ImageIcon,
		// QuoteIcon,
		BrandedButton,
		CameraIcon,
		PlusIcon,
		PencilIcon,
		TagCard,
	},
	mixins: [markdown],
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
		}
	},
	computed: {
		compiledMarkdown (): string {
			const md = marked(this.input)
			return md
		},
	},
	// mounted () {
	// 	window.addEventListener(`mousedown`, this.previewHandler)
	// },
	// beforeDestroy () {
	// 	window.removeEventListener(`mousedown`, this.previewHandler)
	// },
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
		// ...mapMutations(postsStoreNamespace, {
		//   addTag: postsMutationType.ADD_TAG,
		// }),
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
					// Returns updated content address
					this.$sendProfile(profile).then((pcid) => {
						this.changeCID(pcid)
						// Reset draft & redirect
						this.toggleDraftMode()
						this.title = `Title`
						this.subtitle = `Subtitle`
						this.input = `# Hello World`
						this.tags = []
						this.$router.push(`/post/` + cid)
					})
				})
			}
		},
		updateStore (): void {
			this.$store.commit(`draft/updateDraft`, {
				title: this.title,
				subtitle: this.subtitle,
				content: this.input,
				tags: this.tags,
			})
			this.toggleDraftMode()
		},
		addMarkdown (md, wrap): void {
			if (this.$refs.ta !== undefined) {
				const ta = this.$refs.ta as HTMLInputElement
				const cursorStart: number | null = ta.selectionStart
				const cursorEnd: number | null = ta.selectionEnd
				if (cursorStart !== null && cursorEnd !== null) {
					const selectedText = this.input.substring(cursorStart, cursorEnd)
					if (wrap) {
						this.input =
              this.input.substring(0, cursorStart) +
              md +
              selectedText +
              md +
              this.input.substring(cursorEnd)
					} else {
						this.input =
              this.input.substring(0, cursorStart) +
              md +
              selectedText +
              this.input.substring(cursorEnd)
					}
				}
			}
		},
		previewHandler (e: any): void {
			if (!e.target) {
				return
			}
			if (this.showPreview === false) {
				if (e.target.parentNode === null ||
          e.target.parentNode.classList === undefined ||
          !e.target.parentNode.classList.contains(`editor`)) {
					this.showPreview = true
				}
			}
			if (this.showPreview === true) {
				if (e.target.parentNode === null ||
          e.target.parentNode.classList === undefined ||
          e.target.parentNode.classList.contains(`preview`)) {
					e.stopPropagation()
					this.showPreview = false
				}
			}
		},
	},
})
</script>
