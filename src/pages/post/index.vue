<template>
	<main></main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	components: {},
	layout: `editor`,
	head() {
		return {
			title: `Write a post - Blogchain`,
			meta: [{ hid: `editor`, name: `editor`, content: `Write a post on Blogchain` }],
		}
	},
})
</script>
