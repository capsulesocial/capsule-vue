<template>
	<section class="w-full">
		<div style="width: 600px" class="border-l border-r">
			<article class="p-4">
				<h2 class="text-xl">Hashtags /</h2>
				<h2 class="text-2xl uppercase">#{{ $route.params.tag }}</h2>
			</article>
			<!-- Posts loaded -->
			<article v-for="p in posts" :key="p.post._id" style="padding-left: 22px">
				<PostCard :post="p.post" :comments="p.comments" :usersFollowing="following" :toggleFriend="toggleFriend" />
			</article>
			<!-- Not loaded yet -->
			<article v-show="isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: IPostResponse[]
	tag: string
	isLoading: boolean
	following: Set<string>
	currentPage: number
	limit: number
	algorithm: Algorithm
}

export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
	},
	data(): IData {
		return {
			posts: [],
			tag: this.$route.params.tag,
			isLoading: true,
			following: new Set(),
			currentPage: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	async created() {
		window.addEventListener(`scroll`, this.handleScroll)
		// Fetch posts with tag
		this.posts = await getPosts({ tag: this.$route.params.tag }, this.algorithm)
		this.isLoading = false
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		loadPosts(a: Algorithm, page: number, limit: number) {
			this.isLoading = true
			setTimeout(async () => {
				try {
					const res = await getPosts({ tag: this.$route.params.tag }, this.algorithm)
					// eslint-disable-next-line
					console.log(a, page, limit)
					this.posts = this.posts.concat(res)
				} catch (err) {
					alert(err)
				} finally {
					this.isLoading = false
				}
			}, 500)
		},
		handleScroll() {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				this.currentPage++
				this.loadPosts(this.algorithm, this.currentPage, this.limit)
			}
		},
	},
})
</script>
