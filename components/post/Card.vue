<template>
  <section class="border">
    <!-- Post Preview Link -->
    <nuxt-link :to="this.authorID + '/' + this.post.id">
      <article class="mb-2 flex justify-between items-center p-2">
        <h5 class="text-base">{{ this.authorUsername }}</h5>
        <div>
          <h6 class="text-sm text-gray-600">
            {{ this.post.timestamp.toLocaleString() }}
          </h6>
          <h6 class="text-xs text-gray-600 text-right">
            {{ this.post.views }} views
          </h6>
        </div>
      </article>

      <article class="p-2">
        <h3 class="text-xl font-bold">{{ this.post.title }}</h3>
        <h4 class="text-lg italic">{{ this.post.subtitle }}</h4>
      </article>
    </nuxt-link>

    <article>
      <PostActions :post="this.post" :authorID="this.authorID" />
    </article>
  </section>
</template>

<script>
import PostActions from "@/components/post/Actions";

export default {
  props: {
    post: {
      type: Object,
      default: null
    },
    authorID: {
      type: String,
      default: null
    },
    authorUsername: {
      type: String,
      default: null
    }
  },
  components: {
    PostActions
  }
};
</script>
