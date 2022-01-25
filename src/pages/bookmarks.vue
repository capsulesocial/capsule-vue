<template>
	<div>
		<h2
			class="text-primary px-5 pt-3 pb-3 text-lg font-semibold xl:px-6 xl:pt-4 xl:text-xl"
			style="backdrop-filter: blur(10px)"
		>
			My bookmarks
		</h2>
		<div class="xl:w-750 min-h-180 h-180 xl:min-h-220 xl:h-220 fixed w-full overflow-y-auto">
			<nuxt-child :posts="posts" :followingList="following" :toggleFriend="toggleFriend" :isLoading="isLoading" />
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
		isLoading: {
			type: Boolean,
			required: false,
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
