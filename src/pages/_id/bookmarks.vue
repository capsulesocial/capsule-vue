<template>
  <section>
    <article>
      <ProfileHeader :currentUser="this.currentUser" />
    </article>
    <div v-for="p in this.posts" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from '@/components/post/Card'
import ProfileHeader from '@/components/ProfileHeader'

export default {
  components: {
    PostCard,
    ProfileHeader,
  },
  data () {
    return {
      currentUser: null,
      posts: [],
    }
  },
  created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.me.id) {
      this.currentUser = this.$store.state.me
    }
    // Get user profile
    // this.currentUser = this.$api.profile.getProfile(this.$route.params.id)
    const l = this.$store.state.authors
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$route.params.id) {
        this.currentUser = l[p]
      }
    }
    this.getBookmarkList()
  },
  methods: {
    async getBookmarkList () {
      // Get list of bookmarked posts by visited profile
      // let targetProfile = this.$api.profile.getProfile(this.$route.params.id)
      let targetProfile = {}
      if (this.$route.params.id === this.$store.state.me.id) {
        targetProfile = this.$store.state.me
      } else {
        for (let p = 0; p < this.$store.state.authors.length; p++) {
          if (this.$store.state.authors[p].id === this.$route.params.id) {
            targetProfile = this.$store.state.authors[p]
            break
          }
        }
      }
      const bookmarkList = targetProfile.bookmarks
      // Loop through list of bookmarks on a profile
      for (let i = 0; i < bookmarkList.length; i++) {
        // Find post object and add it to result
        const post = await this.$api.post.getPost(bookmarkList[i])
        post.id = bookmarkList[i]
        this.posts.push(post)
      }
    },
  },
}
</script>
