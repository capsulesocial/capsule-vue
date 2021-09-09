<template>
	<section class="w-full border-l border-r">
		<div style="width: 600px">
			<!-- Header -->
			<img
				:src="require(`@/assets/images/category/` + this.$route.params.category + `/` + `header.png`)"
				alt=""
				class="object-cover shadow-lg"
				style="width: 598px; height: 192px"
			/>
			<div style="padding-left: 22px; margin-top: 22px">
				<h2 class="text-2xl font-medium">Category /</h2>
				<h2 class="text-2xl capitalize font-medium">
					{{ this.$route.params.category }}
				</h2>
			</div>

			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>
			<!-- Posts loaded -->
			<article v-for="post in this.posts" :key="post.title" style="padding-left: 22px">
				<PostCard :post="post" :cid="post._id" />
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Post } from '@/backend/post'

interface IData {
	posts: Post[]
	isLoading: boolean
}

export default Vue.extend({
	components: {
		PostCard,
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ category: this.$route.params.category })
		this.isLoading = false
	},
})
</script>
