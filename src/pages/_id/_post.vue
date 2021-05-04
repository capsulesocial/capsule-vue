<template>
  <section class="pb-16 lg:pb-5">
    <article class="p-5">
      <h1 class="text-4xl">{{ this.post.title }}</h1>
      <h2 class="text-2xl">{{ this.post.subtitle }}</h2>
      <p class="font-sans">
        Posted by {{ this.$route.params.id }} on
        {{ this.post.timestamp.toLocaleString() }}
      </p>
    </article>

    <article class="flex flex-row px-5">
      <h6 v-for="t in this.post.tags" :key="t" class="text-primary italic pr-2">
        #{{ t }}
      </h6>
    </article>

    <!-- Content -->
    <article>
      <div
        v-html="this.compileMarkdown(this.post.content)"
        class="prose text-black pl-4"
      ></div>
    </article>

    <!-- Comments -->
    <article>
      <PostActions
        :post="this.post"
        :authorID="this.$route.params.id"
        :isCommenting="true"
      />
    </article>
  </section>
</template>

<script>
import markdown from "@/mixins/markdown.js";
import PostActions from "@/components/post/Actions";

export default {
  data() {
    return {
      post: this.$store.state.posts[this.$route.params.post]
    };
  },
  components: {
    PostActions
  },
  mixins: [markdown]
};
</script>
