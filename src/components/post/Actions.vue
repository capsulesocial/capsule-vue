<template>
  <section>
    <!-- Post a Comment -->
    <article class="border-t border-b py-5 mt-5">
      <div class="flex items-center">
        <div class="p-1 border-2 rounded-full">
          <ProfileIcon class="w-6 h-6" />
        </div>
        <div class="flex bg-white border-2 rounded-xl my-1 p-1 ml-5  w-full">
          <textarea
            v-model="comment"
            class="leading-normal resize-vertical overflow-y-auto w-full focus:outline-none py-1 px-2"
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
    <article class="pt-3">
      <Comment
        v-for="c in this.filterComments()"
        :key="c.id"
        class="py-2"
        :comment="c"
        :postID="post.id"
      >
      </Comment>
    </article>
  </section>
</template>

<script>
import BrandedButton from '@/components/BrandedButton'
import ProfileIcon from '@/components/icons/Person'
import Comment from '@/components/post/Comment'

export default {
  components: {
    BrandedButton,
    ProfileIcon,
    Comment,
  },
  props: {
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
      comments: this.post.comments,
      emotion: null,
      showSocialShares: false,
    }
  },
  methods: {
    sendComment () {
      const c = {
        postID: this.post.id,
        authorID: this.$store.state.me.id,
        content: this.comment,
        emotion: this.emotion,
        timestamp: new Date(),
        replies: [],
      }
      // this.$store.commit('posts/postComment', c)
      this.comments.push(c)
      this.filterComments()
      this.comment = ''
    },
    handleReaction (reaction) {
      this.emotion = reaction
    },
    filterComments () {
      const cList = this.comments.slice().sort((p0, p1) => {
        return p1.timestamp - p0.timestamp
      })
      return cList
    },
    handleShare (type) {
      this.$store.commit('posts/addShare', this.post.id)
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
