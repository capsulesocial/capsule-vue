<template>
	<div class="flex-start m-4 flex rounded-full bg-gray-100">
		<button type="submit" class="px-4">
			<SearchIcon />
		</button>
		<input
			v-model="keyword"
			type="search"
			placeholder="Type your keywords..."
			class="focus:outline-none mr-10 flex-grow rounded-full bg-gray-100 text-black"
		/>
	</div>
</template>

<script>
import SearchIcon from '@/components/icons/Search.vue'

export default {
	components: {
		SearchIcon,
	},
	data() {
		return {
			keyword: ``,
		}
	},
}
</script>
