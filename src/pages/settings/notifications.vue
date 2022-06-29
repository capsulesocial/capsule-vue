<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<!-- Email notifications -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-2 text-base font-semibold">Email newsletter</h3>
		<p class="text-gray5 dark:text-gray3 text-sm">
			You are currently receiving email notifications from the following authors:
		</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	layout: `settings`,
})
</script>