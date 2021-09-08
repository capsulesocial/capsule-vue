<template>
	<section class="w-full border-l border-r">
		<div style="width: 600px">
			<!-- Header -->
			<img
				:src="
					require(`@/assets/images/category/` +
						this.$route.params.category +
						`/` +
						this.$route.params.category +
						`.jpg`)
				"
				alt=""
				class="h-64 object-cover w-full"
			/>
			<h2
				class="text-2xl font-bold text-white capitalize z-20 top-0 -mt-12 ml-12"
				style="text-shadow: 2px 2px 4px #000000"
			>
				{{ this.$route.params.category }}
			</h2>

			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>
			<!-- Posts loaded -->
			<article v-for="post in this.posts" :key="post.title" style="padding-left: 11px">
				<PostCard :post="post" :cid="post._id" />
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
		const res = await this.$axios.$get(`/content?category=` + this.$route.params.category)
		this.posts = res.data
		this.isLoading = false
	},
})
</script>
