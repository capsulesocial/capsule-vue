<template>
	<section>
		<nav class="flex w-full flex-row justify-between px-5 pt-3 text-sm xl:px-6 xl:pt-4 rounded-t-lg">
			<div class="flex" style="backdrop-filter: blur(10px)">
				<button
					:class="algorithm === `FOLLOWING` ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center focus:outline-none h-full w-full pb-4 pr-6"
					@click="sortFeed('FOLLOWING')"
				>
					Following
				</button>
				<button
					:class="algorithm === `NEW` ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center px-6 focus:outline-none h-full w-full pb-4"
					@click="sortFeed('NEW')"
				>
					New
				</button>
				<button
					:class="algorithm === `TOP` ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
					class="flex items-center focus:outline-none h-full w-full pb-4 pl-6"
					@click="sortFeed('TOP')"
				>
					Top
				</button>
			</div>
			<!-- Top algorithms -->
			<div v-if="algorithm === `TOP`" class="flex items-center relative modal-animation z-50">
				<label for="filter" class="hidden lg:block text-gray5 dark:text-gray3">Sort by: </label>
				<button
					id="filter"
					class="toggle focus:outline-none ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 px-4 text-sm shadow-lg dark:text-gray3"
					@click="showAlgorithmDropdown = !showAlgorithmDropdown"
				>
					<span class="toggle font-bold capitalize"> {{ topAlgorithm }} </span>
					<ChevronUp v-if="showAlgorithmDropdown" />
					<ChevronDown v-else />
				</button>
				<div
					v-if="showAlgorithmDropdown"
					class="hotzone border-lightBorder modal-animation absolute top-0 right-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg"
					style="margin-top: 28px"
				>
					<div
						v-for="a in [`All Time`, `Day`, `Week`, `Month`, `Year`]"
						:key="a"
						class="hotzone flex justify-start items-start flex-col dark:text-gray3"
					>
						<button
							:class="topAlgorithm === a ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
							class="hotzone focus:outline-none my-1 px-2"
							@click="setTopAlgorithm(a)"
						>
							{{ a }}
						</button>
					</div>
				</div>
			</div>
		</nav>
		<div v-if="posts" ref="container" class="min-h-120 h-120 lg:min-h-220 lg:h-220 w-full overflow-y-auto">
			<div
				v-if="!isLoading && algorithm === `FOLLOWING` && following.size === 0 && posts.length === 0"
				class="relative h-full overflow-y-hidden"
			>
				<div class="flex flex-col justify-center p-12">
					<h2 class="text-center text-2xl font-semibold dark:text-darkPrimaryText">Welcome 🚀</h2>
					<p class="text-gray5 dark:text-gray3 mb-5 mt-2 self-center text-center xl:mx-14">
						It seems like you don't follow anyone yet. You can visit the Top feed to follow top rated content creators
						and start your Blogchain experience!
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
					:commentsCount="p.commentsCount"
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
			<p
				v-if="noMorePosts"
				class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
				style="backdrop-filter: blur(10px)"
			>
				No more posts
			</p>
			<!-- Not loaded yet -->
			<article v-show="isLoading" class="modal-animation flex h-screen w-full justify-center pt-12">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="`border-top: 2px solid` + $color.hex"
				></div>
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapGetters } from 'vuex'
import PostCard from '@/components/post/Card.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { namespace as SubscriptionsNamespace } from '@/store/subscriptions'
import { getPosts, Algorithm, IRepostResponse, IPostResponse } from '@/backend/post'
import { getReposts } from '@/backend/reposts'
import { followChange } from '@/backend/following'

interface IData {
	posts: Array<IRepostResponse | IPostResponse>
	isLoading: boolean
	algorithm: Algorithm
	currentOffset: number
	limit: number
	noMorePosts: boolean
	topAlgorithm: `All Time` | `Day` | `Week` | `Month` | `Year`
	showAlgorithmDropdown: boolean
}

export default Vue.extend({
	components: {
		PostCard,
		ChevronUp,
		ChevronDown,
	},
	layout: `home`,
	props: {
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
			topAlgorithm: `All Time`,
			showAlgorithmDropdown: false,
		}
	},
	head() {
		return {
			title: `Home - Blogchain`,
			meta: [
				{
					hid: `home`,
					name: `home`,
					content: `Home - Blogchain`,
				},
			],
		}
	},
	computed: {
		...mapGetters(SubscriptionsNamespace, [`activeSubs`]),
		paymentsEnabled() {
			return this.$store.getters[`paymentProfile/getPaymentProfile`](this.$route.params.id).paymentsEnabled
		},
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
			const payload = this.getTopPayload(alg, followingParam)
			const posts = await getPosts({}, id, payload)
			this.currentOffset += this.limit
			this.isLoading = false
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
			this.noMorePosts = false
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
			// When no more posts
			if (res.length === 0) {
				const container = this.$refs.container as HTMLElement
				container.removeEventListener(`scroll`, this.handleScroll)
				this.noMorePosts = true
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
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				try {
					await followChange(
						this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						authorID,
					)
					this.$emit(`updateFollowers`)
					this.$toastSuccess(this.following.has(authorID) ? `Followed ${authorID}` : `Unfollowed ${authorID}`)
				} catch (err: unknown) {
					this.$handleError(err)
				}
			}
		},
		setTopAlgorithm(a: `All Time` | `Day` | `Week` | `Month` | `Year`) {
			this.topAlgorithm = a
			this.showAlgorithmDropdown = false
			this.sortFeed(this.algorithm)
		},
		getTopPayload(alg: Algorithm, followingParam: string | undefined) {
			if (alg !== `TOP`) {
				return {
					sort: alg,
					limit: this.limit,
					offset: this.currentOffset,
					following: followingParam,
				}
			}
			let timeframe: undefined | `1` | `7` | `30` | `365` = `1`
			switch (this.topAlgorithm) {
				case `All Time`:
					break
				case `Day`:
					timeframe = `1`
					break
				case `Week`:
					timeframe = `7`
					break
				case `Month`:
					timeframe = `30`
					break
				case `Year`:
					timeframe = `365`
					break
				default:
					timeframe = undefined
			}
			return {
				sort: alg,
				limit: this.limit,
				offset: this.currentOffset,
				timeframe,
				following: followingParam,
			}
		},
	},
})
</script>
