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
				{ hid: `og:title`, property: `og:title`, content: `Write a post on Blogchain` },
				{
					hid: `og:description`,
					property: `og:description`,
					content: `Write a post on Blogchain`,
				},
				{ hid: `og:site_name`, property: `og:site_name`, content: `Blogchain` },
				{ hid: `og:url`, property: `og:url`, content: `https://blogchain.app` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}${ogImage}` },
				{ hid: `twitter:image`, property: `twitter:image`, content: `${document.location.origin}${ogImage}` },
				{ hid: `twitter:site`, property: `twitter:site`, content: `@capsulesoc` },
				{ hid: `twitter:creator`, property: `twitter:creator`, content: `@capsulesoc` },
				{ hid: `twitter:card`, property: `twitter:card`, content: `summary` },
			],
		}
	},
})
</script>
