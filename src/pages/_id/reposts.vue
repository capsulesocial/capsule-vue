<template>
	<section class="px-4">
		<div v-for="p in this.reposts" :key="p._id">
			<PostCard
				:post="p"
				:authorID="p.authorID"
				:authorUsername="p.authorID"
				:cid="p._id"
				:repostedBy="$route.params.id"
			/>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getReposts } from '@/backend/reposts'
import { Profile } from '@/backend/profile'

interface IData {
	reposts: []
	isLoading: boolean
	currentOffset: number
	limit: number
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
			reposts: [],
			isLoading: true,
			currentOffset: 0,
			limit: 10,
		}
	},
	async created() {
		const res = await getReposts(this.$route.params.id)
		for (const i in res) {
			if (res[i]) {
				// @ts-ignore
				this.reposts.push(res[i].post)
			}
		}
		this.reposts.reverse()
	},
	methods: {
		getReposts,
	},
	methods: {
		getReposts,
	},
})
</script>
