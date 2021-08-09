<template>
	<section class="px-4">
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
		}
	},
	created() {
		// Fetch posts from Orbit DB by ID
		this.$axios.$get(`/content?authorID=` + this.$route.params.id).then((res) => {
			console.log(res)
			this.posts = res.data
		})

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
