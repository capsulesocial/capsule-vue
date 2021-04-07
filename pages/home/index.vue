<template>
  <div>
    <article v-for="post in this.$store.state.user.posts" :key="post.id">
      <PostCard
        :post="post"
        :authorID="$store.state.user.id"
        :authorUsername="$store.state.user.username"
      />
    </article>
  </div>
</template>

<script>
import PostCard from "@/components/post/Card";
export default {
  components: {
    PostCard
  }
};
</script>
