<template>
	<div class="fixed h-screen px-5">
		<h2 class="text-xl text-primary py-2 font-semibold">
			<nuxt-link to="/discover">Trending Tags</nuxt-link>
		</h2>
		<div class="flex flex-row flex-wrap" style="width: 240px">
			<Tag v-for="t in this.tags" :key="t" :tag="t" class="my-1 mr-1 overflow-x-auto" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Tag from '@/components/Tag.vue'
import { getTags } from '@/backend/post'

interface IData {
	tags: string[]
}

export default Vue.extend({
	components: {
		Tag,
	},
	data(): IData {
		return {
			tags: [],
		}
	},
	async created() {
		const content = await getTags()
		this.tags = content.slice(0, 14)
	},
})
</script>
