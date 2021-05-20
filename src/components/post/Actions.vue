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
          :class="this.isCommenting ? 'text-primary' : ''"
          @click="handleComment()"
        >
          <CommentIcon class="mr-2 fill-primary" />
          <span class="font-sans">{{ this.post.comments.length }}</span>
        </button>
      </div>
      <!-- Share to Socials -->
      <div class="flex flex-row-reverse">
        <button
          class="flex focus:outline-none hover:text-primary"
          :class="this.showSocialShares ? 'text-primary' : ''"
          @click="showSocialShares = !showSocialShares"
        >
          <SendIcon class="mr-2" />
          <span class="font-sans">{{ this.post.shares }}</span>
        </button>
        <!-- Twitter -->
        <button
          v-if="showSocialShares"
          class="flex focus:outline-none hover:text-primary"
          @click="handleShare('TWITTER')"
        >
          <TwitterIcon class="mx-2" />
        </button>
        <!-- Copy URL Link -->
        <button
          v-if="this.showSocialShares"
          class="flex focus:outline-none hover:text-primary"
          @click="handleShare('URL')"
        >
          <LinkIcon />
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
          <span class="relative">
            <BrandedButton
              v-if="this.comment !== ''"
              text="Post"
              :action="sendComment"
              :thin="true"
              class="text-sm absolute bottom-0 right-0"
            />
          </span>
        </div>
      </div>
    </article>
    <article v-if="commentStatus" class="pt-3">
      <Comment
        v-for="c in this.filterComments()"
        :key="c.id"
        class="py-2"
        :comment="c"
        :postID="post.id"
      >
      </Comment>
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
import Comment from '@/components/post/Comment'
import TwitterIcon from '@/components/icons/brands/Twitter'
import LinkIcon from '@/components/icons/Link'

export default {
  components: {
    BookmarkIcon,
    CommentIcon,
    BrandedButton,
    SendIcon,
    ProfileIcon,
    Comment,
    TwitterIcon,
    LinkIcon,
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
      showSocialShares: false,
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
    filterComments () {
      const cList = this.post.comments
      const comments = cList.slice().sort((p0, p1) => {
        return p1.timestamp - p0.timestamp
      })
      return comments
    },
    handleShare (type) {
      this.$store.commit('addShare', this.post.id)
      const url = document.getElementById(this.$props.post.id)
      url.type = 'text'
      url.value =
        document.location.origin + '/' + this.authorID + '/' + this.post.id
      if (type === 'URL') {
        url.select()
        url.setSelectionRange(0, 99999)
        document.execCommand('copy')
        url.type = 'hidden'
        alert('URL Copied to Clipboard!')
      }
      if (type === 'TWITTER') {
        window.open('https://twitter.com/share?url=' + encodeURIComponent(url.value) + '&text=' + '📰 ' + this.post.title + '\n 🔏 ' + this.post.authorID + ' on @CapsuleSoc 🔗')
      }
    },
  },
}
</script>
