<template>
  <div>
    <section v-if="this.post !== null" class="pb-16 lg:pb-5 m-5">
      <article>
        <h1 class="text-5xl capitalize">
          {{ this.post.title }}
        </h1>
        <h2 class="text-3xl text-subtitle">
          {{ this.post.subtitle }}
        </h2>
        <div class="flex justify-between pt-5">
          <p class="font-sans uppercase">
            Written by
            <nuxt-link
              :to="'/' + this.$route.params.id"
              class="text-primary underline"
            >
              {{ this.$route.params.id }}
            </nuxt-link>
            <span class="font-sans text-sm text-gray-700 block">
              {{ this.$helpers.formatDate(this.post.timestamp) }}
            </span>
          </p>
          <div class="flex items-center">
            <BookmarkButton :post="this.post" />
            <ShareButton :post="this.post" />
          </div>
        </div>
      </article>

      <hr class="style-two my-5">

      <!-- Content -->
      <div
        class="prose lg:prose-lg max-w-none text-black pl-4 content"
        v-html="this.compileMarkdown(this.post.content)"
      ></div>

      <!-- Tags -->
      <article class="mt-5">
        <TagCard
          v-for="t in this.post.tags"
          :key="t"
          class="mr-2"
          :tag="t"
        />
      </article>

      <AuthorCard
        :authorID="this.$route.params.id"
      />

      <!-- Comments -->
      <article class="flex flex-row justify-end">
        <BookmarkButton :post="this.post" />
        <ShareButton :post="this.post" />
      </article>
      <article>
        <PostActions
          :post="this.post"
          :authorID="this.$route.params.id"
          :isCommenting="true"
          class="mt-5"
          :tags="this.post.tags"
        />
      </article>
    </section>
    <section v-else>
      Post not found 😵‍💫
    </section>
  </div>
</template>

<script>
import markdown from '@/mixins/markdown.js'
import PostActions from '@/components/post/Actions'
import AuthorCard from '@/components/AuthorCard'
import TagCard from '@/components/Tag'
import BookmarkButton from '@/components/post/BookmarkButton'
import ShareButton from '@/components/post/Share'

export default {
  components: {
    PostActions,
    AuthorCard,
    TagCard,
    BookmarkButton,
    ShareButton,
  },
  mixins: [markdown],
  layout: 'reader',
  data () {
    return {
      post: null,
    }
  },
  async created () {
    // Fetch post from IPFS,
    const ipfsPost = await this.$api.post.getPost(this.$route.params.post)
    const p = ipfsPost
    p.id = this.$route.params.post
    this.post = p
  },
  methods: {
    handleShare () {
      this.$store.commit('posts/addShare', this.post.id)
      const url = document.getElementById(this.post.id)
      url.type = 'text'
      url.value =
        document.location.origin + '/' + this.post.authorID + '/' + this.post.id
      url.select()
      url.setSelectionRange(0, 99999)
      document.execCommand('copy')
      url.type = 'hidden'
      alert('URL Copied to Clipboard!')
    },
  },
}
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
