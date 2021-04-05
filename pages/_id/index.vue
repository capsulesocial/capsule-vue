<template>
  <section>
    <!-- Header -->
    <article>
      <h1 class="2xl">Profile of {{ this.$store.state.user.username }}</h1>
    </article>

    <article v-for="post in this.$store.state.user.posts" :key="post.id">
      <nuxt-link :to="$store.state.user.id + '/' + post.id">
        <PostCard
          :title="post.title"
          :subtitle="post.subtitle"
          :views="post.views"
          :username="$store.state.user.username"
        />
      </nuxt-link>
    </article>
  </section>
</template>

<script>
import PostCard from "@/components/post/Card";
export default {
  components: {
    PostCard
  }
};
</script>
