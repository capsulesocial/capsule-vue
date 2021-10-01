<template>
	<section class="w-full">
		<article v-for="post in posts" :key="post.post._id">
			<PostCard :post="post.post" :profile="profile" :comments="post.comments" />
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
	repostList: string[]
	myRepostList: string[]
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
			repostList: [],
			myRepostList: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	async created() {
		window.addEventListener(`scroll`, this.handleScroll)
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts(
			{ authorID: this.$route.params.id },
			this.algorithm,
			this.currentOffset,
			this.limit,
			undefined,
			`false`,
		)
		this.currentOffset += this.limit
		this.isLoading = false
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async loadPosts() {
			this.isLoading = true
			try {
				const res = await getPosts(
					{ authorID: this.$route.params.id },
					this.algorithm,
					this.currentOffset,
					this.limit,
					undefined,
					`false`,
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
