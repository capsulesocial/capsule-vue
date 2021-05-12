<template>
  <main>
    <nav class="flex flex-row justify-around border bg-secondary bg-opacity-25 py-2 px-4">
      <button
        v-if="this.algorithm !== 'NEW'"
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-gray-100 text-gray-800"
        @click="sortFeed('NEW')"
      >
        New
      </button>
      <span
        v-else
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-primary text-white shadow-lg"
      >
        New
      </span>
      <button
        v-if="this.algorithm !== 'TOP'"
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-gray-100 text-gray-800"
        @click="sortFeed('TOP')"
      >
        Top
      </button>
      <span
        v-else
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-primary text-white shadow-lg"
      >
        Top
      </span>
      <button
        v-if="this.algorithm !== 'FOLLOWING'"
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-gray-100 text-gray-800"
        @click="sortFeed('FOLLOWING')"
      >
        following
      </button>
      <span
        v-else
        class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-primary text-white shadow-lg"
      >
        following
      </span>
    </nav>
    <div v-for="post in this.posts" :key="post.contentAddress">
      <PostCard
        :post="post"
        :authorID="post.authorID"
        :authorUsername="post.authorID"
      />
    </div>
  </main>
</template>

<script>
import PostCard from '@/components/post/Card'
export default {
  components: {
    PostCard,
  },
  data () {
    return {
      algorithm: 'NEW',
      posts: [],
    }
  },
  created () {
    this.posts.push(...this.$store.state.posts)
  },
  methods: {
    sortFeed (a) {
      this.posts = []
      this.posts.push(...this.$store.state.posts)
      this.algorithm = a
      if (a === 'NEW') {
        this.posts.sort((p0, p1) => {
          return p0.views - p1.views
        })
      } else if (a === 'TOP') {
        this.posts.sort((p0, p1) => {
          return p1.views - p0.views
        })
      } else if (a === 'FOLLOWING') {
        const fList = []
        const res = []
        fList.push(...this.$store.state.user.following)
        for (const p in this.posts) {
          if (fList.includes(this.posts[p].authorID)) {
            res.push(this.posts[p])
          }
        }
        this.posts = res
      }
    },
  },
}
</script>
