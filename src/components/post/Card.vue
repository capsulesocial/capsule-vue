<template>
  <article class="shadow rounded-lg my-2 card p-5">
    <!-- Post Preview Link -->
    <div class="mb-2 flex justify-between items-center">
      <nuxt-link :to="'/' + this.post.authorID" class="flex">
        <div class="mr-2">
          <img
            v-if="this.author.avatar !== null"
            :src="this.avatar"
            class="w-8 h-8 rounded-lg"
          />
          <ProfileIcon v-else class="w-8 h-8 border-2 rounded-full" />
        </div>
        <div class="flex items-center flex-wrap mr-2">
          <h4 class="text-bold mr-2">
            {{ this.author.username }}
          </h4>
          <h5 class="hover:text-primary text-subtitle mr-2">
            @{{ this.post.authorID }}
          </h5>
        </div>
      </nuxt-link>
      <div class="flex">
        <button class="hover:text-primary focus:outline-none">
          <XIcon />
        </button>
      </div>
    </div>

    <div class="hover:text-primary">
      <nuxt-link :to="'/' + this.post.authorID + '/' + this.post.id">
        <h3 class="text-base font-bold capitalize">
          {{ this.post.title }}
        </h3>
        <h4 class="text-subtitle pt-2 text-sm">
          {{ this.post.subtitle }}
        </h4>
      </nuxt-link>
    </div>

    <div class="pt-2 flex justify-between">
      <h6 class="text-xs text-subtitle self-center">
        {{ this.$helpers.formatDate(this.post.timestamp) }}
      </h6>
      <div class="flex">
        <BookmarkButton :postID="this.post.id" class="mr-2 fill-primary" />
        <Share :post="this.post" class="mr-2 fill-primary" />
        <button
          class="flex focus:outline-none hover:text-primary"
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

export default {
  components: {
    PostActions,
    XIcon,
    ProfileIcon,
    BookmarkButton,
    Share,
    CommentIcon,
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

    if (this.author.avatar !== null) {
      this.$api.settings.downloadAvatar(this.author.avatar).then((image) => {
        this.avatar = image
      })
    }
  },
}
</script>
