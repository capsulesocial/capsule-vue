<template>
	<main :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'" class="h-full p-0 m-0">
		<Header class="sticky top-0" />
		<div class="flex justify-center min-h-full">
			<!-- Left Nav Menu -->
			<Navigation class="flex lg:pr-0 xl:pr-8" />
			<!-- Main Content -->
			<Nuxt class="mb-20 md:mb-5 border-l md:ml-24 xl:ml-64 md:min-w-max md:max-w-3xl" />
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
		if (this.$store.state.session.cid === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
