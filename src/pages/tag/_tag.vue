<template>
	<section class="w-full">
		<div style="width: 500px" class="border-r">
			<article class="p-4">
				<h2 class="text-xl">Hashtags /</h2>
				<h2 class="text-2xl uppercase">#{{ this.$route.params.tag }}</h2>
			</article>
			<article v-for="p in this.posts" :key="p.contentAddress" style="padding-left: 10px">
				<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
			</article>
		</div>
	</section>
</template>

<script>
import Vue from 'vue'

import PostCard from '@/components/post/Card.vue'
export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
	},
	data() {
		return {
			posts: [],
			tag: this.$route.params.tag,
		}
	},
	async created() {
		// Fetch posts with tag
		const res = await this.$axios.$get(`/content?tag=` + this.$route.params.tag)
		this.posts = res.data
	},
})
</script>
