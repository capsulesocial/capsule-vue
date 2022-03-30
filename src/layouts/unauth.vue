<template>
	<main
		class="bg-img-unauth m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.webp`)})` }"
	>
		<Nuxt />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	middleware: `auth`,
	created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
	},
})
</script>
