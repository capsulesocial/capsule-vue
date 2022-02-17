<template>
	<span>
		<svg
			v-if="!isActive"
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			:style="shrink ? `width: 15px; height: 15px` : `margin-top: 2px`"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="17 1 21 5 17 9"></polyline>
			<path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
			<polyline points="7 23 3 19 7 15"></polyline>
			<path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
		</svg>
		<svg
			v-else
			xmlns="http://www.w3.org/2000/svg"
			width="20"
			height="20"
			:style="shrink ? `width: 15px; height: 15px` : `margin-top: 2px`"
			viewBox="0 0 24 24"
			fill="none"
			:stroke="dark ? `#7097AC` : `#2E556A`"
			stroke-width="2"
			stroke-linecap="round"
			stroke-linejoin="round"
		>
			<polyline points="17 1 21 5 17 9"></polyline>
			<path d="M3 11V9a4 4 0 0 1 4-4h14"></path>
			<polyline points="7 23 3 19 7 15"></polyline>
			<path d="M21 13v2a4 4 0 0 1-4 4H3"></path>
		</svg>
	</span>
</template>

<script lang="ts">
interface IData {
	dark: boolean
}

export default {
	props: {
		isActive: {
			type: Boolean,
			default: false,
		},
		shrink: {
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
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
	},
}
</script>
