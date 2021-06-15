<template>
  <button
    class="flex focus:outline-none hover:text-primary"
    @click="handleRepost()"
  >
    <RepostIcon :isActive="this.isReposted" />
  </button>
</template>

<script>
import RepostIcon from '@/components/icons/Repost'

export default {
  components: {
    RepostIcon,
  },
  props: {
    postID: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      isReposted: this.$store.state.me.reposts.includes(this.$props.postID),
    }
  },
  methods: {
    handleRepost () {
      this.$store.commit('me/handleRepost', this.$props.postID)
      this.isReposted = !this.isReposted
      if (this.isReposted) {
        alert('Reposted!')
      } else {
        alert('Repost Removed!')
      }
    },
  },
}
</script>
