<template>
	<div
		class="xl:w-750 min-h-120 h-120 xl:min-h-160 xl:h-160 border-lightBorder w-full border"
		style="backdrop-filter: blur(10px)"
	>
		<div class="px-5 pb-2 pt-3 xl:px-6 xl:pt-4">
			<h2 class="text-primary dark:text-secondary mb-1 text-lg font-semibold xl:text-xl">Featured Categories</h2>
			<p class="text-gray5 dark:text-gray3">Read more of what you love by browsing top categories:</p>
		</div>
		<article
			class="xl:w-750 min-h-230 h-230 xl:min-h-240 xl:h-240 fixed box-border grid w-full grid-cols-1 gap-4 overflow-y-auto px-6 pb-8 pt-4 xl:grid-cols-2"
		>
			<CategoryCard
				v-for="c in categoryList"
				:key="c"
				:text="c"
				:bgImage="require('@/assets/images/category/' + c + '/' + c + '.webp')"
			/>
		</article>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CategoryCard from '@/components/CategoryCard.vue'

import { categories } from '@/config'
import { getTags } from '@/backend/post'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

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
	layout: `discover`,
	data(): IData {
		return {
			categoryList: categories,
			tags: [],
			tagFilter: `Top Today`,
			showFilter: false,
		}
	},
	head() {
		return {
			title: `Discover - Blogchain`,
			meta: [
				{
					hid: `discover`,
					name: `discover`,
					content: `Discover - Blogchain`,
				},
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
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
