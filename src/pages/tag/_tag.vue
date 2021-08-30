/* eslint-disable prefer-const */
<template>
	<section class="pt-4 px-4 w-full">
		<h2 class="text-2xl">Hashtags /</h2>
		<h2 class="text-2xl uppercase">#{{ this.$route.params.tag }}</h2>
		<div v-for="p in this.posts" :key="p.contentAddress">
			<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
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
