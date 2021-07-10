<template>
  <div v-if="this.post">
    <section v-if="this.post !== {}" class="pb-16 lg:pb-5 m-5">
      <article>
        <h1
          :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
          class="text-5xl capitalize"
        >
          {{ this.post.title }}
        </h1>
        <h2
          :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
          class="text-3xl text-subtitle"
        >
          {{ this.post.subtitle }}
        </h2>
        <div class="flex justify-between pt-5">
          <p
            :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
            class="font-sans uppercase"
          >
            Written by
            <nuxt-link
              :to="'/' + this.author.cid"
              :class="this.$store.state.settings.darkMode ? 'text-lightActive' : 'text-darkActive'"
              class="underline"
            >
              {{ this.author.name }}
            </nuxt-link>
            <span
              :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
              class="font-sans text-sm block"
            >
              {{ this.$formatDate(this.post.timestamp) }}
            </span>
          </p>
          <div class="flex items-center">
            <BookmarkButton :postID="this.$route.params.post" />
            <ShareButton :post="this.post" />
          </div>
        </div>
      </article>

      <hr v-if="this.$store.state.settings.darkMode" class="style-two my-5">
      <hr v-else class="style-one my-5">

      <img
        v-if="this.featuredPhoto !== null"
        :src="this.featuredPhoto"
      />
      <!-- Content -->
      <div
        :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
        class="prose lg:prose-lg max-w-none pl-4 content"
        v-html="this.content"
      ></div>

      <!-- Tags -->
      <article class="mt-5">
        <TagCard
          v-for="t in this.post.tags"
          :key="t.name"
          class="mr-2"
          :tag="t.name"
        />
      </article>
      <AuthorCard
        :authorCID="this.post.authorCID"
        :authorAvatar="this.authorAvatar"
        :authorName="this.author.name"
        :authorId="this.author.id"
        :authorBio="this.author.bio"
      />

      <!-- Comments -->
      <article class="pt-5">
        <!-- Choose reaction -->
        <div class="flex flex-row justify-between">
          <div class="flex items-center">
            <BookmarkButton :postID="this.$route.params.post" />
            <ShareButton :post="this.post" class="z-20" />
          </div>
          <div class="flex">
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
                <button v-for="r in this.$store.state.config.reactions" :key="r.label" class="w-full" @click="setCommentFilter(r.label)">
                  <li class="text-left pl-2">
                    {{ r.label }}
                  </li>
                </button>
              </ul>
            </div>
          </div>
        </div>
        <PostActions
          :post="this.post"
          :authorID="this.post.authorCID"
          :isCommenting="true"
          :tags="this.post.tags"
          :filter="this.filter"
        />
      </article>
    </section>
    <section v-else>
      Post not found 😵‍💫
    </section>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import markdown from '@/mixins/markdown.js'
import marked from 'marked'
import PostActions from '@/components/post/Actions.vue'
import AuthorCard from '@/components/AuthorCard.vue'
import TagCard from '@/components/Tag.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import ShareButton from '@/components/post/Share.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { Post } from '~/interfaces/Post'
import { Profile } from '~/interfaces/Profile'

export default Vue.extend({
	components: {
		PostActions,
		AuthorCard,
		TagCard,
		BookmarkButton,
		ShareButton,
		ChevronUp,
		ChevronDown,
	},
	mixins: [markdown],
	layout: `reader`,
	data () {
		return {
			post: {},
			author: {},
			authorAvatar: ``,
			content: ``,
			featuredPhoto: null,
			showFilter: false,
			filter: null,
		}
	},
	created () {
		// Fetch post from IPFS,
		this.$getPost(this.$route.params.post).then((p: Post) => {
			p.id = this.$route.params.post
			this.post = p
			this.content = marked(p.content)
			// Get featured photo
			if (p.featuredPhotoCID !== ``) {
				this.$getPhoto(p.featuredPhotoCID).then((image) => {
					this.featuredPhoto = image
				})
			}
			// Get author profile
			this.$getProfile(p.authorCID).then((profile: Profile) => {
				this.author = profile
				if (profile.avatar.length > 1) {
					this.$getPhoto(profile.avatar).then((avatar) => {
						this.authorAvatar = avatar
					})
				}
			})
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
		setCommentFilter (reaction) {
			this.filter = reaction
			this.showFilter = false
		},
	},
})
</script>

<style>
hr.style-two {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
}
hr.style-one {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(255, 255, 255, 0.75),
    rgba(0, 0, 0, 0)
  );
}
.content {
  text-align: justify;
  text-justify: inter-word;
}
</style>
