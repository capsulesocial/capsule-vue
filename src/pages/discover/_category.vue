<template>
	<section class="w-full border border-lightBorder">
		<!-- Header -->
		<div
			id="header"
			class="bg-primary rounded-lg flex flex-row items-center shadow-lg h-56 border-lightBorder w-full trigger-menu-wrapper"
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
				<h2 class="text-3xl text-lightOnPrimaryText font-semibold capitalize">{{ $route.params.category }}</h2>
			</div>
		</div>
		<!-- Posts loaded -->
		<div
			id="column"
			class="fixed overflow-y-auto"
			style="width: 748px"
			:style="`min-height: calc(100vh - ` + padding + `); height: calc(100vh - ` + padding + `)`"
		>
			<article v-for="p in posts" :key="p.post._id">
				<PostCard
					:repost="p.repost"
					:post="p.post"
					:cid="p.post._id"
					:comments="p.comments"
					:toggleFriend="toggleFriend"
					:usersFollowing="following"
					:repostedBy="p.repost ? p.repost.authorID : undefined"
					:bookmarked="p.bookmarked"
					:hideRepostIcon="algorithm === `NEW` || algorithm === `TOP`"
					:bookmarksCount="p.bookmarksCount"
					:repostCount="p.repostCount"
				/>
			</article>
		</div>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="flex justify-center w-full">
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
	lastScroll: number
	following: Set<string>
	currentOffset: number
	limit: number
	algorithm: Algorithm
	padding: string
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
			lastScroll: 0,
			padding: `0px`,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ category: this.$route.params.category }, this.$store.state.session.id, {
			sort: this.algorithm,
			limit: this.limit,
			offset: 0,
		})
		this.currentOffset += this.limit
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
		this.isLoading = false
		window.addEventListener(`scroll`, this.handleScroll)
		const container = document.getElementById(`column`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScrollHeader)
		}
	},
	destroyed() {
		const container = document.getElementById(`column`)
		if (container) {
			container.removeEventListener(`scroll`, this.handleScrollHeader)
		}
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
				const res = await getPosts({ category: this.$route.params.category }, this.$store.state.session.id, {
					sort: this.algorithm,
					limit: this.limit,
					offset: this.currentOffset,
					following: this.$store.state.session.id,
				})
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
			} catch (err) {
				this.$toastError(`error`)
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
		handleScrollHeader() {
			const body = document.getElementById(`column`)
			const header = document.getElementById(`header`)
			this.padding = header?.clientHeight + `px`
			const scrollUp = `scrollup`
			const scrollDown = `scrolldown`
			if (!body) {
				return
			}
			const currentScroll = body.scrollTop
			if (!header) {
				return
			}
			if (body.scrollTop <= 0) {
				header.classList.remove(scrollUp)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
				header.classList.remove(scrollDown)
				header.classList.add(scrollUp)
			}
			this.lastScroll = currentScroll
		},
	},
})
</script>

<style>
.trigger-menu-wrapper {
	transition: all 0.4s;
	z-index: 50;
}
.page-header {
	transition: all 0.3s ease-in-out;
}
.trigger-menu-wrapper {
	transition: all 0.4s;
}
.scrolldown {
	background: linear-gradient(rgba(46, 85, 106, 0.25) 0%, rgba(46, 85, 106, 0.25) 100%) !important;
	height: 4rem;
	backdrop-filter: blur(10px);
}
.scrollup {
	opacity: 1;
	transform: none;
}
</style>
