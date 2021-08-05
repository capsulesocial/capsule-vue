<template>
	<main class="flex flex-col items-center">
		<header class="fixed z-10 bg-white w-full border-b h-16 items-center flex justify-center">
			<div class="w-full md:min-w-max md:max-w-3xl">
				<nuxt-link to="/home">
					<CapsuleIcon />
				</nuxt-link>
			</div>
		</header>
		<!-- Main Content -->
		<Nuxt class="md:min-w-max md:max-w-3xl pt-12" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
})
</script>
