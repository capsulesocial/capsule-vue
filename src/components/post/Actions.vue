<template>
  <section>
    <article class="flex justify-between px-8 p-2 text-gray-600">
      <div class="flex">
        <button
          class="flex focus:outline-none hover:text-primary mr-4"
          @click="handleBookmark()"
        >
          <BookmarkIcon :isActive="this.isBookmark()" class="mr-2 fill-none" />
          {{ this.post.bookmarks.length }}
        </button>
        <button
          class="flex focus:outline-none hover:text-primary"
          @click="handleComment()"
        >
          <CommentIcon class="mr-2 fill-primary" />
          {{ this.post.comments.length }}
        </button>
      </div>
      <div>
        <button
          class="flex focus:outline-none hover:text-primary"
        >
          <SendIcon class="mr-2 fill-primary" />
        </button>
      </div>
    </article>

    <article v-if="commentStatus" class="border-t border-b py-2 mt-2 mx-4">
      <div class="flex items-center">
        <div class="p-1 border-2 rounded-full">
          <ProfileIcon class="w-6 h-6" />
        </div>
        <div class="flex bg-white border-2 rounded-xl m-1 p-1  w-full">
          <input
            v-model="comment"
            type="text"
            class="leading-normal resize-vertical w-full focus:outline-none p-1"
            name="body"
            placeholder="Write a Comment..."
          />
          <BrandedButton
            v-if="this.comment !== ''"
            text="Post"
            :action="sendComment"
            :thin="true"
            class="text-sm"
          />
        </div>
      </div>
    </article>
    <article v-if="commentStatus" class="px-4 py-2">
      <div
        v-for="c in this.filterComments()"
        :key="c.id"
        class="flex py-1"
      >
        <div class="flex-shrink-0">
          <span class="p-1 border-2 rounded-full block">
            <ProfileIcon class="w-6 h-6" />
          </span>
        </div>
        <!-- <AgreeIcon v-if="c.emotion === 'agree'" class="inline" />
        <NeutralIcon v-if="c.emotion === 'neutral'" class="inline" />
        <DisagreeIcon v-if="c.emotion === 'disagree'" class="inline" /> -->
        <div class="flex-1 leading-relaxed ml-2">
          <strong class="text-black font-bold mr-1">
            {{ getFullName(c.authorID) }}
          </strong>
          <span class="text-gray-700 text-sm mr-2">
            @{{ c.authorID }}
          </span>
          <span v-if="c.timestamp" class="text-gray-600 text-xs">
            {{ $helpers.formatDate(c.timestamp) }}
          </span>
          <p class="text-sm px-2 py-1">
            {{ c.content }}
          </p>
        </div>
      </div>
    </article>

    <input :id="this.$props.post.id" type="hidden" value="" />
  </section>
</template>

<script>
import BookmarkIcon from '@/components/icons/Bookmark'
import CommentIcon from '@/components/icons/Comment'
// import AgreeIcon from '@/components/icons/Agree'
// import DisagreeIcon from '@/components/icons/Disagree'
// import NeutralIcon from '@/components/icons/Neutral'
import BrandedButton from '@/components/BrandedButton'
import SendIcon from '@/components/icons/Send'
import ProfileIcon from '@/components/icons/Profile'

export default {
  components: {
    BookmarkIcon,
    CommentIcon,
    // AgreeIcon,
    // DisagreeIcon,
    // NeutralIcon,
    BrandedButton,
    SendIcon,
    ProfileIcon,
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
        timestamp: new Date(),
      })
      this.comment = ''
    },
    handleReaction (reaction) {
      this.emotion = reaction
      this.commentStatus = true
    },
    getFullName (id) {
      if (this.$store.state.user.id === id) {
        return this.$store.state.user.username
      }
      const list = this.$store.state.userList
      const name = list.find(x => x.id === id)
      if (name) {
        return name.username
      } else {
        return id
      }
    },
    filterComments () {
      const cList = this.post.comments
      const comments = cList.slice().sort((p0, p1) => {
        return p1.timestamp - p0.timestamp
      })
      return comments
    },
  },
}
</script>
