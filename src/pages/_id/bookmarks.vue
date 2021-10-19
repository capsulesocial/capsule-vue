<template>
	<section class="px-4">
		<article v-for="post in posts" :key="post">
			<PostCard :post="post" />
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Profile } from '@/backend/profile'
import { getBookmarks } from '@/backend/bookmarks'

interface IData {
	posts: []
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
		const bookmarkList: { authorID: string; postCID: string; timestamp: Date }[] = await getBookmarks({
			authorID: this.$route.params.id,
		})
		bookmarkList.forEach((p) => {
			console.log(p)
		})
	},
	methods: {
		getBookmarks,
	},
})
</script>
