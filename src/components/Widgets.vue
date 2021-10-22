<template>
	<div>
		<!-- Discover page -->
		<TagWidget />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import TagWidget from '@/components/widgets/Tags.vue'

export default Vue.extend({
	components: {
		TagWidget,
	},
})
</script>