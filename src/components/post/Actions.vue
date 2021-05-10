<template>
  <section>
    <article class="border-t flex justify-around p-2 text-gray-600">
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleBookmark()"
      >
        <BookmarkIcon :isActive="this.isBookmark()" class="mr-2 fill-none" />
      </button>
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleComment()"
      >
        <CommentIcon class="mr-2 fill-primary" />
      </button>
      <button class="focus:outline-none" @click="handleReaction('agree')">
        <AgreeIcon v-if="this.emotion === 'agree'" />
        <AgreeIcon v-else />
      </button>
      <button class="focus:outline-none" @click="handleReaction('neutral')">
        <NeutralIcon v-if="this.emotion === 'neutral'" />
        <NeutralIcon v-else />
      </button>
      <button class="focus:outline-none" @click="handleReaction('disagree')">
        <DisagreeIcon v-if="this.emotion === 'disagree'" />
        <DisagreeIcon v-else />
      </button>
    </article>

    <article v-if="commentStatus">
      <p
        v-for="c in this.post.comments"
        :key="c.id"
        class="text-base px-2 py-1"
      >
        <AgreeIcon v-if="c.emotion === 'agree'" class="inline" />
        <NeutralIcon v-if="c.emotion === 'neutral'" class="inline" />
        <DisagreeIcon v-if="c.emotion === 'disagree'" class="inline" />
        <span class="text-gray-700">@{{ c.authorID }}:</span>
        {{ c.content }}
      </p>
      <textarea
        v-model="comment"
        class="leading-normal resize-vertical border-b w-full h-20 font-medium focus:outline-none p-2"
        name="body"
        placeholder="Type Your Comment"
      ></textarea>
      <div class="flex justify-between">
        <span class="flex items-center pl-2 text-gray-800">
          <InfoIcon />
          <p class="text-xs md:text-sm pt-px pl-2">
            Markdown is NOT currently supported in comments.
          </p>
        </span>
        <BrandedButton text="Submit" :action="sendComment" class="m-2 p-2" />
      </div>
    </article>

    <input :id="this.$props.post.id" type="hidden" value="" />
  </section>
</template>

<script>
import BookmarkIcon from '@/components/icons/Bookmark'
import CommentIcon from '@/components/icons/Comment'
import InfoIcon from '@/components/icons/Info'
import AgreeIcon from '@/components/icons/Agree'
import DisagreeIcon from '@/components/icons/Disagree'
import NeutralIcon from '@/components/icons/Neutral'
import BrandedButton from '@/components/BrandedButton'
export default {
  components: {
    BookmarkIcon,
    CommentIcon,
    InfoIcon,
    AgreeIcon,
    DisagreeIcon,
    NeutralIcon,
    BrandedButton,
  },
  props: {
    isCommenting: {
      type: Boolean,
      default: false,
    },
    post: {
      type: Object,
      default: null,
    },
    authorID: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      comment: '',
      commentStatus: this.isCommenting,
      emotion: null,
    }
  },
  methods: {
    isBookmark () {
      return this.post.bookmarks.includes(this.$store.state.user.id)
    },
    handleBookmark () {
      this.$store.commit('handleBookmark', {
        postID: this.post.id,
        authorID: this.authorID,
      })
    },
    handleComment () {
      this.commentStatus = !this.commentStatus
    },
    sendComment () {
      this.$store.commit('postComment', {
        postID: this.post.id,
        authorID: this.$store.state.user.id,
        content: this.comment,
        emotion: this.emotion,
      })
    },
    handleReaction (reaction) {
      this.emotion = reaction
      this.commentStatus = true
    },
  },
}
</script>
