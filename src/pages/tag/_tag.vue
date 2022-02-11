<template>
	<section class="border-lightBorder w-full border">
		<!-- Tag page header -->
		<div
			class="border-lightBorder bg-primary flex flex-row items-center rounded-lg bg-opacity-25 p-2 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<button class="bg-gray1 focus:outline-none m-3 flex-shrink-0 rounded-full" @click="$router.go(-1)">
				<BackIcon />
			</button>
			<h2 class="text-primary dark:text-secondary text-2xl font-semibold">{{ $route.params.tag }}</h2>
		</div>
		<!-- Posts loaded -->
		<div ref="container" class="xl:w-750 min-h-130 h-130 xl:min-h-150 xl:h-150 fixed w-full overflow-y-auto">
			<article
				v-if="posts.length == 0 && !isLoading"
				class="mt-36 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
			>
				<p class="text-gray5 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
					It seems there are no posts under this topic yet
				</p>
				<SecondaryButton :text="`Back home`" :action="toggleHomeFeed" />
				<img :src="require(`@/assets/images/brand/Bookmarks.webp`)" class="top-0 mt-64 xl:-mt-2" />
			</article>
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
					:isDeleted="p.deleted"
				/>
			</article>
			<p
				v-if="noMorePosts"
				class="text-gray5 dark:text-gray3 py-5 text-center text-sm"
				style="backdrop-filter: blur(10px)"
			>
				No more posts
			</p>
		</div>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="flex w-full justify-center mt-12">
			<div class="loader modal-animation m-6"></div>
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
	tag: string
	isLoading: boolean
	following: Set<string>
	currentOffset: number
	limit: number
	algorithm: Algorithm
	noMorePosts: boolean
}

export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
		BackIcon,
	},
	layout: `discover`,
	data(): IData {
		return {
			posts: [],
			tag: this.$route.params.tag,
			isLoading: true,
			following: new Set(),
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
			noMorePosts: false,
		}
	},
	head() {
		return {
			title: `${this.$route.params.tag} posts on Capsule Social`,
			meta: [{ hid: `tags`, name: `tags`, content: `View posts with tag: ${this.$route.params.tag}` }],
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.tag !== o.params.tag) {
				const container = this.$refs.container as HTMLElement
				container.addEventListener(`scroll`, this.handleScroll)
				this.currentOffset = 0
				this.noMorePosts = false
				this.isLoading = true
				this.posts = []
				this.fetchPosts().then((posts) => {
					this.posts = posts
				})
			}
		},
	},
	async created() {
		// Fetch posts with tag (unauthenticated)
		this.posts = await this.fetchPosts()
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async fetchPosts() {
			this.isLoading = true
			const id = this.$store.state.session.id === `` ? `x` : this.$store.state.session.id
			const posts = await getPosts({ tag: this.$route.params.tag }, id, {
				sort: this.algorithm,
				offset: this.currentOffset,
				limit: this.limit,
			})
			this.currentOffset += this.limit
			if (posts.length === 0) {
				const container = this.$refs.container as HTMLElement
				container.removeEventListener(`scroll`, this.handleScroll)
			}
			if (posts.length < this.limit && posts.length > 0) {
				this.noMorePosts = true
			}
			this.isLoading = false
			return this.posts.concat(posts)
		},
		async handleScroll(e: Event) {
			if (this.isLoading) {
				return
			}
			const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				this.posts = await this.fetchPosts()
			}
		},
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
	},
})
</script>
