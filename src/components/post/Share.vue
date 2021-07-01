<template>
  <div class="flex relative">
    <button
      class="flex focus:outline-none hover:text-primary toggle"
      :class="showSocialShares ? 'text-primary' : ''"
      @click.stop="toggleDropdown"
    >
      <SendIcon class="mr-2" />
    </button>
    <div
      v-if="this.showSocialShares"
      class="absolute flex flex-col mt-8 bg-white border-l border-r border-b rounded-lg p-1 rounded-t-none w-40 pl-2"
    >
      <!-- Repost -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleRepost()"
      >
        <RepostIcon :isActive="this.isReposted" :shrink="true" />
        <span v-if="this.isReposted" class="text-sm self-center text-primary">Undo Repost</span>
        <span v-else class="text-sm self-center">Repost to Feed</span>
      </button>
      <!-- Twitter -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleShare('TWITTER')"
      >
        <TwitterIcon class="p-1" />
        <span class="text-sm">Share on Twitter</span>
      </button>
      <!-- Copy URL Link -->
      <button
        class="flex focus:outline-none hover:text-primary"
        @click="handleShare('URL')"
      >
        <LinkIcon class="p-1" />
        <span class="text-sm self-center">Copy Link</span>
      </button>
    </div>
    <input :id="this.$props.post.id" type="hidden" value="" class="hidden" />
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import SendIcon from '@/components/icons/Send.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import LinkIcon from '@/components/icons/Link.vue'
import RepostIcon from '@/components/icons/Repost.vue'

export default Vue.extend({
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
      isReposted: false,
    }
  },
  created () {
    let reposts = this.$store.state.session.reposts
    if(!reposts) return
    if(reposts.includes(this.$props.post.id)) {
      this.isReposted = true
    }
  },
  mounted () {
    window.addEventListener('click', (e: any): void => {
      if(!e.target) return
      if (e.target.parentNode === null || e.target.parentNode.classList === undefined || !e.target.parentNode.classList.contains('toggle')) {
        this.showSocialShares = false
      }
    }, false)
  },
  methods: {
    handleRepost () {
      this.$store.commit('me/handleRepost', this.$props.post.id)
      this.isReposted = !this.isReposted
      if (this.isReposted) {
        alert('Reposted!')
      } else {
        alert('Repost Removed!')
      }
    },
    handleShare (type) {
      // this.$store.commit('posts/addShare', this.post.id)
      let shareElement = document.createElement('textarea')
      shareElement.value = `${document.location.origin}/${this.post.authorID}/${this.post.id}`
      shareElement.style.opacity = '0'
      document.body.appendChild(shareElement)
      switch (type) {
      case 'URL':
        shareElement.focus()
        shareElement.select()
        let copied = document.execCommand('copy')
        alert(copied? 'Copied' : 'Not copied')
        document.body.removeChild(shareElement)
        break
      case 'TWITTER':
        window.open('https://twitter.com/share?url=' + encodeURIComponent(shareElement.value) + '&text=' + '📰 ' + this.post.title + '\n 🔏 ' + this.post.authorID + ' on @CapsuleSoc 🔗')
        break
      }
      // Close Dropdown
      this.showSocialShares = false
    },
    toggleDropdown () {
      this.showSocialShares = !this.showSocialShares
    },
  },
})
</script>
