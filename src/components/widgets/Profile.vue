<template>
	<article class="w-full rounded-lg shadow-lg bg-white mb-5 p-4">
		<h6 class="font-semibold text-primary mb-2">About</h6>
		<div class="flex flex-row items-center"><PinIcon class="w-4 h-4 mr-2" /> {{ location }}</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PinIcon from '@/components/icons/Pin.vue'

export default Vue.extend({
	components: {
		PinIcon,
	},
	props: {
		location: {
			type: String,
			default: `not set`,
		},
	},
})
</script>