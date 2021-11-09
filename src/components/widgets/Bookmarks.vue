<template>
	<article class="w-full rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg mb-5 px-6 py-4 border border-lightBorder">
		<div class="flex flex-row justify-between pb-4 items-center">
			<h6 class="text-primary text-base font-semibold">Filter by Category</h6>
			<button class="focus:outline-none text-sm text-primary pr-1" @click="$emit(`filter`)">
				Show All
			</button>
		</div>
		<button
			v-for="c in categoryList"
			:key="c"
			class="w-full flex items-center pb-2 capitalize focus:outline-none"
			:to="`/bookmarks/` + c"
			@click="setFilter(c)"
		>
			<img :src="require(`@/assets/images/category/` + c + `/icon.png`)" class="hotzone w-8 h-8 mr-1" />
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