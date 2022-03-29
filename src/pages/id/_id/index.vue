<template>
	<section class="w-full">
		<article v-if="posts.length == 0 && !isLoading" class="mt-24 grid justify-items-center px-10 xl:px-0">
			<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
				<span v-if="$route.params.id === $store.state.session.id">
					It seems you haven't written any posts yet, it's never too late to start:
				</span>
				<span v-else> {{ $route.params.id }} hasn't written any posts yet</span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Write a post`"
				:action="togglePostEditor"
			/>
			<img :src="require(`@/assets/images/brand/post.webp`)" class="top-0 mt-52 xl:-mt-2" />
		</article>
		<article v-for="p in posts" :key="p.post._id">
			<PostCard
				:post="p.post"
				:cid="p.post._id"
				:comments="p.comments"
				:bookmarked="p.bookmarked"
				:hideRepostIcon="algorithm === `NEW` || algorithm === `TOP`"
				:bookmarksCount="p.bookmarksCount"
				:repostCount="p.repostCount"
				:toggleFriend="toggleFriend"
				:userIsFollowed="userIsFollowed"
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
		<article v-show="isLoading" class="modal-animation flex justify-center">
			<div
				class="loader m-10 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
			></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'

interface IData {
	posts: IPostResponse[]
	isLoading: boolean
	currentOffset: number
	limit: number
	algorithm: Algorithm
	noMorePosts: boolean
	dark: boolean
}

export default Vue.extend({
	name: `IDIndexPage`,
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			required: true,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
		userIsFollowed: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
			noMorePosts: false,
			dark: false,
		}
	},
	watch: {
		async $route(n, o) {
			if (n.params.id !== o.params.id) {
				this.currentOffset = 0
				this.noMorePosts = false
				this.posts = []
				this.posts = await this.fetchPosts()
				const container = this.$parent.$refs.scrollContainer as HTMLElement
				container.addEventListener(`scroll`, this.handleScroll)
			}
		},
	},
	async created() {
		this.posts = await this.fetchPosts()
		this.dark = document.documentElement.classList.contains(`dark`)
	},
	mounted() {
		const container = this.$parent.$refs.scrollContainer as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		// Fetch posts from Orbit DB
		async fetchPosts() {
			this.isLoading = true
			const id = this.$store.state.session.id === `` ? `x` : this.$store.state.session.id
			const posts = await getPosts({ authorID: this.$route.params.id }, id, {
				sort: this.algorithm,
				offset: this.currentOffset,
				limit: this.limit,
				following: id === `x` ? undefined : this.$store.state.session.id,
			})
			if (posts.length === 0) {
				const container = this.$parent.$refs.scrollContainer as HTMLElement
				container.removeEventListener(`scroll`, this.handleScroll)
			}
			this.currentOffset += this.limit
			if (posts.length > 0 && this.currentOffset >= 10) {
				this.noMorePosts = true
			}
			this.isLoading = false
			return this.posts.concat(posts)
		},
		async handleScroll(e: Event) {
			if (!this.isLoading) {
				const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
				// Fetch posts when reaching the bottom of page
				if (scrollTop + clientHeight >= scrollHeight - 5) {
					this.posts = await this.fetchPosts()
				}
			}
		},
		togglePostEditor() {
			this.$router.push(`/post`)
		},
	},
})
</script>
