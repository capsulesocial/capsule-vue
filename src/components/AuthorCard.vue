<template>
  <div
    v-if="this.currentUser"
    class="border rounded-lg bg-gray-200 p-5 shadow-xl my-5 flex flex-row justify-between"
  >
    <div>
      <h6 class="text-sm italic">
        About the Author:
      </h6>
      <h4 class="text-lg inline">
        {{ this.currentUser.username }}
      </h4>
      <nuxt-link
        :to="'/' + this.currentUser.id"
        class="text-sm text-primary underline inline"
      >
        @{{ this.currentUser.id }}
      </nuxt-link>
      <p class="italic text-sm text-gray-700">
        {{ this.currentUser.bio }}
      </p>
    </div>
    <FriendButton :targetUser="currentUser" />
  </div>
</template>

<script>
import FriendButton from '@/components/FriendButton'

export default {
  components: {
    FriendButton,
  },
  data () {
    return {
      currentUser: null,
    }
  },
  created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.me.id) {
      this.currentUser = this.$store.state.me
    }
    // Get user profile
    // this.currentUser = this.$api.profile.getProfile(this.$route.params.id)
    const l = this.$store.state.authors
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$route.params.id) {
        this.currentUser = l[p]
      }
    }
  },
  methods: {
    toggleFriend () {
      this.$store.commit('me/handleFollow', this.currentUser.id)
      this.$store.commit('authors/handleFollow',
        {
          me: this.$store.state.me.id,
          targetUser: this.currentUser.id,
        })
    },
    openWindow (url) {
      if (process.client) {
        window.open(url, '_blank')
      }
    },
  },
}
</script>
