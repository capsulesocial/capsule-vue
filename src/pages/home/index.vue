<template>
  <main>
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
import PostCard from "@/components/post/Card";
export default {
  components: {
    PostCard
  }
};
</script>
