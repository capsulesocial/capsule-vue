<template>
	<article class="w-full rounded-lg shadow-lg bg-white mb-5 p-4">
		<h6 class="font-semibold text-primary mb-2">About</h6>
		{{ location }}
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		location: {
			type: String,
			default: `not set`,
		},
	},
})
</script>