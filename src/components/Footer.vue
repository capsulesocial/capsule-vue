<template>
	<footer class="text-gray5 text-sm">
		<div class="flex mb-5 mt-1">
			<nuxt-link to="/help" class="pr-6">Help</nuxt-link>
			<a href="https://www.capsule.social/writers" target="_blank" class="pr-6">Writers</a>
			<a href="https://blog.capsule.social/" target="_blank" class="pr-6">Blog</a>
			<a href="https://www.capsule.social/careers" target="_blank" class="pr-6">Careers</a>
			<a href="https://www.iubenda.com/terms-and-conditions/40723363" target="_blank" class="pr-6">Terms</a>
			<a href="https://www.capsule.social/about/overview" target="_blank" class="pr-6">About</a>
		</div>
		© {{ currentYear }} Capsule Social, Inc.
	</footer>
</template>
<script>
export default {
	data() {
		return {
			currentYear: new Date().getFullYear(),
		}
	},
}
</script>
