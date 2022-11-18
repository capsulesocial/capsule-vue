<template>
	<div>
		<!-- Desktop -->
		<div
			class="bg-neutral hover:bg-opacity-75 hidden rounded-lg px-5 text-sm font-semibold text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:flex flex-row items-center"
			style="padding-top: 0.4rem; padding-bottom: 0.4rem"
		>
			<p class="place-self-center">Donate</p>
		</div>
		<!-- Mobile -->
		<div
			class="bg-neutral rounded-lg text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
		>
			<p class="place-self-center"><DonateIcon class="m-2 h-5 w-5 text-white" /></p>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DonateIcon from '@/components/icons/DonateIcon.vue'
export default Vue.extend({
	components: {
		DonateIcon,
	},
})
</script>
