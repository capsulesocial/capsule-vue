<template>
	<section class="w-full">
		<article v-if="posts.length == 0" class="grid justify-items-center mt-32">
			<p class="text-sm text-gray5 mb-5">
				<span v-if="$route.params.id === $store.state.session.id">
					It seems you haven't written any posts yet, it's never too late to start:
				</span>
				<span v-else> {{ $route.params.id }} hasn't written any posts yet :( </span>
			</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Write a post`"
				:action="togglePostEditor"
			/>
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
			/>
		</article>
		<article v-show="isLoading" class="flex justify-center modal-animation">
			<div class="loader m-10"></div>
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
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	created() {
		this.loadPosts()
	},
	mounted() {
		const container = this.$parent.$refs.scrollContainer as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		// Fetch posts from Orbit DB by ID
		async loadPosts() {
			this.isLoading = true
			// Unauthenticated
			if (this.$store.state.session.id === ``) {
				try {
					const res = await getPosts({ authorID: this.$route.params.id }, `x`, {
						sort: this.algorithm,
						offset: this.currentOffset,
						limit: this.limit,
						following: this.$store.state.session.id,
					})
					if (res.length === 0) {
						const container = this.$parent.$refs.scrollContainer as HTMLElement
						container.removeEventListener(`scroll`, this.handleScroll)
					}
					this.posts = this.posts.concat(res)
					this.currentOffset += this.limit
					this.isLoading = false
				} catch (err) {
					// TODO
				} finally {
					this.isLoading = false
				}

				return
			}
			// Authenticated
			try {
				const res = await getPosts({ authorID: this.$route.params.id }, this.$store.state.session.id, {
					sort: this.algorithm,
					offset: this.currentOffset,
					limit: this.limit,
					following: this.$store.state.session.id,
				})
				if (res.length < this.limit) {
					const container = this.$parent.$refs.scrollContainer as HTMLElement
					container.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
				this.currentOffset += this.limit
				this.isLoading = false
			} catch (err) {
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll(e: Event) {
			if (!this.isLoading) {
				const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
				// Fetch posts when reaching the bottom of page
				if (scrollTop + clientHeight >= scrollHeight - 5) {
					await this.loadPosts()
				}
			}
		},
		togglePostEditor() {
			this.$router.push(`/post`)
		},
	},
})
</script>
