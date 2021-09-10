<template>
	<button class="rounded-full focus:outline-none" @click="toggleFriend">
		<div v-if="iFollow()" class="text-black">
			<span v-if="this.$props.showIcons" class="rounded-full bg-red-200">
				<UnfollowIcon />
			</span>
			<span v-else class="text-bold rounded-lg text-sm bg-red-200 shadow-lg px-2 py-1">Unfollow</span>
		</div>
		<div v-else>
			<div v-if="this.$props.showIcons" class="shadow-lg rounded-full bg-primary p-3 items-center">
				<FollowIcon class="text-white" />
			</div>
			<span v-else class="text-white text-bold rounded-full text-sm bg-primary shadow-lg px-4 py-1">Follow</span>
		</div>
	</button>
</template>

<script>
import Vue from 'vue'
import FollowIcon from '@/components/icons/Follow.vue'
import UnfollowIcon from '@/components/icons/Unfollow.vue'

export default Vue.extend({
	components: {
		FollowIcon,
		UnfollowIcon,
	},
	props: {
		authorID: {
			type: String,
			default: null,
		},
		showIcons: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		iFollow() {
			// Check if I am following currentUser
			const followingList = this.$store.state.session.following
			for (let i = 0; i < followingList.length; i++) {
				if (followingList[i] === this.$route.params.id) {
					return true
				}
			}
			return false
		},
		toggleFriend() {},
	},
})
</script>
