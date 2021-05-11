<template>
  <main>
    <nav class="flex flex-row justify-around border bg-secondary bg-opacity-25 py-2 px-4">
      <button class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-gray-100 text-gray-800">
        Latest
      </button>
      <button class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-primary text-white">
        Top
      </button>
      <button class="font-sans py-2 px-4 focus:outline-none uppercase rounded-full bg-gray-100 text-gray-800">
        Connections
      </button>
    </nav>
    <div v-for="post in this.$store.state.posts" :key="post.contentAddress">
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
}
</script>
