<template>
	<button
		style="padding: 0.6rem 1.7rem"
		:class="getStyles()"
		class="bg-primary text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
		@click="action"
	>
		<span class="font-sans" style="font-size: 0.95rem">
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
			if (!this.thin) {
				res += ` py-3 px-6`
			} else {
				res += ` py-1 px-4`
			}
			return res
		},
	},
})
</script>
