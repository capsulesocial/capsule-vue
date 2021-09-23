<template>
	<section class="px-4">
		<div v-for="p in posts" :key="p._id">
			<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" :cid="p._id" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPost, RetrievedPost } from '@/backend/post'
import { Profile } from '@/backend/profile'

interface IData {
	posts: RetrievedPost[]
}

export default Vue.extend({
	components: {
		PostCard,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {
			posts: [],
		}
	},
	async created() {
		const postList: string[] = []
		for (const p in postList) {
			if (p) {
				const post = await getPost(postList[p])
				this.posts.push({ ...post, _id: postList[p], excerpt: `` })
			}
		}
	},
})
</script>
