<template>
	<main :class="$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'" class="h-full p-0 m-0">
		<Header class="sticky top-0" />
		<div class="flex justify-center min-h-full">
			<!-- Left Nav Menu -->
			<Navigation class="flex" style="width: 240px" />
			<!-- Main Content -->
			<Nuxt class="mb-20 md:mb-5 md:min-w-max" style="width: 600px" />
			<!-- Featured Tags -->
			<div class="hidden lg:block" style="width: 240px">
				<Trending v-if="$route.name === `home` || $route.name === `tag` || $route.name === `discover-category`" />
			</div>
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
