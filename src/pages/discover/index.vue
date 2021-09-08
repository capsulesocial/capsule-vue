<template>
	<div class="w-full">
		<section style="width: 640px">
			<article style="width: 600px" class="flex flex-col md:flex-row justify-between mb-1 items-center mt-3">
				<h2
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-3xl font-semibold"
				>
					Featured Hashtags
				</h2>
				<select
					class="border rounded-lg focus:outline-none self-center"
					style="padding: 15px 15px 15px 15px; color: #686868"
				>
					<option>Trending</option>
					<option>Top This Week</option>
					<option>All Time</option>
				</select>
			</article>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="font-normal text-xl"
			>
				Find and join conversations on any topic:
			</p>
			<div class="my-4">
				<TagCard v-for="t in this.tags" :key="t" :tag="t" class="text-lg mr-4 my-1" />
			</div>
		</section>

		<section style="width: 640px">
			<article class="mb-1 mt-3">
				<h2
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-3xl font-semibold"
				>
					Featured Categories
				</h2>
			</article>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="font-normal text-xl"
			>
				Read more of what you love by browsing top categories:
			</p>
			<article class="grid grid-cols-2 gap-4 my-4">
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
import { getTags } from '@/backend/post'

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
		const content = await getTags()
		this.tags = content.slice(0, 14)
	},
})
</script>
