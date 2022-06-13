<template>
	<div
		class="relative w-14 h-7 transition duration-500 ease-in-out rounded-full cursor-pointer"
		:class="[enabled ? 'bg-neutral' : 'bg-gray1 dark:bg-gray7']"
		@click="toggleSwitch"
	>
		<label
			class="absolute left-0 w-7 h-7 mb-2 transition duration-300 ease-in-out transform bg-lightBG dark:bg-darkBG border-2 rounded-full flex justify-center items-center"
			:class="[enabled ? 'translate-x-full border-neutral' : 'translate-x-0 border-gray1 dark:border-gray7']"
		>
			<CrownIcon class="text-neutral stroke-neutral self-center w-4 h-4" />
		</label>
		<input type="checkbox" class="w-full h-full appearance-none focus:outline-none" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CrownIcon from '@/components/icons/Crown.vue'

export default Vue.extend({
	components: {
		CrownIcon,
	},
	props: {
		enabled: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		toggleSwitch() {
			this.$emit(`toggle`)
		},
	},
})
</script>
