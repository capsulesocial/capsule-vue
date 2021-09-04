<template>
	<section class="w-full">
		<div style="width: 500px" class="border-r">
			<article class="p-4">
				<h4 class="text-xl">Category /</h4>
				<h2 class="text-2xl uppercase">
					{{ this.$route.params.category }}
				</h2>
			</article>
			<article v-for="post in this.posts" :key="post.title" style="padding-left: 10px">
				<PostCard :post="post" />
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '@/interfaces/Post'

interface IData {
	posts: Post[]
}

export default Vue.extend({
	components: {
		PostCard,
	},
	data(): IData {
		return {
			posts: [],
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		const res = await this.$axios.$get(`/content?category=` + this.$route.params.category)
		this.posts = res.data
	},
})
</script>
