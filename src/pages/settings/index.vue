<template>
	<main>
		<div
			class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder overflow-hidden py-4 px-6 pb-2 modal-animation flex flex-col"
			style="backdrop-filter: blur(10px)"
		>
			<h3 class="text-primary text-base font-semibold pb-4">Settings</h3>
			<nuxt-link
				:class="$route.name === `settings-account` ? `bg-lightInput font-semibold` : ``"
				class="w-full flex justify-between items-center rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
				to="/settings/account"
			>
				<h6>Account</h6>
				<span class="rounded-full p-1 bg-gray1"><ChevronRight /></span>
			</nuxt-link>
			<!-- <nuxt-link
									:class="$route.name === `settings-security` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									to="/settings/security"
								>
									Confidentiality and Security
								</nuxt-link> -->
			<nuxt-link
				:class="$route.name === `settings-network` ? `bg-lightInput font-semibold` : ``"
				class="w-full flex justify-between items-center rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
				to="/settings/network"
			>
				<h6>Nodes and Network</h6>
				<span class="rounded-full p-1 bg-gray1"><ChevronRight /></span>
			</nuxt-link>
			<nuxt-link
				to="/settings/styling"
				:class="$route.name === `settings-styling` ? `bg-lightInput font-semibold` : ``"
				class="w-full flex justify-between items-center rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
			>
				<h6>Appearance and Styling</h6>
				<span class="rounded-full p-1 bg-gray1"><ChevronRight /></span>
			</nuxt-link>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'

export default Vue.extend({
	components: {
		ChevronRight,
	},
	layout: `settings`,
})
</script>
