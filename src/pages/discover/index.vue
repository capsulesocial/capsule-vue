<template>
	<div class="w-full">
		<div class="pl-2">
			<h2 class="text-xl text-primary font-semibold mb-2">Featured Categories</h2>
			<p>Read more of what you love by browsing top categories:</p>
		</div>
		<article class="w-full grid grid-cols-2 gap-y-4 my-4">
			<CategoryCard
				v-for="c in categoryList"
				:key="c"
				:text="c"
				:bgImage="require('@/assets/images/category/' + c + '/' + c + '.jpg')"
			/>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CategoryCard from '@/components/CategoryCard.vue'

import { categories } from '@/config'
import { getTags } from '@/backend/post'

interface IData {
	categoryList: string[]
	tags: string[]
	tagFilter: string
	showFilter: boolean
}

export default Vue.extend({
	components: {
		CategoryCard,
	},
	data(): IData {
		return {
			categoryList: categories,
			tags: [],
			tagFilter: `Top Today`,
			showFilter: false,
		}
	},
	async created() {
		const content = await getTags()
		this.tags = content.slice(0, 14)
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown)
	},
	methods: {
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`toggle`)) {
				this.showFilter = false
			}
		},
		setTagFilter(f: string): void {
			this.tagFilter = f
			this.showFilter = false
		},
	},
})
</script>
