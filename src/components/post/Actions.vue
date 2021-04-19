<template>
  <section>
    <article class="border-t flex justify-around p-2 text-gray-600">
      <button @click="handleHeart()" class="flex focus:outline-none">
        <HeartIcon :isActive="this.isHeart()" class="mr-2 fill-none" /> Heart
      </button>
      <button @click="handleComment()" class="flex focus:outline-none">
        <CommentIcon class="mr-2 fill-primary" /> Comment
      </button>
      <button
        @click="handleReaction('agree')"
        class="stroke-current focus:outline-none"
      >
        <AgreeIcon
          v-if="this.emotion === 'agree'"
          class="text-white bg-primary rounded-full"
        />
        <AgreeIcon v-else />
      </button>
      <button
        @click="handleReaction('neutral')"
        class="stroke-current focus:outline-none"
      >
        <NeutralIcon
          v-if="this.emotion === 'neutral'"
          class="text-white bg-primary rounded-full"
        />
        <NeutralIcon v-else />
      </button>
      <button
        @click="handleReaction('disagree')"
        class="stroke-current focus:outline-none"
      >
        <DisagreeIcon
          v-if="this.emotion === 'disagree'"
          class="text-white bg-primary rounded-full"
        />
        <DisagreeIcon v-else />
      </button>
    </article>

    <article v-if="commentStatus">
      <p
        v-for="comment in this.post.comments"
        :key="comment.id"
        class="text-base px-2 py-1"
      >
        <AgreeIcon v-if="comment.emotion === 'agree'" class="inline" />
        <NeutralIcon v-if="comment.emotion === 'neutral'" class="inline" />
        <DisagreeIcon v-if="comment.emotion === 'disagree'" class="inline" />
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
          <p class="text-xs md:text-sm pt-px pl-2">
            Markdown is NOT currently supported in comments.
          </p>
        </span>
        <button
          class="m-2 p-2 bg-primary text-white font-bold hover:bg-green-600 rounded-lg shadow-lg focus:outline-none"
          @click="sendComment()"
        >
          Submit
        </button>
      </div>
    </article>

    <input :id="this.$props.post.id" type="hidden" value="" />
  </section>
</template>

<script>
import HeartIcon from "@/components/icons/Heart";
import CommentIcon from "@/components/icons/Comment";
import InfoIcon from "@/components/icons/Info";
import AgreeIcon from "@/components/icons/Agree";
import DisagreeIcon from "@/components/icons/Disagree";
import NeutralIcon from "@/components/icons/Neutral";

export default {
  data() {
    return {
      comment: "",
      commentStatus: this.isCommenting,
      emotion: null
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
    InfoIcon,
    AgreeIcon,
    DisagreeIcon,
    NeutralIcon
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
    sendComment() {
      this.$store.commit("postComment", {
        postID: this.post.id,
        authorID: this.$store.state.user.id,
        content: this.comment,
        emotion: this.emotion
      });
    },
    handleReaction(reaction) {
      this.emotion = reaction;
      this.commentStatus = true;
    }
  }
};
</script>
