<template>
	<div class="popup w-full flex justify-center">
		<button @click="handleClose">Close</button>
		<!-- Primary widget -->
		<section class="bg-white rounded-lg">Configure your Capsule</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	methods: {
		handleClose() {
			this.$emit(`close`)
		},
	},
})
</script>