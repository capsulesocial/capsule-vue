<template>
	<section class="w-full">
		<article v-if="posts.length == 0" class="grid justify-items-center mt-32">
			<p class="text-sm text-gray5 mb-5">It seems you didn't wrote any posts yet, it's not too late to start:</p>
			<SecondaryButton
				v-if="$store.state.session.id === $route.params.id"
				:text="`Write a post`"
				:action="togglePostEditor"
			/>
		</article>
		<article v-for="post in posts" :key="post.post._id">
			<PostCard
				:post="post.post"
				:profile="profile"
				:comments="post.comments"
				:bookmarked="post.bookmarked"
				:repostCount="post.repostCount"
				:bookmarksCount="post.bookmarksCount"
			/>
		</article>
		<article v-show="isLoading" class="flex justify-center">
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
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ authorID: this.$route.params.id }, this.$store.state.session.id, {
			sort: this.algorithm,
			limit: this.limit,
			offset: this.currentOffset,
			following: this.$store.state.session.id,
			reposts: false,
		})
		this.currentOffset += this.limit
		this.isLoading = false
		window.addEventListener(`scroll`, this.handleScroll)
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async loadPosts() {
			this.isLoading = true
			try {
				const res = await getPosts({ authorID: this.$route.params.id }, this.$store.state.session.id, {
					sort: this.algorithm,
					limit: this.limit,
					offset: this.currentOffset,
					reposts: false,
				})
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
				this.currentOffset += this.limit
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
			}
		},
		togglePostEditor() {
			this.$router.push(`/post`)
		},
	},
})
</script>
