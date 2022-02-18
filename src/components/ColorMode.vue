<template>
	<div class="text-3xl">
		<button class="focus:outline-none" @click="changeDarkMode(`light`)">light</button>
		<button class="focus:outline-none" @click="changeDarkMode(`dark`)">dark</button>
		<button class="focus:outline-none" @click="changeDarkMode(`OS`)">OS</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	methods: {
		changeDarkMode(type: string): void {
			this.$store.commit(`settings/changeDarkMode`, type)
		},
	},
})
</script>
