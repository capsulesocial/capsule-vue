<template>
  <section class="px-4">
    <article v-for="post in this.posts" :key="post.id">
      <PostCard
        :post="post"
        :authorID="$route.params.id"
        :authorUsername="currentUser.username"
      />
    </article>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'

export default Vue.extend({
  components: {
    PostCard,
  },
  data () {
    return {
      currentUser: {},
      posts: [],
    }
  },
  async created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.session.cid) {
      this.currentUser = this.$store.state.session
    }
    // Get user profile
    this.currentUser = await this.$getProfile(this.$route.params.id)
    this.userPosts()
  },
  methods: {
    async userPosts () {
      const p = this.currentUser.posts
      for (let i = 0; i < p.length; i++) {
        const post = await this.$getPost(p[i])
        post.id = p[i]
        this.posts.push(post)
      }
    },
  },
})
</script>
