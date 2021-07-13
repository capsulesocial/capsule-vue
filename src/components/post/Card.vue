<template>
  <article
    class="shadow rounded-lg my-2 p-5 w-full md:max-w-xl"
    :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'"
  >
    <!-- Post Preview Header: Avatar, name -->
    <div class="flex justify-between items-center">
      <nuxt-link :to="'/' + this.post.authorCID" class="flex">
        <img
          v-if="this.avatar !== ``"
          :src="this.avatar"
          class="w-12 h-12 rounded-lg object-cover"
        />
        <ProfileIcon
          v-else
          class="w-12 h-12 border-2 rounded-full"
        />
        <div class="ml-4">
          <!-- Name, ID -->
          <div class="flex items-center">
            <h4
              :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
              class="text-bold mr-2 text-lg"
            >
              {{ this.authorName }}
            </h4>
            <h5
              :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
              class="mr-2"
            >
              @{{ this.post.authorID }}
            </h5>
          </div>
          <!-- Timestamp -->
          <h6
            :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
            class="text-xs mb-2"
          >
            {{ this.$formatDate(this.post.timestamp) }}
          </h6>
        </div>
      </nuxt-link>
      <button
        :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText hover:text-lightActive ' : 'text-darkPrimaryText hover:text-darkActive'"
        class="focus:outline-none"
      >
        <XIcon />
      </button>
    </div>

    <!-- Preview Content -->
    <div class="my-2">
      <nuxt-link :to="'/post/' + this.post.cid" class="flex justify-between">
        <div>
          <h3
            :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
            class="text-base font-bold capitalize"
          >
            {{ this.post.title }}
          </h3>
          <h4
            :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
            class="pt-2 text-sm"
          >
            {{ this.post.subtitle }}
          </h4>
        </div>
        <div class="ml-2">
          <img
            v-if="this.featuredPhoto !== ``"
            :src="this.featuredPhoto"
            class="w-32 h-24 rounded object-cover object-top"
          />
        </div>
      </nuxt-link>
    </div>

    <!-- Actions -->
    <div class="pt-2 flex justify-between">
      <div class="flex">
        <button
          class="flex focus:outline-none self-center mr-2"
          :class="this.getStyles()"
          @click="showComments = !showComments"
        >
          <CommentIcon class="fill-primary" />
        </button>
        <Share
          :post="this.post"
          :class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
          class="fill-primary self-center z-20"
        />
        <BookmarkButton
          :postID="this.post.cid"
          :class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
          class="self-center"
        />
      </div>
      <div v-if="this.showComments" class="flex">
        <h6>Filter Comments</h6>
        <div class="relative">
          <button
            class="toggle focus:outline-none flex justify-center shadow-lg rounded-lg px-4 ml-4 text-sm w-32"
            @click.stop="showFilter = !showFilter"
          >
            <span v-if="this.filter === null" class="toggle">All</span>
            <span v-else class="toggle capitalize">{{ this.filter }}</span>
            <ChevronUp v-if="this.showFilter" :downsize="true" />
            <ChevronDown v-else :downsize="true" />
          </button>
          <ul
            v-if="this.showFilter"
            :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightSecondaryText' : 'bg-darkBG text-darkSecondaryText border-darkBorder'"
            class="absolute z-10 shadow-lg rounded-lg py-1 ml-4 w-32"
          >
            <button class="w-full" @click="setCommentFilter(null)">
              <li class="text-left pl-2">
                All
              </li>
            </button>
            <button
              v-for="r in this.$store.state.config.reactions"
              :key="r.label"
              class="w-full"
              @click="setCommentFilter(r.label)"
            >
              <li class="text-left pl-2">
                {{ r.label }}
              </li>
            </button>
          </ul>
        </div>
      </div>
    </div>
    <PostActions
      v-if="this.showComments"
      :post="this.post"
      :filter="this.filter"
    />
  </article>
</template>

<script lang="ts">
import Vue from "vue"
import PostActions from "@/components/post/Actions.vue"
import XIcon from "@/components/icons/X.vue"
import ProfileIcon from "@/components/icons/Person.vue"
import BookmarkButton from "@/components/post/BookmarkButton.vue"
import Share from "@/components/post/Share.vue"
import CommentIcon from "@/components/icons/Comment.vue"
import ChevronUp from "@/components/icons/ChevronUp.vue"
import ChevronDown from "@/components/icons/ChevronDown.vue"

export default Vue.extend({
	components: {
		PostActions,
		XIcon,
		ProfileIcon,
		BookmarkButton,
		Share,
		CommentIcon,
		ChevronUp,
		ChevronDown,
	},
	props: {
		post: {
			type: Object,
			default: null,
		},
	},
	data () {
		return {
			showComments: false,
			showFilter: false,
			filter: null,
			authorName: ``,
			authorID: ``,
			authorCID: ``,
			avatar: ``,
			featuredPhoto: ``,
		}
	},
	created () {
		if (this.$store.state.session.cid === this.$props.post.authorCID) {
			// Viewing own post
			this.authorName = this.$store.state.session.name
			this.authorID = this.$store.state.session.id
			this.authorCID = this.$store.state.session.cid
		}
		this.$getProfile(this.$props.post.authorCID).then((profile) => {
			// Populate Avatar
			this.authorName = profile.name
			this.authorID = profile.id
			this.authorCID = profile.cid
			if (profile.avatar !== ``) {
				this.$getPhoto(profile.avatar).then((image) => {
					this.avatar = image
				})
			}
			// Populate Featured Photo
			if (this.post.featuredPhotoCID !== ``) {
				this.$getPhoto(this.post.featuredPhotoCID).then((image) => {
					this.featuredPhoto = image
				})
			}
		})
		// Set filter dropdown event handler
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showFilter = false
				}
			},
			false,
		)
	},
	methods: {
		getStyles (): string {
			let res = ``
			if (this.showComments && this.$store.state.settings.darkMode) {
				res += `text-lightActive`
			} else if (this.showComments && !this.$store.state.settings.darkMode) {
				res += `text-darkActive`
			} else if (!this.showComments && this.$store.state.settings.darkMode) {
				res += `hover:text-lightActive`
			} else if (!this.showComments && !this.$store.state.settings.darkMode) {
				res += `hover:text-darkActive`
			}
			return res
		},
		setCommentFilter (reaction) {
			this.filter = reaction
			this.showFilter = false
		},
	},
})
</script>
