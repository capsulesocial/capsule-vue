<template>
  <article class="shadow rounded-lg my-2 card p-5">
    <!-- Post Preview Link -->
    <div class="flex justify-between items-center">
      <nuxt-link :to="'/' + this.post.authorID" class="flex">
        <img
          v-if="this.author.avatar !== null"
          :src="this.avatar"
          class="w-8 h-8 rounded-lg mr-2"
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
            class="w-24 h-24 rounded"
          >
        </div>
      </nuxt-link>
    </div>

    <div class="pt-2 flex justify-between">
      <div class="flex">
        <TagCard
          v-for="t in this.post.tags"
          :key="t"
          :tag="t"
          theme="gray"
        />
      </div>
      <div class="flex">
        <BookmarkButton :postID="this.post.id" class="mr-2 fill-primary self-center" />
        <Share :post="this.post" class="mr-2 fill-primary self-center" />
        <button
          class="flex focus:outline-none hover:text-primary self-center"
          :class="this.showComments ? 'text-primary' : ''"
          @click="showComments = !showComments"
        >
          <CommentIcon class="fill-primary" />
        </button>
      </div>
    </div>
    <PostActions v-if="this.showComments" :post="this.post" />
  </article>
</template>

<script>
import PostActions from '@/components/post/Actions'
import XIcon from '@/components/icons/X'
import ProfileIcon from '@/components/icons/Person'
import BookmarkButton from '@/components/post/BookmarkButton'
import Share from '@/components/post/Share'
import CommentIcon from '@/components/icons/Comment'
import TagCard from '@/components/Tag'

export default {
  components: {
    PostActions,
    XIcon,
    ProfileIcon,
    BookmarkButton,
    Share,
    CommentIcon,
    TagCard,
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
  },
}
</script>
