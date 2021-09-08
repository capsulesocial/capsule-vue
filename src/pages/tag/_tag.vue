<template>
	<section class="w-full">
		<div style="width: 600px" class="border-r">
			<article class="p-4">
				<h2 class="text-xl">Hashtags /</h2>
				<h2 class="text-2xl uppercase">#{{ this.$route.params.tag }}</h2>
			</article>
			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>
			<!-- Posts loaded -->
			<article v-for="p in this.posts" :key="p._id" style="padding-left: 16px">
				<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" :cid="p._id" />
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts } from '@/backend/post'
import { Post } from '@/interfaces/Post'

interface IData {
	posts: Post[]
	tag: string
	isLoading: boolean
}

export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
	},
	data(): IData {
		return {
			posts: [],
			tag: this.$route.params.tag,
			isLoading: true,
		}
	},
	async created() {
		// Fetch posts with tag
		this.posts = await getPosts({ tag: this.$route.params.tag })
		this.isLoading = false
	},
})
</script>
