<template>
	<main></main>
</template>

<script lang="ts">
import Vue from 'vue'
import ogImage from '@/assets/images/util/ogImage.png'

export default Vue.extend({
	components: {},
	layout: `editor`,
	head() {
		return {
			title: `Write a post - Blogchain`,
			meta: [
				{ hid: `editor`, name: `editor`, content: `Write a post on Blogchain` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
})
</script>
