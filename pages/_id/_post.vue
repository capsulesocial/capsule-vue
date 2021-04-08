<template>
  <section class="pb-16 lg:pb-5">
    <button @click="$router.go(-1)" class="focus:outline-none -mx-4 fixed">
      <BackButton />
    </button>
    <article class="p-5 text-center">
      <h1 class="text-4xl">{{ this.post.title }}</h1>
      <h2 class="text-2xl">{{ this.post.subtitle }}</h2>
      <p>
        Posted by {{ this.$route.params.id }} on
        {{ this.post.timestamp.toLocaleString() }}
      </p>
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
import BackButton from "@/components/icons/BackChevron";
import markdown from "@/mixins/markdown.js";
import PostActions from "@/components/post/Actions";

export default {
  data() {
    return {
      post: this.$store.state.posts[this.$route.params.post]
    };
  },
  components: {
    BackButton,
    PostActions
  },
  mixins: [markdown]
};
</script>
