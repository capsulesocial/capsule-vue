<template>
  <section>
    <ProfileHeader :currentUser="this.currentUser" />
    <div class="mt-5">
      <nuxt-link :to="'/' + this.currentUser.id" class="text-xl">
        Posts
      </nuxt-link>
    </div>

    <article v-for="post in this.userPosts()" :key="post.id">
      <PostCard
        :post="post"
        :authorID="$route.params.id"
        :authorUsername="currentUser.username"
      />
    </article>
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
    userPosts () {
      const posts = []
      const p = this.$store.state.posts.posts
      for (let i = 0; i < p.length; i++) {
        if (p[i].authorID === this.currentUser.id) {
          posts.push(p[i])
        }
      }
      return posts
    },
  },
}
</script>
