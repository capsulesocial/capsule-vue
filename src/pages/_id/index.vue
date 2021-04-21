<template>
  <section>
    <article v-for="post in this.userPosts()" :key="post.id">
      <PostCard
        :post="post"
        :authorID="$route.params.id"
        :authorUsername="currentUser.username"
      />
    </article>
  </section>
</template>

<script>
import PostCard from "@/components/post/Card";

export default {
  data() {
    return {};
  },
  components: { PostCard },
  props: {
    currentUser: {
      type: Object,
      default: null
    }
  },
  methods: {
    userPosts: function() {
      let posts = [];
      let p = this.$store.state.posts;
      for (let i = 0; i < p.length; i++) {
        if (p[i].authorID == this.currentUser.id) posts.push(p[i]);
      }
      return posts;
    }
  }
};
</script>
