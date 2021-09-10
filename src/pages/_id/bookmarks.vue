<template>
	<section class="px-4">
		<article v-for="post in this.posts" :key="post._id">
			<PostCard :post="post" :cid="post._id" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPost, Post, RetrievedPost } from '@/backend/post'
import { Profile } from '@/backend/profile'

interface IData {
	posts: Post[]
}

export default Vue.extend({
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as () => Profile,
			default: null,
		},
	},
	data(): IData {
		return {
			posts: [],
		}
	},
	async created() {
		const postList: RetrievedPost[] = [] // TODO: Here we need to implement that
		for (const p of postList) {
			const post = await getPost(p._id)
			this.posts.push(post)
		}
	},
})
</script>
