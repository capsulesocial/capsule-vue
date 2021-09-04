<template>
	<section class="w-full">
		<div style="width: 512px" class="border-r">
			<article class="p-4">
				<h2 class="text-xl">Hashtags /</h2>
				<h2 class="text-2xl uppercase">#{{ this.$route.params.tag }}</h2>
			</article>
			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 512px">
				<div class="loader m-5"></div>
			</article>
			<!-- Posts loaded -->
			<article v-for="p in this.posts" :key="p.contentAddress" style="padding-left: 16px">
				<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'

interface IData {
	posts: []
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
		const res = await this.$axios.$get(`/content?tag=` + this.$route.params.tag)
		this.posts = res.data
		this.isLoading = false
	},
})
</script>
