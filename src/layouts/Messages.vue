<template>
	<main :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'" class="h-screen">
		<Header class="fixed top-0" />

		<div class="flex justify-center">
			<!-- Left Nav Menu -->
			<Navigation class="flex lg:pr-0 xl:pr-8" />
			<!-- Main Content -->
			<Nuxt class="border-l md:ml-24 xl:ml-64 md:min-w-max md:max-w-3xl" />
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
			this.$router.push(`/auth`)
		}
	},
})
</script>
