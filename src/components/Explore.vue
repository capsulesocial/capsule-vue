<template>
	<aside>
		<div>
			<h3 class="p-2 text-2xl italic">Trending Tags</h3>
			<TagCard v-for="t in $store.state.tags" :key="t.tag" :tag="t.tag" />
		</div>
	</aside>
</template>

<script>
import TagCard from '@/components/Tag.vue'

export default {
	components: {
		TagCard,
	},
}
</script>
