<template>
	<main>
		<!-- Header and close button -->
		<header class="w-full flex justify-center border-b-4 h-24 shadow-lg">
			<div class="flex items-center md:min-w-max md:max-w-4xl w-full pl-4">
				<CapsuleIcon />
				<h3
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryVariant' : 'text-darkPrimaryVariant'"
					class="text-xl border-l-2 border-primary ml-4 pl-4"
				>
					New Post
				</h3>
			</div>
		</header>

		<div class="flex justify-center">
			<!-- Main Content -->
			<Nuxt class="md:min-w-max md:max-w-4xl w-full" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
