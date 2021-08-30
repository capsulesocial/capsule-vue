<template>
	<section class="px-4">
		<article v-show="this.isLoading" class="flex justify-center">
			<div class="loader m-10"></div>
		</article>
		<article v-for="post in this.posts" :key="post.id">
			<PostCard :post="post" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '~/interfaces/Post'

export default Vue.extend({
	name: `IDIndexPage`,
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object,
			default: null,
		},
	},
	data() {
		const posts: Post[] = []
		return {
			posts,
			isLoading: true,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		const res = await this.$axios.$get(`/content?authorID=` + this.$route.params.id)
		this.posts = res.data
		this.isLoading = false

		// const postList = this.$props.profile.posts
		// Fetching posts from IPFS
		// for (const p in postList) {
		// 	if (p) {
		// 		const post = await this.$getPost(postList[p])
		// 		this.posts.push(post)
		// 	}
		// }
	},
})
</script>
