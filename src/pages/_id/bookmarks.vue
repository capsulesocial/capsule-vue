<template>
	<section class="px-4">
		<article v-for="p in posts" :key="p.post._id">
			<PostCard :post="p.post" :bookmarked="p.bookmarked" :toggleFriend="toggleFriend" :usersFollowing="following" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getPosts, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: IPostResponse[]
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
			posts: [],
			following: new Set(),
		}
	},
	async created() {
		const bookmarkList = await getPosts({ bookmarkedBy: this.$route.params.id }, this.$store.state.session.id)
		bookmarkList.forEach((p) => {
			this.posts.push(p)
		})
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		getPosts,
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
