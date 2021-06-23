<template>
  <div v-if="$store.state.me.id !== authorID">
    <!-- Button with ICON -->
    <button
      class="rounded-full focus:outline-none"
      @click="toggleFriend"
    >
      <div
        v-if="iFollow()"
        class="bg-red-200 self-center rounded-full shadow-lg p-3 border border-black"
      >
        <span class="text-black text-bold"><UnfollowIcon /></span>
      </div>
      <div v-else class="bg-primary self-center rounded-full shadow-lg p-3">
        <span class="text-white text-bold"><FollowIcon /></span>
      </div>
    </button>
  </div>
</template>

<script>
import FollowIcon from '@/components/icons/Follow'
import UnfollowIcon from '@/components/icons/Unfollow'

export default {
  components: {
    FollowIcon,
    UnfollowIcon,
  },
  props: {
    authorID: {
      type: String,
      default: null,
    },
  },
  methods: {
    iFollow () {
      // Check if I am following currentUser
      const followingList = this.$store.state.me.following
      for (let i = 0; i < followingList.length; i++) {
        if (followingList[i] === this.$route.params.id) {
          return true
        }
      }
      return false
    },
    toggleFriend () {
      this.$store.commit('me/handleFollow', this.authorID)
      this.$store.commit('authors/handleFollow',
        {
          me: this.$store.state.me.id,
          targetUser: this.authorID,
        })
    },
  },
}
</script>
