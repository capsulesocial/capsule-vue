<template>
  <div>
    <section v-if="this.post !== null" class="pb-16 lg:pb-5 m-5">
      <article>
        <h1 class="text-5xl font-serif capitalize">
          {{ this.post.title }}
        </h1>
        <h2 class="text-3xl font-serif text-gray-600">
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
          <div class="flex">
            <button
              class="flex focus:outline-none hover:text-primary mr-4"
              @click="handleBookmark()"
            >
              <BookmarkIcon :isActive="this.isBookmark()" class="mr-2 fill-none" />
              {{ this.post.bookmarks.length }}
            </button>
            <span class="flex mr-4">
              <CommentIcon class="mr-2 fill-primary" />
              {{ this.post.comments.length }}
            </span>
            <button
              class="flex focus:outline-none hover:text-primary"
              @click="handleShare()"
            >
              <SendIcon class="mr-2 fill-primary" />
              {{ this.post.shares }}
            </button>
            <!-- <span class="text-sm block text-gray-600 italic">{{ this.post.views }} views</span> -->
          </div>
        </div>
      </article>

      <hr class="style-two my-5">

      <!-- Content -->
      <div
        class="prose lg:prose-lg max-w-none text-black pl-4 font-serif content"
        v-html="this.compileMarkdown(this.post.content)"
      ></div>

      <AuthorCard
        :authorID="this.$route.params.id"
      />

      <!-- Tags -->
      <article>
        <TagCard
          v-for="t in this.post.tags"
          :key="t"
          class="mr-2"
          :tag="t"
        />
      </article>

      <!-- Comments -->
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
      404 Post not found!
    </section>
  </div>
</template>

<script>
import markdown from '@/mixins/markdown.js'
import PostActions from '@/components/post/Actions'
import AuthorCard from '@/components/AuthorCard'
import TagCard from '@/components/Tag'
import BookmarkIcon from '@/components/icons/Bookmark'
import CommentIcon from '@/components/icons/Comment'
import SendIcon from '@/components/icons/Send'

export default {
  components: {
    PostActions,
    AuthorCard,
    TagCard,
    BookmarkIcon,
    CommentIcon,
    SendIcon,
  },
  mixins: [markdown],
  layout: 'reader',
  data () {
    return {
      post: null,
    }
  },
  created () {
    // Fetch post from IPFS,
    // currently fetching from localstorage
    // eslint-disable-next-line prefer-const
    for (let p in this.$store.state.posts) {
      if (this.$store.state.posts[p].id === this.$route.params.post) {
        this.post = this.$store.state.posts[p]
      }
    }
    this.$store.commit('addView', this.post.id)
  },
  methods: {
    isBookmark () {
      return this.post.bookmarks.includes(this.$store.state.user.id)
    },
    handleBookmark () {
      this.$store.commit('handleBookmark', {
        postID: this.post.id,
        authorID: this.$route.params.id,
      })
    },
    handleShare () {
      this.$store.commit('addShare', this.post.id)
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
