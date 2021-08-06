<template>
	<section class="px-4">
		<div v-for="p in this.posts" :key="p.id">
			<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '~/interfaces/Post'

export default Vue.extend({
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
	async created() {
		const postList = this.$props.profile.reposts
		for (const p in postList) {
			if (p) {
				const post = await this.$getPost(postList[p])
				this.posts.push(post)
			}
		}
	},
})
</script>
