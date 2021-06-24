<template>
  <article class="shadow rounded-lg my-2 card p-5">
    <!-- Post Preview Header: Avatar, name, username -->
    <div class="flex justify-between items-center">
      <nuxt-link :to="'/' + this.post.authorID" class="flex">
        <img
          v-if="this.author.avatar !== null"
          :src="this.avatar"
          class="w-8 h-8 rounded-lg mr-2 object-cover"
        />
        <ProfileIcon v-else class="w-8 h-8 border-2 rounded-full mr-2" />
        <h4 class="text-bold mr-2 self-center">
          {{ this.author.username }}
        </h4>
        <h5 class="hover:text-primary text-subtitle mr-2 self-center">
          @{{ this.post.authorID }}
        </h5>
      </nuxt-link>
      <button class="hover:text-primary focus:outline-none">
        <XIcon />
      </button>
    </div>

    <!-- Timestamp -->
    <h6 class="text-xs text-subtitle self-center ml-10 mb-2">
      {{ this.$helpers.formatDate(this.post.timestamp) }}
    </h6>

    <!-- Preview Content -->
    <div class="hover:text-primary">
      <nuxt-link
        :to="'/' + this.post.authorID + '/' + this.post.id"
        class="flex justify-between"
      >
        <div>
          <h3 class="text-base font-bold capitalize">
            {{ this.post.title }}
          </h3>
          <h4 class="text-subtitle pt-2 text-sm">
            {{ this.post.subtitle }}
          </h4>
        </div>
        <div class="ml-2">
          <img
            v-if="this.featuredPhoto !== null"
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
          class="flex focus:outline-none hover:text-primary self-center mr-2"
          :class="this.showComments ? 'text-primary' : ''"
          @click="showComments = !showComments"
        >
          <CommentIcon class="fill-primary" />
        </button>
        <Share :post="this.post" class="fill-primary self-center z-20" />
        <BookmarkButton :postID="this.post.id" class="fill-primary self-center" />
      </div>
      <div v-if="this.showComments" class="flex">
        <h6>Filter Comments </h6>
        <div class="relative">
          <button class="toggle focus:outline-none flex justify-center shadow-lg rounded-lg px-4 ml-4 text-sm w-32" @click.stop="showFilter = !showFilter">
            <span v-if="this.filter === null" class="toggle">All</span>
            <span v-else class="toggle capitalize">{{ this.filter }}</span>
            <ChevronUp v-if="this.showFilter" :downsize="true" />
            <ChevronDown v-else :downsize="true" />
          </button>
          <ul v-if="this.showFilter" class="absolute bg-white z-10 shadow-lg rounded-lg py-1 ml-4 w-32">
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
    <PostActions v-if="this.showComments" :post="this.post" :filter="this.filter" />
  </article>
</template>

<script>
import PostActions from '@/components/post/Actions.vue'
import XIcon from '@/components/icons/X.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import Share from '@/components/post/Share.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

export default {
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
      author: null,
      avatar: null,
      featuredPhoto: null,
    }
  },
  created () {
    if (this.$store.state.me.id === this.post.authorID) {
      this.author = this.$store.state.me
    }
    const list = this.$store.state.authors
    const a = list.find(x => x.id === this.post.authorID)
    if (a) {
      this.author = a
    }
    // Populate Avatar
    if (this.author.avatar !== null) {
      this.$api.settings.downloadAvatar(this.author.avatar).then((image) => {
        this.avatar = image
      })
    }
    // Populate Featured Photo
    if (this.post.featuredPhotoCID !== null) {
      this.$api.settings.downloadAvatar(this.post.featuredPhotoCID).then((image) => {
        this.featuredPhoto = image
      })
    }
    // Set filter dropdown event handler
    window.addEventListener('click', (e) => {
      if (e.target.parentNode === null || e.target.parentNode.classList === undefined || !e.target.parentNode.classList.contains('toggle')) {
        this.showFilter = false
      }
    }, false)
  },
  methods: {
    setCommentFilter (reaction) {
      this.filter = reaction
      this.showFilter = false
    },
  },
}
</script>
