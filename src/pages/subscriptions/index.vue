<template>
	<main>
		<!-- Mobile back button -->
		<button class="mb-4 flex items-center xl:hidden focus:outline-none" @click="$router.go(-1)">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">Back</h6>
		</button>
		<!-- Network Tab -->
		<h3 class="text-primary dark:text-secondary pb-4 text-base font-semibold">My subscriptions</h3>
		<p class="text-gray5 mb-6">Manage your active subscriptions to your favorite content creators here:</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'

interface IData {}

export default Vue.extend({
	components: { ChevronLeft },
	layout: `subscriptions`,
	props: {},
	data(): IData {
		return {}
	},
	head() {
		return {
			title: `Network settings - Blogchain`,
			meta: [{ hid: `settings-network`, name: `settings-network`, content: `Network settings on Blogchain` }],
		}
	},
	created() {},
	methods: {},
})
</script>
