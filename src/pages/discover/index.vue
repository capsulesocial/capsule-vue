<template>
	<div class="w-full px-4">
		<section>
			<article class="flex flex-col md:flex-row justify-between mb-1 items-center mt-3">
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
					class="border rounded-lg text-lg px-2 py-2 focus:outline-none self-center"
				>
					<option>Trending</option>
					<option>Top This Week</option>
					<option>All Time</option>
				</select>
			</article>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="mb-5 text-xl"
			>
				Find and join conversations on any topic
			</p>
			<TagCard v-for="t in this.tags" :key="t" :tag="t" />
		</section>

		<section>
			<article class="mt-3">
				<h2
					:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-4xl font-bold"
				>
					Featured Categories
				</h2>
				<p
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="mb-5 text-xl"
				>
					Read more of what you love by browsing top categories
				</p>
			</article>
			<article class="grid grid-cols-2 gap-4 md:grid-cols-4">
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

<script>
import CategoryCard from '@/components/CategoryCard.vue'
import TagCard from '@/components/Tag.vue'

import { categories } from '@/config'

export default {
	components: {
		CategoryCard,
		TagCard,
	},
	data() {
		return {
			tagCategory: `trending`,
			categoryList: categories,
			tags: [
				`jack`,
				`pancakes`,
				`biking`,
				`reddit`,
				`crypto`,
				`lizardpeople`,
				`LEGOs`,
				`aspen`,
				`clock`,
				`sunset`,
				`beef`,
			],
		}
	},
}
</script>
