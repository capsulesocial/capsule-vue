<template>
	<section class="w-full">
		<article v-show="this.isLoading" class="flex justify-center">
			<div class="loader m-10"></div>
		</article>
		<article v-for="post in this.posts" :key="post._id">
			<PostCard :post="post" :cid="post._id" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getPosts, Post } from '@/backend/post'

interface IData {
	posts: Post[]
	isLoading: boolean
}

export default Vue.extend({
	name: `IDIndexPage`,
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
			isLoading: true,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ authorID: this.$route.params.id })
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
