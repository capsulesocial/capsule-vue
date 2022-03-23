<template>
	<main>
		<div
			class="from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG border-lightBorder modal-animation flex flex-col overflow-hidden rounded-lg border bg-gradient-to-r py-4 px-6 pb-2 shadow-lg"
			style="backdrop-filter: blur(10px)"
		>
			<h3 class="text-primary dark:text-secondary pb-4 text-base font-semibold">Settings</h3>
			<nuxt-link
				:class="$route.name === `settings-account` ? `bg-lightInput font-semibold` : ``"
				class="text-gray5 dark:text-gray3 focus:outline-none mb-2 flex w-full items-center justify-between rounded-lg py-2 text-left"
				to="/settings/account"
			>
				<div class="flex flex-row items-center">
					<ProfileIcon class="w-4 h-4" />
					<h6 class="ml-4">Account</h6>
				</div>
				<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><ChevronRight /></span>
			</nuxt-link>
			<!-- <nuxt-link
				:class="$route.name === `settings-security` ? `bg-lightInput font-semibold` : ``"
				class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
				to="/settings/security"
			>
				Confidentiality and Security
			</nuxt-link> -->
			<!-- <nuxt-link
				:class="$route.name === `settings-network` ? `bg-lightInput font-semibold` : ``"
				class="text-gray5 focus:outline-none mb-4 flex w-full items-center justify-between rounded-lg py-2 px-4 text-left"
				to="/settings/network"
			>
				<h6>Nodes and Network</h6>
				<span class="bg-gray1 rounded-full p-1"><ChevronRight /></span>
			</nuxt-link> -->
			<nuxt-link
				to="/settings/styling"
				:class="$route.name === `settings-styling` ? `bg-lightInput font-semibold` : ``"
				class="text-gray5 dark:text-gray3 focus:outline-none mb-2 flex w-full items-center justify-between rounded-lg py-2 text-left"
			>
				<div class="flex flex-row items-center">
					<BrushlIcon class="w-4 h-4" />
					<h6 class="ml-4">Appearance and Styling</h6>
				</div>
				<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><ChevronRight /></span>
			</nuxt-link>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import ProfileIcon from '@/components/icons/Profile.vue'
import BrushlIcon from '@/components/icons/Brush.vue'

export default Vue.extend({
	components: {
		ChevronRight,
		ProfileIcon,
		BrushlIcon,
	},
	layout: `settings`,
	head() {
		return {
			title: `Settings - Blogchain`,
			meta: [{ hid: `settings`, name: `settings`, content: `Settings on Blogchain` }],
		}
	},
})
</script>
