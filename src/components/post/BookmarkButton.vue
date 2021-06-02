<template>
  <button
    class="flex focus:outline-none hover:text-primary"
    @click="handleBookmark()"
  >
    <BookmarkIcon :isActive="this.isBookmarked" class="mr-2 fill-none" />
  </button>
</template>

<script>
import BookmarkIcon from '@/components/icons/Bookmark'

export default {
  components: {
    BookmarkIcon,
  },
  props: {
    postID: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      // isBookmarked: this.post.bookmarks.includes(this.$store.state.me.id),
      isBookmarked: this.$store.state.me.bookmarks.includes(this.postID),
    }
  },
  methods: {
    handleBookmark () {
      this.$store.commit('me/handleBookmark', this.postID)
      this.isBookmarked = !this.isBookmarked
      // this.$store.commit('posts/handleBookmark', {
      //   postID: this.postID,
      //   userID: this.$store.state.me.id,
      // })
      // const p = await this.$api.post.handleBookmark(this.$store.state.me.id, this.post.id)
      // if (p.bookmarks.includes(this.$store.state.me.id)) {
      //   this.isBookmarked = true
      // } else {
      //   this.isBookmarked = false
      // }
    },

  },
}
</script>
