<template>
  <main>
    <nav class="flex flex-row border bg-secondary bg-opacity-25 py-2 px-4 pl-5">
      <div class="flex items-center mr-6">
        <button
          v-if="this.algorithm !== 'NEW'"
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
          @click="sortFeed('NEW')"
        >
          New
        </button>
        <span
          v-else
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
        >
          New
        </span>
      </div>
      <div class="flex items-center mr-6">
        <button
          v-if="this.algorithm !== 'TOP'"
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
          @click="sortFeed('TOP')"
        >
          Top
        </button>
        <span
          v-else
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
        >
          Top
        </span>
      </div>
      <div class="flex items-center mr-6">
        <button
          v-if="this.algorithm !== 'FOLLOWING'"
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
          @click="sortFeed('FOLLOWING')"
        >
          following
        </button>
        <span
          v-else
          class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
        >
          following
        </span>
      </div>
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
    this.sortFeed(this.algorithm)
  },
  methods: {
    async sortFeed (a) {
      this.posts = []
      for (const p in this.$store.state.posts) {
        if (p) {
          const post = await this.$api.post.getPost(this.$store.state.posts[p])
          post.id = this.$store.state.posts[p]
          this.posts.push(post)
        }
      }
      this.algorithm = a
      if (a === 'NEW') {
        this.posts.sort((p0, p1) => {
          return p1.timestamp - p0.timestamp
        })
      } else if (a === 'TOP') {
        this.posts.sort((p0, p1) => {
          return p1.views - p0.views
        })
      } else if (a === 'FOLLOWING') {
        const fList = []
        const res = []
        fList.push(...this.$store.state.me.following)
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
