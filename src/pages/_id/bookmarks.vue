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
import { Post } from '@/interfaces/Post'
import { Profile } from '@/interfaces/Profile'
import ipfs from '@/backend/ipfs'

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
		const postList = this.$props.profile.bookmarks
		for (const p in postList) {
			if (p) {
				const post = await ipfs().getPost(postList[p])
				this.posts.push(post)
			}
		}
	},
})
</script>
