<template>
	<section class="flex flex-col min-h-screen max-w-760 relative">
		<!-- Tag page header -->
		<div
			class="fixed z-20 max-w-760 lg:w-760 -m-6 w-full border-lightBorder bg-darkBG flex flex-row items-center rounded-lg bg-opacity-25 p-2 shadow-lg"
			style="backdrop-filter: blur(10px); pointer-events: none"
		>
			<button
				class="bg-gray1 focus:outline-none m-3 flex-shrink-0 rounded-full"
				style="pointer-events: all"
				@click="handleBack"
			>
				<BackIcon />
			</button>
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">{{ $route.params.tag }}</h2>
		</div>
		<!-- Posts loaded -->
		<div ref="container" class="w-full" style="margin-top: 64px">
			<article
				v-if="posts.length == 0 && !isLoading"
				class="mt-10 grid justify-items-center overflow-y-hidden px-6 xl:px-0"
			>
				<p class="text-gray5 dark:text-gray3 align-end mb-5 flex items-end text-sm" style="max-width: 366px">
					It seems there are no posts under this topic yet
				</p>
				<SecondaryButton :text="`Back home`" :action="toggleHomeFeed" />
				<img :src="require(`@/assets/images/brand/tag.webp`)" class="top-0 mt-64 xl:mt-10" />
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
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid` + $color.hex"
			></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import BackIcon from '@/components/icons/ChevronLeft.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'

interface IData {
	posts: IPostResponse[]
	tag: string
	isLoading: boolean
	currentOffset: number
	limit: number
	algorithm: Algorithm
	noMorePosts: boolean
	fromExternalSite: boolean
}

export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
		BackIcon,
	},
	beforeRouteEnter(to, from, next) {
		next((vm: any) => {
			if (to && from.name === null) {
				vm.fromExternalSite = true
			}
		})
		return true
	},
	layout: `discover`,
	props: {
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
		following: {
			type: Set as PropType<Set<string>>,
			default: () => new Set(),
		},
	},
	data(): IData {
		return {
			posts: [],
			tag: this.$route.params.tag,
			isLoading: false,
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
			noMorePosts: false,
			fromExternalSite: false,
		}
	},
	head() {
		return {
			title: `${this.$route.params.tag} posts on Blogchain`,
			meta: [{ hid: `tags`, name: `tags`, content: `View posts with tag: ${this.$route.params.tag}` }],
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.tag !== o.params.tag) {
				this.currentOffset = 0
				this.noMorePosts = false
				this.isLoading = false
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
	},
	methods: {
		async fetchPosts(): Promise<any> {
			if (this.isLoading || this.noMorePosts) {
				return new Promise(() => null)
			}
			this.isLoading = true
			const id = this.$store.state.session.id === `` ? `x` : this.$store.state.session.id
			const posts = await getPosts({ tag: this.$route.params.tag }, id, {
				sort: this.algorithm,
				offset: this.currentOffset,
				limit: this.limit,
			})
			this.posts = this.posts.concat(posts)
			this.currentOffset += this.limit
			if (posts.length < this.limit) {
				this.noMorePosts = true
			}
			this.isLoading = false
			return this.posts
		},
		toggleHomeFeed() {
			this.$router.push(`/home`)
		},
		handleBack() {
			if (this.fromExternalSite) {
				this.$router.push({ name: `home` })
				return
			}
			this.$router.go(-1)
		},
	},
})
</script>
