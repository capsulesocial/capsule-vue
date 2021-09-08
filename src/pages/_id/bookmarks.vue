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
import { getPost, Post } from '@/backend/post'
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
		const postList = this.$props.profile.bookmarks
		for (const p in postList) {
			if (p) {
				const post = await getPost(postList[p])
				this.posts.push(post)
			}
		}
	},
})
</script>
