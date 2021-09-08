<template>
	<main :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'" class="h-screen">
		<Header class="fixed top-0" />

		<div class="flex justify-center min-h-full">
			<!-- Left Nav Menu -->
			<Navigation class="flex" style="width: 240px" />
			<!-- Main Content -->
			<Nuxt style="width: 840px" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import Header from '@/components/Header.vue'

export default Vue.extend({
	components: {
		Navigation,
		Header,
	},
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
	},
})
</script>
