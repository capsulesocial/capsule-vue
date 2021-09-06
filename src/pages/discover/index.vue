<template>
	<div class="w-full px-4">
		<section style="width: 640px">
			<article style="width: 600px" class="flex flex-col md:flex-row justify-between mb-1 items-center mt-3">
				<h2
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-4xl font-bold"
				>
					Featured Hashtags
				</h2>
				<select
					:class="
						this.$store.state.settings.darkMode
							? 'bg-lightBG border-lightBorder text-lightSecondaryText'
							: 'bg-darkBG border-darkBorder text-darkSecondaryText'
					"
					class="border rounded-lg px-2 py-2 focus:outline-none self-center"
				>
					<option style="font-size: 1.563rem">Trending</option>
					<option style="font-size: 1.563rem">Top This Week</option>
					<option style="font-size: 1.563rem">All Time</option>
				</select>
			</article>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				style="font-size: 1.563rem"
				class="mb-2"
			>
				Find and join conversations on any topic
			</p>
			<div class="my-4">
				<TagCard v-for="t in this.tags" :key="t" :tag="t" class="text-lg" />
			</div>
		</section>

		<section style="width: 640px">
			<article class="mt-4">
				<h2
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-4xl font-bold"
				>
					Featured Categories
				</h2>
				<p
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="mb-5"
					style="font-size: 1.563rem"
				>
					Read more of what you love by browsing top categories
				</p>
			</article>
			<article class="grid grid-cols-2 gap-4 md:grid-cols-3">
				<CategoryCard
					v-for="c in this.categoryList"
					:key="c"
					:text="c"
					:bgImage="require('@/assets/images/category/' + c + '/' + c + '.jpg')"
				/>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CategoryCard from '@/components/CategoryCard.vue'
import TagCard from '@/components/Tag.vue'

import { categories } from '@/config'

interface IData {
	tagCategory: string
	categoryList: string[]
	tags: string[]
}

export default Vue.extend({
	components: {
		CategoryCard,
		TagCard,
	},
	data(): IData {
		return {
			tagCategory: `trending`,
			categoryList: categories,
			tags: [],
		}
	},
	async created() {
		const content = await this.$axios.$get(`/content/tags`)
		this.tags = content.data.slice(0, 14)
	},
})
</script>
