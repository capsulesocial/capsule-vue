/* eslint-disable prefer-const */
<template>
  <section>
    <h2 class="text-2xl">
      #{{ this.$route.params.tag }}
    </h2>
    <div v-for="p in this.posts" :key="p.contentAddress">
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
      posts: [],
      tag: this.$route.params.tag,
    }
  },
  created () {
    // Fetch posts with tag
    for (const p of this.$store.state.tags.tags) {
      if (p.tag === this.tag) {
        for (const c of p.posts) {
          // Fetch specific post
          this.findPost(c)
        }
      }
    }
  },
  methods: {
    findPost (pID) {
      for (const p in this.$store.state.posts.posts) {
        if (this.$store.state.posts.posts[p].id === pID) {
          this.posts.push(this.$store.state.posts.posts[p])
        }
      }
    },
  },
}
</script>
