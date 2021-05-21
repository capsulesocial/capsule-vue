<template>
  <div>
    <div class="flex">
      <div class="flex-shrink-0">
        <span class="p-1 border-2 rounded-full block">
          <ProfileIcon class="w-6 h-6" />
        </span>
      </div>
      <div class="flex-1 leading-relaxed ml-2">
        <strong class="text-black font-bold bold mr-1 font-serif">
          {{ getFullName(comment.authorID) }}
        </strong>
        <nuxt-link :to="'/' + comment.authorID" class="text-gray-700 text-sm mr-2 font-serif">
          @{{ comment.authorID }}
        </nuxt-link>
        <span v-if="comment.timestamp" class="text-gray-600 text-xs font-sans">
          {{ $helpers.formatDate(comment.timestamp) }}
        </span>
        <p class="text-base py-1 font-sans">
          {{ comment.content }}
        </p>
      </div>
    </div>
    <div class="ml-10 pl-1">
      <button
        class="font-sans text-xs focus:outline-none"
        @click="isReplying = !isReplying"
      >
        {{ this.comment.replies.length }} Replies
      </button>

      <!-- Active state -->
      <div v-if="isReplying" class="border-l pl-2 mr-5">
        <!-- Reply Input box -->
        <div class="flex bg-white border-2 rounded-xl my-1 p-1 ml-5  w-full">
          <textarea
            v-model="reply"
            type="text"
            placeholder="Reply.."
            class="leading-normal resize-vertical overflow-y-auto w-full focus:outline-none py-1 px-2 font-serif text-sm"
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
        <div v-for="r in this.comment.replies" :key="r.id" class="pt-1">
          <div class="flex">
            <div class="flex-shrink-0">
              <span class="p-1 border-2 rounded-full block">
                <ProfileIcon class="w-6 h-6" />
              </span>
            </div>
            <div class="flex-1 leading-relaxed ml-2">
              <strong class="text-black font-bold bold mr-1 font-serif">
                {{ getFullName(r.authorID) }}
              </strong>
              <span class="text-gray-700 text-sm mr-2 font-serif">
                @{{ r.authorID }}
              </span>
              <span v-if="r.timestamp" class="text-gray-600 text-xs font-sans">
                {{ $helpers.formatDate(r.timestamp) }}
              </span>
              <p class="text-sm py-1 font-sans">
                {{ r.content }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProfileIcon from '@/components/icons/Person'
import BrandedButton from '@/components/BrandedButton'

export default {
  components: {
    ProfileIcon,
    BrandedButton,
  },
  props: {
    comment: {
      type: Object,
      default: null,
    },
    postID: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      isReplying: false,
      reply: '',
    }
  },
  methods: {
    getFullName (id) {
      if (this.$store.state.me.user.id === id) {
        return this.$store.state.me.user.username
      }
      const list = this.$store.state.authors.userList
      const name = list.find(x => x.id === id)
      if (name) {
        return name.username
      } else {
        return id
      }
    },
    sendReply () {
      this.$store.commit('posts/commentReply', {
        postID: this.$props.postID,
        commentID: this.$props.comment.id,
        authorID: this.$store.state.me.user.id,
        content: this.reply,
        timestamp: new Date(),
      })
      this.reply = ''
    },
  },
}
</script>
