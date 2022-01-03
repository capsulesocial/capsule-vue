<template>
	<section class="px-0">
		<article v-if="reposts.length == 0" class="grid justify-items-center mt-32">
			<p class="text-sm text-gray5 mb-5">
				<span v-if="$route.params.id === $store.state.session.id"
					>It seems you haven't reposted any content yet, you can repost any post:</span
				>
				<span v-else>{{ $route.params.id }} hasn't reposted any content yet :(</span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Repost content`"
				:action="toggleHomeFeed"
			/>
		</article>
		<div v-for="p in reposts" :key="p.repost._id">
			<PostCard
				:repost="p.repost"
				:post="p.post"
				:cid="p.post._id"
				:comments="p.comments"
				:toggleFriend="toggleFriend"
				:usersFollowing="following"
				:repostedBy="p.repost.authorID"
				:bookmarked="p.bookmarked"
				:bookmarksCount="p.bookmarksCount"
				:repostCount="p.repostCount"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getReposts } from '@/backend/reposts'
import { Profile } from '@/backend/profile'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IRepostResponse } from '@/backend/post'

interface IData {
	reposts: Array<IRepostResponse>
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
		this.reposts = await getReposts({ authorID: this.$route.params.id }, {})
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
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>
