<template>
  <section>
    <article class="border-t flex justify-around p-2 text-gray-600">
      <button @click="handleHeart()" class="flex focus:outline-none">
        <HeartIcon :isActive="this.isHeart()" class="mr-2 fill-none" /> Heart
      </button>
      <button @click="handleComment()" class="flex focus:outline-none">
        <CommentIcon class="mr-2" /> Comment
      </button>
      <button @click="handleShare()" class="flex focus:outline-none">
        <ShareIcon class="mr-2" /> Share
      </button>
    </article>

    <article v-if="commentStatus">
      <p
        v-for="comment in this.post.comments"
        :key="comment.id"
        class="text-base px-2"
      >
        <span class="text-gray-700">@{{ comment.authorID }}:</span>
        {{ comment.content }}
      </p>
      <textarea
        class="leading-normal resize-vertical border-b w-full h-20 font-medium focus:outline-none p-2"
        name="body"
        placeholder="Type Your Comment"
        v-model="comment"
      ></textarea>
      <div class="flex justify-between">
        <span class="flex items-center pl-2 text-gray-800">
          <InfoIcon />
          <p class="text-xs md:text-sm pt-px pl-2">Markdown is supported.</p>
        </span>
        <button
          class="m-2 p-2 bg-primary text-white font-bold hover:bg-green-600 rounded-lg shadow-lg focus:outline-none"
          @click="sendComment()"
        >
          Submit
        </button>
      </div>
    </article>
  </section>
</template>

<script>
import HeartIcon from "@/components/icons/Heart";
import CommentIcon from "@/components/icons/Comment";
import ShareIcon from "@/components/icons/Share";
import InfoIcon from "@/components/icons/Info";

export default {
  data() {
    return {
      comment: "",
      commentStatus: this.isCommenting
    };
  },
  props: {
    isCommenting: {
      type: Boolean,
      default: false
    },
    post: {
      type: Object,
      default: null
    },
    authorID: {
      type: String,
      default: null
    }
  },
  components: {
    HeartIcon,
    CommentIcon,
    ShareIcon,
    InfoIcon
  },
  methods: {
    isHeart() {
      return this.post.likes.indexOf(this.$store.state.user.id) > -1;
    },
    handleHeart() {
      this.$store.commit("handleHeart", {
        postID: this.post.id,
        authorID: this.authorID
      });
    },
    handleComment() {
      this.commentStatus = !this.commentStatus;
    },
    handleShare() {
      console.log("Share");
    },
    sendComment() {
      this.$store.commit("postComment", {
        postID: this.post.id,
        authorID: this.$store.state.user.id,
        content: this.comment
      });
    }
  }
};
</script>
