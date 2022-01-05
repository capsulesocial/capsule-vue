<template>
	<div class="w-full border border-lightBorder">
		<section>
			<nav
				class="flex flex-row z-20 text-base w-full px-6 pt-4 bg-gradient-to-r from-lightBGStart to-lightBGStop"
				style="backdrop-filter: blur(10px)"
			>
				<div class="flex items-center">
					<button
						:class="algorithm === `FOLLOWING` ? ` text-primary border-b-2 border-primary font-semibold` : `text-gray5`"
						class="h-full focus:outline-none w-full pb-3"
						@click="sortFeed('FOLLOWING')"
					>
						Following
					</button>
				</div>
				<div class="flex items-center px-12">
					<button
						:class="algorithm === `NEW` ? `text-primary border-b-2 border-primary font-semibold` : `text-gray5`"
						class="h-full focus:outline-none w-full pb-3"
						@click="sortFeed('NEW')"
					>
						New
					</button>
				</div>
				<div class="flex items-center">
					<button
						:class="algorithm === `TOP` ? ` text-primary border-b-2 border-primary font-semibold` : `text-gray5`"
						class="h-full focus:outline-none w-full pb-3"
						@click="sortFeed('TOP')"
					>
						Top
					</button>
				</div>
			</nav>
			<div
				v-if="posts"
				ref="container"
				class="fixed overflow-y-auto"
				style="width: 748px; min-height: calc(100vh - 220px); height: calc(100vh - 220px)"
			>
				<div v-if="!isLoading && algorithm === `FOLLOWING` && following.size === 0" class="relative">
					<img :src="require(`@/assets/images/brand/follow-window.webp`)" class="absolute top-0" />
				</div>
				<!-- content -->
				<article v-for="p in posts" :key="generateKey(p)">
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
			<article v-show="isLoading" class="flex justify-center h-screen pt-12 w-full">
				<div class="loader m-5"></div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IRepostResponse, IPostResponse } from '@/backend/post'
import { getReposts } from '@/backend/reposts'
import { RepostLink } from '@/store/index'

interface IData {
	posts: Array<IRepostResponse | IPostResponse>
	isLoading: boolean
	algorithm: Algorithm
	currentOffset: number
	limit: number
}

export default Vue.extend({
	components: {
		PostCard,
	},
	layout: `home`,
	props: {
		toggleFriend: {
			type: Function as PropType<(id: string) => void>,
			required: true,
		},
		following: {
			type: Set as PropType<Set<string>>,
			default: () => new Set<string>(),
		},
	},
	data(): IData {
		return {
			algorithm: `FOLLOWING`,
			posts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
		}
	},
	async created() {
		// Unauthenticated view
		if (this.$store.state.session.id === ``) {
			this.algorithm = `TOP`
			this.posts = await getPosts({}, `x`, {
				sort: this.algorithm,
				limit: this.limit,
				offset: this.currentOffset,
				following: undefined,
			})
			this.currentOffset += this.limit
			this.isLoading = false
			return
		}
		// Fetch posts if logged in
		this.posts = await getPosts({}, this.$store.state.session.id, {
			sort: this.algorithm,
			limit: this.limit,
			offset: this.currentOffset,
			following: this.$store.state.session.id,
		})
		// Fetch my reposts
		await this.getReposts(this.$store.state.session.id).then((res) => {
			if (res) {
				const repost: RepostLink[] = []
				res.forEach((r) => {
					const link: RepostLink = {
						postID: r.post._id,
						repostID: r.repost._id,
					}
					repost.push(link)
				})
				this.$store.commit(`setRepost`, repost)
			}
		})
		this.currentOffset += this.limit
		this.isLoading = false
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		getReposts,
		async sortFeed(a: Algorithm) {
			const container = this.$refs.container as HTMLElement
			container.addEventListener(`scroll`, this.handleScroll)
			this.posts = []
			this.currentOffset = 0
			this.isLoading = true
			this.algorithm = a
			this.posts = await getPosts({}, this.$store.state.session.id !== `` ? this.$store.state.session.id : `x`, {
				sort: a,
				limit: this.limit,
				offset: this.currentOffset,
				following: this.$store.state.session.id,
			})
			this.currentOffset += this.limit
			this.isLoading = false
			return this.posts
		},
		async loadPosts() {
			this.isLoading = true
			// unauthenticated
			if (this.$store.state.session.id === ``) {
				const res = await getPosts({}, `x`, {
					sort: this.algorithm,
					offset: this.currentOffset,
					limit: this.limit,
					following: undefined,
				})
				if (res.length === 0) {
					const container = this.$refs.container as HTMLElement
					container.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
				this.currentOffset += this.limit
				this.isLoading = false
				return
			}
			try {
				const res = await getPosts({}, this.$store.state.session.id, {
					sort: this.algorithm,
					offset: this.currentOffset,
					limit: this.limit,
					following: this.algorithm === `FOLLOWING` ? this.$store.state.session.id : undefined,
				})
				if (res.length === 0) {
					const container = this.$refs.container as HTMLElement
					container.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
				this.currentOffset += this.limit
				this.isLoading = false
			} catch (err) {
				this.$toastError(`error`)
			} finally {
				this.isLoading = false
			}
		},
		handleScroll(e: Event) {
			if (!this.isLoading) {
				const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
				if (scrollTop + clientHeight >= scrollHeight - 5) {
					this.loadPosts()
				}
			}
		},
		generateKey(p: IPostResponse | IRepostResponse) {
			let key: string = p.post._id
			// @ts-ignore
			if (p.repost) {
				// @ts-ignore
				key += p.repost._id
			}
			return key
		},
	},
})
</script>

<style>
.loader {
	border: 3px solid #eeeeee; /* Light grey */
	border-top: 3px solid #2e556a; /* Dark teal */
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
