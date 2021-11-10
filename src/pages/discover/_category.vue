<template>
	<section class="w-full border border-lightBorder">
		<!-- Header -->
		<div
			class="sticky bg-primary -mx-6 -mt-6 rounded-lg flex flex-row items-center shadow-lg h-56 border-lightBorder"
			:style="{
				background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
					$route.params.category +
					`/` +
					`header.png`)})`,
				backgroundSize: 'cover',
			}"
		>
			<div class="px-6 py-5 flex flex-col justify-between h-full">
				<button class="flex focus:outline-none" @click="$router.go(-1)">
					<div class="bg-gray1 rounded-full flex-shrink-0">
						<BackIcon />
					</div>
					<p class="pl-3 font-semibold">All categories</p>
				</button>
				<h2 class="text-3xl text-lightOnPrimaryText font-semibold">{{ $route.params.category }}</h2>
			</div>
		</div>
		<!-- Posts loaded -->
		<article v-for="p in posts" :key="p.post._id" class="pt-4">
			<PostCard
				:post="p.post"
				:comments="p.comments"
				:usersFollowing="following"
				:toggleFriend="toggleFriend"
				:bookmarked="p.bookmarked"
			/>
		</article>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="flex justify-center" style="width: 660px">
			<div class="loader m-5"></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import BackIcon from '@/components/icons/ChevronLeft.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: IPostResponse[]
	isLoading: boolean
	following: Set<string>
	currentOffset: number
	limit: number
	algorithm: Algorithm
}

export default Vue.extend({
	components: {
		PostCard,
		BackIcon,
	},
	layout: `discover`,
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			following: new Set(),
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts(
			{ category: this.$route.params.category },
			this.$store.state.session.id,
			this.algorithm,
			0,
			this.limit,
		)
		this.currentOffset += this.limit
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
		this.isLoading = false
		window.addEventListener(`scroll`, this.handleScroll)
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
		async loadPosts() {
			this.isLoading = true
			try {
				const res = await getPosts(
					{ category: this.$route.params.category },
					this.$store.state.session.id,
					this.algorithm,
					this.currentOffset,
					this.limit,
					this.$store.state.session.id,
				)
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
			} catch (err) {
				alert(err)
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll() {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				await this.loadPosts()
				this.currentOffset += this.limit
			}
		},
	},
})
</script>
