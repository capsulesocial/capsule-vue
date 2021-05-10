/* eslint-disable prefer-const */
<template>
  <section>
    <h2 class="text-2xl">#{{ this.$route.params.tag }}</h2>
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
    for (let p of this.$store.state.tags) {
      if (p.tag === this.tag) {
        for (let c of p.posts) {
          // Fetch specific post
          this.findPost(c)
        }
      }
    }
  },
  methods: {
    findPost (pID) {
      for (let p in this.$store.state.posts) {
        if (p === pID) {
          this.posts.push(this.$store.state.posts[p]);
        }
      }
    },
  },
}
</script>
