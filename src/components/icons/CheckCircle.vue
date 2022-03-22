<template>
	<div>
		<!-- Check circle (selected) -->
		<svg
			v-if="isChecked"
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			viewBox="0 0 512 512"
		>
			<path
				d="M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zM227.314 387.314l184-184c6.248-6.248 6.248-16.379 0-22.627l-22.627-22.627c-6.248-6.249-16.379-6.249-22.628 0L216 308.118l-70.059-70.059c-6.248-6.248-16.379-6.248-22.628 0l-22.627 22.627c-6.248 6.248-6.248 16.379 0 22.627l104 104c6.249 6.249 16.379 6.249 22.628.001z"
			/>
		</svg>
		<!-- Circle -->
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			fill="currentColor"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
			viewBox="0 0 512 512"
		>
			<path
				d="M256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z"
			/>
		</svg>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	props: {
		isChecked: {
			type: Boolean,
			required: true,
		},
	},
})
</script>
