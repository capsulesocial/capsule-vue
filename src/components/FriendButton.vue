<template>
  <div v-if="$store.state.session.cid !== authorCID">
    <button
      class="rounded-full focus:outline-none"
      @click="toggleFriend"
    >
      <div
        v-if="iFollow()"
        class="bg-red-200 rounded-lg shadow-lg px-2 py-1"
      >
        <span class="text-black text-bold text-sm">Unfollow</span>
      </div>
      <div v-else class="bg-primary rounded-lg shadow-lg px-2 py-1">
        <span class="text-white text-bold text-sm">Follow</span>
      </div>
    </button>
  </div>
</template>

<script>
export default {
	props: {
		authorCID: {
			type: String,
			default: null,
		},
	},
	methods: {
		iFollow () {
			// Check if I am following currentUser
			const followingList = this.$store.state.session.following
			for (let i = 0; i < followingList.length; i++) {
				if (followingList[i] === this.$route.params.id) {
					return true
				}
			}
			return false
		},
		toggleFriend () {
			// this.$store.commit('me/handleFollow', this.authorID)
			// this.$store.commit('authors/handleFollow',
			//   {
			//     me: this.$store.state.session.cid,
			//     targetUser: this.authorID,
			//   })
		},
	},
}
</script>
