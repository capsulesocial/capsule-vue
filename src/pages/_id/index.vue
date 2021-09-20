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
		window.addEventListener(`scroll`, this.handleScroll)
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ authorID: this.$route.params.id }, `NEW`)
		this.isLoading = false
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async loadPosts(offset: number, limit: number) {
			this.isLoading = true
			try {
				const res = await getPosts({}, this.algorithm, this.currentOffset, this.limit, this.$store.state.session.id)
				// eslint-disable-next-line
				console.log(this.algorithm, offset, limit)
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
				window.removeEventListener(`scroll`, this.handleScroll)
				await this.loadPosts(this.currentOffset, this.limit)
				this.currentOffset += this.limit
				window.addEventListener(`scroll`, this.handleScroll)
			}
		},
	},
})
</script>
