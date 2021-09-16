<template>
	<section class="w-full">
		<article v-show="isLoading" class="flex justify-center">
			<div class="loader m-10"></div>
		</article>
		<article v-for="post in posts" :key="post.post._id">
			<PostCard :post="post.post" :profile="profile" :comments="post.comments" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getPosts, IPostResponse } from '@/backend/post'

interface IData {
	posts: IPostResponse[]
	isLoading: boolean
}

export default Vue.extend({
	name: `IDIndexPage`,
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			required: true,
		},
	},
	data(): IData {
		return {
			posts: [],
			isLoading: true,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ authorID: this.$route.params.id }, `NEW`)
		this.isLoading = false

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
