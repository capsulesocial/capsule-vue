<template>
	<main></main>
</template>

<script lang="ts">
import Vue from 'vue'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

export default Vue.extend({
	components: {},
	layout: `editor`,
	head() {
		return {
			title: `Write a post - Capsule Social`,
			meta: [
				{ hid: `editor`, name: `editor`, content: `Write a post on Capsule Social` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
})
</script>
