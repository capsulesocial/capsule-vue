<template>
	<main
		ref="main"
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.webp`)})` }"
	>
		<Nuxt />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { disableBodyScroll } from 'body-scroll-lock'

export default Vue.extend({
	created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
	},
	mounted() {
		// Lock background
		const mainOverlay = this.$refs.main as HTMLElement
		disableBodyScroll(mainOverlay)
	},
})
</script>
