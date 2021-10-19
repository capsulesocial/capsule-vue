<template>
	<section class="px-4">
		<article v-for="p in posts" :key="p.post._id">
			<PostCard :post="p.post" :bookmarked="p.bookmarked" />
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
			this.posts.push(p)
		})
	},
	methods: {
		getPosts,
	},
})
</script>
