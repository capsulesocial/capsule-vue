<template>
	<section class="w-full border-l border-r">
		<div style="width: 600px">
			<!-- Header -->
			<img
				:src="require(`@/assets/images/category/` + $route.params.category + `/` + `header.jpg`)"
				alt=""
				class="object-cover shadow-lg"
				style="width: 598px; height: 192px"
			/>
			<div style="padding-left: 22px; margin-top: 22px">
				<h2 class="text-2xl font-medium">Category /</h2>
				<h2 class="text-2xl capitalize font-medium">
					{{ $route.params.category }}
				</h2>
			</div>

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
	isLoading: boolean
	following: Set<string>
	currentPage: number
	limit: number
	algorithm: Algorithm
}

export default Vue.extend({
	components: {
		PostCard,
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			following: new Set(),
			currentPage: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	async created() {
		window.addEventListener(`scroll`, this.handleScroll)
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ category: this.$route.params.category }, this.algorithm)
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
					const res = await getPosts({}, this.algorithm)
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
