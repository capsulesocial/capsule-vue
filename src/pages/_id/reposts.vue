<template>
	<section class="px-4">
		<div v-for="p in this.reposts" :key="p.repost._id">
			<PostCard
				:repost="p.repost"
				:post="p.post"
				:authorID="p.post.authorID"
				:authorUsername="p.post.authorID"
				:cid="p.post._id"
				:repostedBy="$route.params.id"
				:toggleFriend="toggleFriend"
				:usersFollowing="following"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getReposts, IRepostRetrieved } from '@/backend/reposts'
import { Profile } from '@/backend/profile'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	reposts: Array<IRepostRetrieved>
	isLoading: boolean
	currentOffset: number
	limit: number
	following: Set<string>
}

export default Vue.extend({
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {
			reposts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			following: new Set(),
		}
	},
	async created() {
		const res = await getReposts(this.$route.params.id)
		for (const i in res) {
			if (res[i]) {
				// @ts-ignore
				this.reposts.push(res[i])
			}
		}
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		getReposts,
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
