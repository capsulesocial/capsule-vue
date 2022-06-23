<template>
	<footer class="text-gray5 dark:text-gray3 text-sm">
		<div class="mb-5 mt-1 flex flex-wrap">
			<nuxt-link to="/help" class="pr-6">Help</nuxt-link>
			<nuxt-link to="/contentpolicy" class="pr-6">Content Policy</nuxt-link>
			<nuxt-link to="/payment-policy" class="pr-6">Payment Policy</nuxt-link>
			<a href="https://www.capsule.social/writers" target="_blank" class="pr-6 mb-2">Writers</a>
			<nuxt-link to="/id/capsule" class="pr-6">Blog</nuxt-link>
			<a href="https://discord.gg/HhVbaD2BHY" target="_blank" class="pr-6">Discord</a>
			<a href="https://www.capsule.social/careers" target="_blank" class="pr-6">Careers</a>
			<a href="https://www.iubenda.com/terms-and-conditions/40723363" target="_blank" class="pr-6">Terms</a>
			<a href="https://www.capsule.social/about/overview" target="_blank" class="pr-6">About</a>
		</div>
		<p>© {{ currentYear }} Capsule Social, Inc.</p>
	</footer>
</template>
<script lang="ts">
import Vue from 'vue'

interface IData {
	currentYear: string
}

export default Vue.extend({
	data(): IData {
		return {
			currentYear: ``,
		}
	},

	created() {
		const theDate = new Date()
		this.currentYear = theDate.getFullYear().toString()
	},
})
</script>
