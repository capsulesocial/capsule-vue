<template>
	<div>
		<h6 class="text-primary font-semibold">Bookmarks</h6>
		<nuxt-child :posts="posts" :followingList="following" :toggleFriend="toggleFriend" />
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
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
	},
})
</script>