<template>
	<div class="w-full">
		<section style="width: 750px">
			<article style="width: 750px" class="flex flex-col md:flex-row justify-between mb-1 items-center mt-3">
				<!-- Tag title and filter dropdown -->
				<div class="flex flex-row justify-between w-full">
					<h2
						:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="text-3xl font-semibold"
					>
						Featured Hashtags
					</h2>
					<!-- Dropdown filter -->
					<div class="relative inline">
						<button
							class="
								flex
								justify-between
								items-center
								toggle
								border
								rounded-lg
								focus:outline-none
								self-center
								capitalize
								text-gray7
								font-medium
								h-10
								px-2
							"
							style="width: 175px"
							@click.stop="showFilter = !showFilter"
						>
							{{ tagFilter }}
							<ChevronUp v-if="showFilter" />
							<ChevronDown v-else />
						</button>
						<!-- Dropdown -->
						<div v-show="showFilter" class="absolute z-10 top-0 bg-white rounded-lg shadow-lg p-2 mt-10 w-full">
							<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`Trending`)">
								Trending
							</button>
							<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`Top This Week`)">
								Top This Week
							</button>
							<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`All Time`)">
								All Time
							</button>
						</div>
					</div>
				</div>
			</article>
			<p
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				class="font-normal text-xl"
			>
				Find and join conversations on any topic:
			</p>
			<div class="my-4">
				<TagCard v-for="t in tags" :key="t" :tag="t" class="text-lg mr-4 my-1" />
			</div>
		</section>

		<section style="width: 750px">
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
				class="font-normal text-xl pb-1"
			>
				Read more of what you love by browsing top categories:
			</p>
			<article class="grid grid-cols-2 gap-4 my-4">
				<CategoryCard
					v-for="c in categoryList"
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
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

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
		TagCard,
		ChevronUp,
		ChevronDown,
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
