/* eslint-disable prefer-const */
<template>
  <section class="pt-4 px-4">
    <h2 class="text-2xl">
      Hashtags /
    </h2>
    <h2 class="text-2xl uppercase">
      #{{ this.$route.params.tag }}
    </h2>
    <div v-for="p in this.posts" :key="p.contentAddress">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from '@/components/post/Card.vue'
export default {
  components: {
    PostCard,
  },
  data () {
    return {
      posts: [],
      tag: this.$route.params.tag,
    }
  },
  created () {
    // Fetch posts with tag
    for (const p of this.$store.state.tags) {
      if (p.tag === this.tag) {
        for (const c of p.posts) {
          // Fetch specific post
          this.findPost(c)
        }
      }
    }
  },
  methods: {
    async findPost (pID) {
      const p = await this.$api.post.getPost(pID)
      p.id = pID
      this.posts.push(p)
    },
  },
}
</script>
