<template>
	<div
		class="relative w-48 h-8 transition duration-500 ease-in-out rounded-full cursor-pointer bg-neutral flex justify-between items-center"
		@click="toggleSwitch"
	>
		<div class="absolute left-0 z-10 flex justify-between items-center w-full">
			<p
				class="px-4 transition duration-300 ease-in-out"
				:class="
					this.period === `month` ? `text-gray5 dark:text-gray3` : `text-darkPrimaryText dark:text-lightPrimaryText`
				"
			>
				Monthly
			</p>
			<p
				class="px-6 transition duration-300 ease-in-out"
				:class="
					this.period === `year` ? `text-gray5 dark:text-gray3` : `text-darkPrimaryText dark:text-lightPrimaryText`
				"
			>
				Yearly
			</p>
		</div>
		<label
			class="absolute left-0 z-0 w-24 h-8 transition duration-300 ease-in-out transform bg-lightBG dark:bg-darkBG border-neutral border-2 rounded-full flex justify-center items-center text-sm"
			:class="[active ? 'translate-x-full' : 'translate-x-0']"
		>
		</label>
		<input type="checkbox" class="w-full h-full appearance-none focus:outline-none" />
	</div>
</template>
<script lang="ts">
import Vue from 'vue'
interface IData {
	active: boolean
}
export default Vue.extend({
	props: {
		period: {
			type: String,
			default: `month`,
		},
	},
	data(): IData {
		return {
			active: false,
		}
	},
	methods: {
		toggleSwitch() {
			this.active = !this.active
			this.$emit(`toggle`)
		},
	},
})
</script>