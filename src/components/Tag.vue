<template>
	<button
		class="focus:outline-none bg-gray1 dark:bg-gray7 z-10 transform rounded-lg px-3 pb-1 transition duration-500 ease-in-out"
		@click="$router.push('/tag/' + tag)"
	>
		<span class="text-gray5 dark:text-gray1 text-sm"> {{ tag }} </span>
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
	},
})
</script>
