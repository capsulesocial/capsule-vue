<template>
	<div class="border-lightBorder border">
		<section>
			<nav class="z-20 flex w-full flex-row px-5 pt-3 text-base xl:px-6 xl:pt-4" style="backdrop-filter: blur(10px)">
				<div class="flex items-center">
					<button
						:class="algorithm === `FOLLOWING` ? ` text-primary border-primary border-b-2 font-semibold` : `text-gray5`"
						class="focus:outline-none h-full w-full pb-3"
						@click="sortFeed('FOLLOWING')"
					>
						Following
					</button>
				</div>
				<div class="flex items-center px-12">
					<button
						:class="algorithm === `NEW` ? `text-primary border-primary border-b-2 font-semibold` : `text-gray5`"
						class="focus:outline-none h-full w-full pb-3"
						@click="sortFeed('NEW')"
					>
						New
					</button>
				</div>
				<div class="flex items-center">
					<button
						:class="algorithm === `TOP` ? ` text-primary border-primary border-b-2 font-semibold` : `text-gray5`"
						class="focus:outline-none h-full w-full pb-3"
						@click="sortFeed('TOP')"
					>
						Top
					</button>
				</div>
			</nav>
			<div
				v-if="posts"
				ref="container"
				class="xl:w-748 min-h-180 h-180 xl:min-h-220 xl:h-220 modal-animation fixed w-full overflow-y-auto"
			>
				<div
					v-if="!isLoading && algorithm === `FOLLOWING` && following.size === 0 && posts.length === 0"
					class="relative h-full overflow-y-hidden"
				>
					<div class="flex flex-col justify-center p-12">
						<h2 class="text-center text-2xl font-semibold">Welcome 🚀</h2>
						<p class="text-gray7 mb-5 mt-2 self-center text-center xl:mx-14">
							It seems that you don't follow anyone yet. You can go to the Top feed to follow top rated content creator
							and start your Capsule experience
						</p>
						<div class="flex justify-center">
							<BrandedButton
								:action="
									() => {
										this.sortFeed('TOP')
									}
								"
								:text="`Top posts`"
							/>
						</div>
					</div>
					<img :src="require(`@/assets/images/brand/follow-window.webp`)" class="top-0 mt-24 xl:mt-0" />
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
						:isDeleted="p.deleted"
						@updateBookmarks="updateBookmarks"
					/>
				</article>
				<p v-if="noMorePosts" class="text-gray5 py-5 text-center text-sm" style="backdrop-filter: blur(10px)">
					No more posts
				</p>
			</div>
			<!-- Not loaded yet -->
			<article v-show="isLoading" class="modal-animation flex h-screen w-full justify-center pt-12">
				<div class="loader m-5"></div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IRepostResponse, IPostResponse } from '@/backend/post'
import { getReposts } from '@/backend/reposts'

interface IData {
	posts: Array<IRepostResponse | IPostResponse>
	isLoading: boolean
	algorithm: Algorithm
	currentOffset: number
	limit: number
	noMorePosts: boolean
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
			algorithm: this.$store.state.session.id === `` ? `TOP` : `FOLLOWING`,
			posts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			noMorePosts: false,
		}
	},
	head() {
		return {
			title: `Home - Capsule Social`,
			meta: [
				{
					hid: `home`,
					name: `home`,
					content: `Home - Capsule Social`,
				},
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	async created() {
		// Unauthenticated view
		this.posts = await this.fetchPosts(this.algorithm)
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		getReposts,
		async fetchPosts(alg: Algorithm) {
			this.isLoading = true
			const id = this.$store.state.session.id === `` ? `x` : this.$store.state.session.id
			const followingParam: string | undefined = id === `x` ? undefined : this.$store.state.session.id
			const payload = {
				sort: alg,
				limit: this.limit,
				offset: this.currentOffset,
				following: followingParam,
			}
			const posts = await getPosts({}, id, payload)
			this.currentOffset += this.limit
			if (posts.length === 0) {
				this.noMorePosts = true
			}
			this.isLoading = false
			// Remove deleted reposts
			if (alg === `FOLLOWING`) {
				posts.forEach((post: IRepostResponse | any) => {
					if (post.deleted) {
						posts.splice(posts.indexOf(post), 1)
					}
				})
			}
			// End of unauth functions
			if (id === `x`) {
				return posts
			}
			// Only get reposts if logged in
			posts.forEach((post) => {
				if (post.reposted) {
					this.$store.commit(`addRepost`, { postID: post.post._id, repostID: post.reposted })
				}
			})
			return posts
		},
		async sortFeed(a: Algorithm) {
			// Unauth
			if (this.$store.state.session.id === `` && a === `FOLLOWING`) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return this.posts
			}
			const container = this.$refs.container as HTMLElement
			container.addEventListener(`scroll`, this.handleScroll)
			this.posts = []
			this.currentOffset = 0
			this.isLoading = true
			this.algorithm = a
			this.posts = await this.fetchPosts(a)
			return this.posts
		},
		async loadPosts() {
			const res = await this.fetchPosts(this.algorithm)
			this.posts = this.posts.concat(res)
			if (res.length === 0) {
				const container = this.$refs.container as HTMLElement
				container.removeEventListener(`scroll`, this.handleScroll)
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
			if (`repost` in p) {
				key += p.repost._id
			}
			return key
		},
		updateBookmarks(): void {
			this.$emit(`updateBookmarks`)
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
