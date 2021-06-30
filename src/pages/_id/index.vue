<template>
  <section class="px-4">
    <article v-for="post in this.posts" :key="post.id">
      <PostCard :post="post" />
    </article>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '~/interfaces/Post'

export default Vue.extend({
  components: {
    PostCard,
  },
  data () {
    let posts: Post[] = []
    return {
      currentUser: {},
      posts,
    }
  },
  async created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.session.cid) {
      this.currentUser = this.$store.state.session
    }
    // Get user profile
    await this.$getProfile(this.$route.params.id).then((profile) => {
      this.currentUser = profile
      for (let p in profile.posts) {
        this.$getPost(profile.posts[p]).then((post: Post) => {
          post.id = profile.posts[p]
          post.cid = profile.posts[p]
          this.posts.push(post)
        })
      }
    })
  },
})
</script>
