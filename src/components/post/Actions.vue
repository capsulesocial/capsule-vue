<template>
  <section>
    <article class="flex justify-between text-gray-600 pt-2">
      <!-- Bookmark, comment, share icons -->
      <div class="flex">
        <button
          class="flex focus:outline-none hover:text-primary mr-4 -ml-1"
          @click="handleBookmark()"
        >
          <BookmarkIcon :isActive="this.isBookmark()" class="mr-2 fill-none" />
          <span class="font-sans">{{ this.post.bookmarks.length }}</span>
        </button>
        <button
          class="flex focus:outline-none hover:text-primary"
          @click="handleComment()"
        >
          <CommentIcon class="mr-2 fill-primary" />
          <span class="font-sans">{{ this.post.comments.length }}</span>
        </button>
      </div>
      <div>
        <button
          class="flex focus:outline-none hover:text-primary"
          @click="handleShare()"
        >
          <SendIcon class="mr-2 fill-primary" />
          <span class="font-sans">{{ this.post.shares }}</span>
        </button>
      </div>
    </article>

    <!-- Post a Comment -->
    <article v-if="commentStatus" class="border-t border-b py-5 mt-5">
      <div class="flex items-center">
        <div class="p-1 border-2 rounded-full">
          <ProfileIcon class="w-6 h-6" />
        </div>
        <div class="flex bg-white border-2 rounded-xl my-1 p-1 ml-5  w-full">
          <textarea
            v-model="comment"
            class="leading-normal resize-vertical overflow-y-auto w-full focus:outline-none py-1 px-2 font-serif"
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
    <article v-if="commentStatus" class="pt-2">
      <div
        v-for="c in this.filterComments()"
        :key="c.id"
        class="py-1"
      >
        <div class="flex">
          <div class="flex-shrink-0">
            <span class="p-1 border-2 rounded-full block">
              <ProfileIcon class="w-6 h-6" />
            </span>
          </div>
          <div class="flex-1 leading-relaxed ml-2">
            <strong class="text-black font-bold bold mr-1  font-serif">
              {{ getFullName(c.authorID) }}
            </strong>
            <span class="text-gray-700 text-sm mr-2 font-serif">
              @{{ c.authorID }}
            </span>
            <span v-if="c.timestamp" class="text-gray-600 text-xs font-sans">
              {{ $helpers.formatDate(c.timestamp) }}
            </span>
            <p class="text-sm py-1 font-sans">
              {{ c.content }}
            </p>
          </div>
        </div>
        <div class="ml-10 pl-1 font-sans">
          <button>[+]</button>
          <button>reply</button>
        </div>
      </div>
    </article>

    <input :id="this.$props.post.id" type="hidden" value="" />
  </section>
</template>

<script>
import BookmarkIcon from '@/components/icons/Bookmark'
import CommentIcon from '@/components/icons/Comment'
import BrandedButton from '@/components/BrandedButton'
import SendIcon from '@/components/icons/Send'
import ProfileIcon from '@/components/icons/Person'

export default {
  components: {
    BookmarkIcon,
    CommentIcon,
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
        replies: [],
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
    handleShare () {
      this.$store.commit('addShare', this.post.id)
      const url = document.getElementById(this.$props.post.id)
      url.type = 'text'
      url.value =
        document.location.origin + '/' + this.authorID + '/' + this.post.id
      url.select()
      url.setSelectionRange(0, 99999)
      document.execCommand('copy')
      url.type = 'hidden'
      alert('URL Copied to Clipboard!')
    },
  },
}
</script>
