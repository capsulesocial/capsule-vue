<template>
  <section class="px-4">
    <div v-for="p in this.posts" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from '@/components/post/Card'

export default {
  components: {
    PostCard,
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
    this.getRepostList()
  },
  methods: {
    async getRepostList () {
      // Get list of reposts posts by visited profile
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
      const repostList = targetProfile.reposts
      // Loop through list of reposts on a profile
      for (let i = 0; i < repostList.length; i++) {
        // Find post object and add it to result
        const post = await this.$api.post.getPost(repostList[i])
        post.id = repostList[i]
        this.posts.push(post)
      }
    },
  },
}
</script>
