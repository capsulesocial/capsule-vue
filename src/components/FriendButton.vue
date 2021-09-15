<template>
	<button class="rounded-full focus:outline-none" @click="toggleFriend">
		<div v-if="following" class="text-black">
			<span v-if="showIcons" class="rounded-full bg-red-200">
				<UnfollowIcon />
			</span>
			<span v-else class="text-bold rounded-lg text-sm bg-red-200 shadow-lg px-2 py-1">Unfollow</span>
		</div>
		<div v-else>
			<div v-if="showIcons" class="shadow-lg rounded-full bg-primary p-3 items-center">
				<FollowIcon class="text-white" />
			</div>
			<span v-else class="text-white text-bold rounded-full text-sm bg-primary shadow-lg px-4 py-1">Follow</span>
		</div>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import FollowIcon from '@/components/icons/Follow.vue'
import UnfollowIcon from '@/components/icons/Unfollow.vue'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	following: boolean
}

export default Vue.extend({
	components: {
		FollowIcon,
		UnfollowIcon,
	},
	props: {
		authorID: {
			type: String,
			required: true,
		},
		showIcons: {
			type: Boolean,
			default: false,
		},
	},
	data: (): IData => {
		return {
			following: false,
		}
	},
	async created() {
		const data = await getFollowersAndFollowing(this.$store.state.session.id)
		this.following = data.following.has(this.authorID)
	},
	methods: {
		async toggleFriend() {
			await followChange(this.following ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, this.authorID)
			const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
			this.following = data.following.has(this.authorID)
		},
	},
})
</script>
