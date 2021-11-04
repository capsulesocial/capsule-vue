<template>
	<article class="w-full">
		<div class="flex flex-row justify-between p-6 pt-4 pb-3">
			<h3 class="text-primary text-base font-semibold">Featured tags</h3>
			<h3 v-if="checkRoute()" class="self-center text-lg">Top of <button class="font-semibold">Today</button></h3>
			<!-- Dropdown filter -->
			<div v-if="$route.name === `discover`" class="relative inline">
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
		<div class="px-6 pb-4">
			<TagCard v-for="t in tags" :key="t" :tag="t" class="text-lg mr-4 my-2" />
		</div>
		<img v-if="checkRoute()" :src="require(`@/assets/images/brand/stats.jpg`)" />
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import TagCard from '@/components/Tag.vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

import { getTags } from '@/backend/post'

interface IData {
	tags: string[]
	tagFilter: string
	showFilter: boolean
}

export default Vue.extend({
	components: {
		TagCard,
		ChevronUp,
		ChevronDown,
	},
	data(): IData {
		return {
			tags: [],
			tagFilter: `Top Today`,
			showFilter: false,
		}
	},
	async created() {
		const content = await getTags()
		this.tags = content.slice(0, 14)
		// Tag dropdown event listener
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown)
	},
	methods: {
		checkRoute(): boolean {
			return this.$route.name?.substr(0, 8) === `discover`
		},
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
