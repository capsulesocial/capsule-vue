<template>
	<div>
		<svg
			v-if="reduceSize"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-chevron-left"
		>
			<polyline points="15 18 9 12 15 6"></polyline>
		</svg>
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-chevron-left"
		>
			<polyline points="15 18 9 12 15 6"></polyline>
		</svg>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		reduceSize: {
			type: Boolean,
			default: false,
		},
	},
})
</script>