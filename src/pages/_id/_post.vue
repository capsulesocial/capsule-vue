<template>
  <section class="pb-16 lg:pb-5 m-5">
    <article>
      <div class="flex justify-between">
        <p class="font-sans text-sm inline">
          Posted on
          {{ this.post.timestamp.toLocaleString() }}
        </p>
        <span class="flex">
          <h6
            v-for="t in this.post.tags"
            :key="t"
            class="text-primary italic pr-2"
          >
            #{{ t }}
          </h6>
        </span>
      </div>

      <h1 class="text-5xl font-serif capitalize">{{ this.post.title }}</h1>
      <h2 class="text-3xl font-serif text-gray-600">
        {{ this.post.subtitle }}
      </h2>
      <div class="flex justify-between pt-5">
        <p class="font-sans text-sm uppercase">
          Written by
          <nuxt-link
            :to="'/' + this.$route.params.id"
            class="text-primary underline"
            >{{ this.$route.params.id }}</nuxt-link
          >
        </p>
        <div class="flex">
          <span class="flex pr-4"
            ><CommentIcon class="inline mr-1" />{{
              this.post.comments.length
            }}</span
          >
          <span class="flex"
            ><BookmarkIcon class="inline mr-1" />{{
              this.post.bookmarks.length
            }}</span
          >
        </div>
      </div>
    </article>

    <hr class="style-two my-5" />

    <!-- Content -->
    <div
      v-html="this.compileMarkdown(this.post.content)"
      class="prose lg:prose-lg max-w-none text-black pl-4 font-serif content"
    ></div>

    <AuthorCard :authorID="this.$route.params.id" />

    <!-- Comments -->
    <article>
      <PostActions
        :post="this.post"
        :authorID="this.$route.params.id"
        :isCommenting="true"
        class="mt-5"
      />
    </article>
  </section>
</template>

<script>
import markdown from "@/mixins/markdown.js";
import PostActions from "@/components/post/Actions";
import AuthorCard from "@/components/AuthorCard";
import CommentIcon from "@/components/icons/Comment";
import BookmarkIcon from "@/components/icons/Bookmark";

export default {
  data() {
    return {
      post: this.$store.state.posts[this.$route.params.post]
    };
  },
  layout: "reader",
  components: {
    PostActions,
    AuthorCard,
    CommentIcon,
    BookmarkIcon
  },
  mixins: [markdown]
};
</script>

<style>
hr {
  border: 0;
  height: 1px;
  background-image: linear-gradient(
    to right,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.75),
    rgba(0, 0, 0, 0)
  );
}
.content {
  text-align: justify;
  text-justify: inter-word;
}
</style>
