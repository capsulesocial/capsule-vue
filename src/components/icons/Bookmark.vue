<template>
	<span>
		<svg
			v-if="!isActive"
			xmlns="http://www.w3.org/2000/svg"
			width="25"
			height="25"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="1.6"
		>
			<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
		</svg>

		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="24"
			height="24"
			viewBox="0 0 25 25"
			:fill="dark ? `#7097AC` : `#2E556A`"
			:stroke="dark ? `#7097AC` : `#2E556A`"
			stroke-width="1.6"
		>
			<path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
		</svg>
	</span>
</template>

<script lang="ts">
import Vue from 'vue'

interface IData {
	dark: boolean
}

export default Vue.extend({
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			dark: false,
		}
	},
	created() {
		this.dark = document.documentElement.classList.contains(`dark`)
	},
})
</script>
