<template>
  <section>
    <button @click="$router.go(-1)" class="focus:outline-none">
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

    <article>
      <div
        v-html="this.compileMarkdown(this.post.content)"
        class="prose text-black pl-4"
      ></div>
    </article>
  </section>
</template>

<script>
import BackButton from "@/components/icons/BackChevron";
import markdown from "@/mixins/markdown.js";
export default {
  data() {
    return {
      post: this.$store.state.user.posts[this.$route.params.post]
    };
  },
  components: {
    BackButton
  },
  mixins: [markdown]
};
</script>
