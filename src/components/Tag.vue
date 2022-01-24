<template>
	<button
		class="focus:outline-none bg-gray1 z-10 transform rounded-lg px-3 pb-1 transition duration-500 ease-in-out"
		@click="$router.push('/tag/' + tag)"
	>
		<span class="text-gray5 text-sm"> {{ tag }} </span>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	name: `Tag`,
	props: {
		tag: {
			type: String,
			default: ``,
		},
		theme: {
			type: String,
			default: `colors`,
		},
	},
	data() {
		return {
			colors: [`text-primary`, `text-secondary`, `text-teal`, `text-ocean`, `text-fourth`, `text-fifth`],
		}
	},
	methods: {
		getRandomColor() {
			let i = (Math.random() * 5) % 5
			i = Math.round(i)
			return i
		},
	},
})
</script>
