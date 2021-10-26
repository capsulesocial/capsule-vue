<template>
	<article class="w-full rounded-lg shadow-lg bg-white mb-5 p-4">
		<h6 class="font-semibold text-primary mb-2">Bookmark Categories</h6>
		<button
			v-for="c in categoryList"
			:key="c"
			class="w-full flex items-center pb-2 capitalize focus:outline-none"
			:to="`/bookmarks/` + c"
			@click="setFilter(c)"
		>
			<img :src="require(`@/assets/images/category/` + c + `/icon.png`)" class="hotzone w-8 h-8 mr-1 ml-2" />
			<span
				class="border-b ml-2"
				:class="active === c ? 'border-primary text-primary' : ' border-transparent text-lightPrimaryVariant'"
			>
				{{ c }}</span
			>
		</button>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import { categories } from '@/config'

interface IData {
	categoryList: string[]
	active: string
}

export default Vue.extend({
	data(): IData {
		return {
			categoryList: categories,
			active: ``,
		}
	},
	methods: {
		setFilter(c: string) {
			this.$emit(`filter`, c)
			this.active = c
		},
	},
})
</script>