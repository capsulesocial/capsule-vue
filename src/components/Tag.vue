<template>
	<button
		class="focus:outline-none bg-gray1 z-10 transform rounded-lg px-3 pb-1 transition duration-500 ease-in-out"
		@click="noClick ? () => {} : $router.push('/tag/' + tag)"
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
		noClick: {
			type: Boolean,
			default: false,
		},
	},
})
</script>
