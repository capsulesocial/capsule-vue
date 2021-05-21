<template>
  <section>
    <article>
      <ProfileHeader :currentUser="this.currentUser" />
    </article>
    <div v-for="p in this.getBookmarkList()" :key="p.id">
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
    }
  },
  created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.me.user.id) {
      this.currentUser = this.$store.state.me.user
    }
    // Get user profile
    // this.currentUser = this.$api.profile.getProfile(this.$route.params.id)
    const l = this.$store.state.authors
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$route.params.id) {
        this.currentUser = l[p]
      }
    }
  },
  methods: {
    getBookmarkList () {
      const res = []
      // Get list of bookmarked posts by visited profile
      // let targetProfile = this.$api.profile.getProfile(this.$route.params.id)
      let targetProfile = {}
      if (this.$route.params.id === this.$store.state.me.user.id) {
        targetProfile = this.$store.state.me.user
      } else {
        for (let p = 0; p < this.$store.state.authors.length; p++) {
          if (this.$store.state.authors[p].id === this.$route.params.id) {
            targetProfile = this.$store.state.authors[p]
            break
          }
        }
      }

      const bookmarkList = targetProfile.bookmarks
      const postList = this.$store.state.posts
      // Loop through list of bookmarks on a profile
      for (let i = 0; i < bookmarkList.length; i++) {
        // Find post object and add it to result
        for (let j = 0; j < postList.length; j++) {
          if (postList[j].id === bookmarkList[i]) {
            res.push(postList[j])
          }
        }
      }
      return res
    },
  },
}
</script>
