<template>
	<div>
		<h2 class="text-xl text-primary font-semibold px-6 pt-4 pb-3" style="backdrop-filter: blur(10px)">My bookmarks</h2>
		<div
			class="fixed overflow-y-auto"
			style="width: 748px; min-height: calc(100vh - 220px); height: calc(100vh - 220px)"
		>
			<nuxt-child :posts="posts" :followingList="following" :toggleFriend="toggleFriend" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IPostResponse } from '@/backend/post'

interface IData {
	following: Set<string>
}

export default Vue.extend({
	layout: `bookmarks`,
	props: {
		posts: {
			type: Array as () => IPostResponse[],
			required: true,
		},
	},
	data(): IData {
		return {
			following: new Set(),
		}
	},
	created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
	},
})
</script>
