<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-4 flex items-center xl:hidden">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">All Settings</h6>
		</nuxt-link>
		<!-- Email notifications -->
		<h2 class="text-primary mb-4 text-sm font-semibold">Email notifications</h2>
		<p class="text-gray5">You are currently receiving email notifications from the following authors:</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	layout: `settings`,
})
</script>
