<template>
	<section class="px-4">
		<div v-for="p in this.posts" :key="p._id">
			<PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" :cid="p._id" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '@/backend/post'
import { Profile } from '@/backend/profile'
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
		const postList = this.$props.profile.reposts
		for (const p in postList) {
			if (p) {
				const post = await ipfs().getPost(postList[p])
				this.posts.push(post)
			}
		}
	},
})
</script>
