<template>
  <div class="flex relative">
    <button
      class="flex focus:outline-none hover:text-primary"
      :class="this.showSocialShares ? 'text-primary' : ''"
      @click="showSocialShares = !showSocialShares"
    >
      <SendIcon class="mr-2" />
    </button>
    <div
      v-if="showSocialShares"
      class="absolute flex flex-col mt-8 bg-white border-l border-r border-b rounded-lg p-1 rounded-t-none"
    >
      <!-- Repost -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleShare('REPOST')"
      >
        <RepostIcon class="p-1" />
        <span class="text-xs self-center">Repost</span>
      </button>
      <!-- Twitter -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleShare('TWITTER')"
      >
        <TwitterIcon class="p-1" />
        <span class="text-xs self-center">Twitter</span>
      </button>
      <!-- Copy URL Link -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleShare('URL')"
      >
        <LinkIcon class="p-1" />
        <span class="text-xs self-center">Link</span>
      </button>
    </div>
    <input :id="this.$props.post.id" type="hidden" value="" class="hidden" />
  </div>
</template>

<script>
import SendIcon from '@/components/icons/Send'
import TwitterIcon from '@/components/icons/brands/Twitter'
import LinkIcon from '@/components/icons/Link'
import RepostIcon from '@/components/icons/Repost'

export default {
  components: {
    SendIcon,
    TwitterIcon,
    LinkIcon,
    RepostIcon,
  },
  props: {
    post: {
      type: Object,
      default: null,
    },
  },
  data () {
    return {
      showSocialShares: false,
    }
  },
  methods: {
    handleShare (type) {
      // this.$store.commit('posts/addShare', this.post.id)
      const url = document.getElementById(this.$props.post.id)
      url.type = 'text'
      url.value =
        document.location.origin + '/' + this.post.authorID + '/' + this.post.id
      if (type === 'URL') {
        url.select()
        url.setSelectionRange(0, 99999)
        document.execCommand('copy')
        url.type = 'hidden'
        alert('URL Copied to Clipboard!')
      } else if (type === 'TWITTER') {
        window.open('https://twitter.com/share?url=' + encodeURIComponent(url.value) + '&text=' + '📰 ' + this.post.title + '\n 🔏 ' + this.post.authorID + ' on @CapsuleSoc 🔗')
      } else if (type === 'REPOST') {
        this.$store.commit('me/handleRepost', this.$props.post.id)
      }
      // Close Dropdown
      this.showSocialShares = false
    },
  },
}
</script>
