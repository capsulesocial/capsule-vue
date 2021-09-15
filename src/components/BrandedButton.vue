<template>
	<button
		:class="getStyles()"
		class="
			transition
			duration-500
			ease-in-out
			transform
			hover:scale-110
			font-bold
			rounded-xl
			shadow-lg
			focus:outline-none
		"
		@click="action"
	>
		<span class="font-sans">
			{{ text }}
		</span>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		text: {
			type: String,
			default: `Text`,
		},
		thin: {
			type: Boolean,
			default: false,
		},
		action: {
			type: Function,
			default() {
				return null
			},
		},
	},
	methods: {
		getStyles(): string {
			let res = ``
			if (this.$store.state.settings.darkMode) {
				res += `bg-lightButtonBG text-lightButtonText`
			} else {
				res += `bg-darkButtonBG text-darkButtonText`
			}
			if (!this.thin) {
				res += ` py-2 px-4`
			} else {
				res += ` py-1 px-4`
			}
			return res
		},
	},
})
</script>
