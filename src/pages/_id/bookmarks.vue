<template>
	<section class="px-4">
		<article v-for="post in posts" :key="post._id">
			<PostCard :post="post" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getPosts } from '@/backend/post'

interface IData {
	posts: {
		authorID: string
		category: string
		excerpt: string
		tags: any
		timestamp: number
		_id: string
	}[]
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
		const bookmarkList = await getPosts({ bookmarkedBy: this.$route.params.id }, this.$store.state.session.id)
		bookmarkList.forEach((p) => {
			this.posts.push(p.post)
		})
	},
	methods: {
		getPosts,
	},
})
</script>
