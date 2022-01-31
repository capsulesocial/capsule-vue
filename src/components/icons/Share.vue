<template>
	<span>
		<svg
			v-if="!isActive"
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-share-2"
		>
			<circle cx="18" cy="5" r="3"></circle>
			<circle cx="6" cy="12" r="3"></circle>
			<circle cx="18" cy="19" r="3"></circle>
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
		</svg>
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="22"
			height="22"
			viewBox="0 0 24 24"
			fill="#1E566C"
			stroke="#1E566C"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			class="feather feather-share-2"
		>
			<circle cx="18" cy="5" r="3"></circle>
			<circle cx="6" cy="12" r="3"></circle>
			<circle cx="18" cy="19" r="3"></circle>
			<line x1="8.59" y1="13.51" x2="15.42" y2="17.49"></line>
			<line x1="15.41" y1="6.51" x2="8.59" y2="10.49"></line>
		</svg>
	</span>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
	},
})
</script>
