<template>
  <div>
    <!-- Component that displays a posted comment -->
    <div class="flex">
      <!-- Avatar -->
      <div class="flex-shrink-0">
        <img
          v-if="this.avatar !== ''"
          :src="this.avatar"
          class="w-10 h-10 rounded-lg object-cover"
        />
        <span v-else class="p-1 border-2 rounded-full block">
          <ProfileIcon class="w-6 h-6" />
        </span>
      </div>
      <!-- Content -->
      <div class="flex-1 leading-relaxed ml-2">
        <strong class="text-black font-bold bold mr-1">
          {{ getFullName(comment.authorID) }}
        </strong>
        <nuxt-link :to="'/' + comment.authorID" class="text-gray-700 text-sm mr-2">
          @{{ comment.authorID }}
        </nuxt-link>
        <span v-if="comment.timestamp" class="text-gray-600 text-xs font-sans">
          {{ $formatDate(comment.timestamp) }}
        </span>
        <p class="text-base py-1 font-sans">
          {{ comment.content }}
        </p>
      </div>
    </div>
    <!-- Reply button -->
    <div class="ml-10 pl-1">
      <button
        class="font-sans text-xs focus:outline-none"
        @click="isReplying = !isReplying"
      >
        {{ this.comment.replies.length }} Replies
      </button>

      <!-- Active reply state -->
      <div v-if="isReplying" class="border-l pl-2 mr-5">
        <!-- Reply Input box -->
        <div class="flex bg-white border-2 rounded-xl my-1 p-1 ml-5  w-full">
          <textarea
            v-model="reply"
            type="text"
            placeholder="Reply.."
            class="leading-normal resize-vertical overflow-y-auto w-full focus:outline-none py-1 px-2 text-sm"
          >
          </textarea>
          <span class="relative">
            <BrandedButton
              v-if="this.reply !== ''"
              text="Post"
              :action="sendReply"
              :thin="true"
              class="text-sm absolute bottom-0 right-0"
            />
          </span>
        </div>
        <!-- List replies -->
        <Reply
          v-for="r in this.filterReplies()"
          :key="r.id"
          :reply="r"
          class="pt-1"
        >
        </Reply>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileIcon from '@/components/icons/Person.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import Reply from '@/components/post/Reply.vue'

export default {
  components: {
    ProfileIcon,
    BrandedButton,
    Reply,
  },
  props: {
    comment: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      isReplying: false,
      reply: '',
      replies: this.comment.replies,
      avatar: '',
    }
  },
  created () {
    if (this.$props.comment.authorAvatarCID !== null) {
      this.$getPhoto(this.$props.comment.authorAvatarCID).then((image) => {
        this.avatar = image
      })
    }
  },
  methods: {
    getFullName (id) {
      if (this.$store.state.me.id === id) {
        return this.$store.state.me.username
      }
      const list = this.$store.state.authors
      const name = list.find(x => x.id === id)
      if (name) {
        return name.username
      } else {
        return id
      }
    },
    sendReply () {
      if (this.comment === '' || !this.$qualityText(this.reply)) {
        alert('Invalid reply!')
      } else {
        const r = {
          postID: this.$props.comment.postID,
          commentID: this.$props.comment.id,
          authorID: this.$store.state.session.id,
          authorCID: this.$store.state.session.cid,
          authorAvatarCID: this.$store.state.session.avatar,
          content: this.reply,
          timestamp: new Date(),
        }
        // this.$store.commit('posts/commentReply', r)
        this.replies.push(r)
        this.filterReplies()
        this.reply = ''
      }
    },
    filterReplies () {
      const rList = this.replies.slice().sort((p0, p1) => {
        return p1.timestamp - p0.timestamp
      })
      return rList
    },
  },
}
</script>
