<template>
	<article class="w-full">
		<div class="flex flex-row items-center justify-between p-6 pt-4 pb-2">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">Trending tags</h3>
			<!-- <div class="flex flex-row justify-end">
				<h3 v-if="$route.name === `discover`" class="self-center text-sm text-gray5">Top of</h3>
				<div v-if="$route.name === `discover`" class="relative inline">
					<button
						class="flex justify-between items-center toggle rounded-lg focus:outline-none self-center capitalize text-gray5 font-bold text-sm text-mr-2 px-2"
						style="width: 6rem"
						@click.stop="showFilter = !showFilter"
					>
						{{ tagFilter }}
						<ChevronUp v-if="showFilter" />
						<ChevronDown v-else />
					</button>
					<div
						v-show="showFilter"
						class="absolute z-10 top-0 bg-white rounded-lg shadow-lg p-2 mt-10 w-full text-sm modal-animation"
					>
						<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`Today`)">
							Today
						</button>
						<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`This Week`)">
							This Week
						</button>
						<button class="w-full text-left text-gray7 focus:outline-none p-2" @click="setTagFilter(`All Time`)">
							All Time
						</button>
					</div>
				</div>
			</div> -->
		</div>
		<div class="px-6 pb-4">
			<article v-if="tags.length == 0">
				<p class="text-gray5 dark:text-gray3 mb-4 mt-3 text-sm">
					<span> It seems no trending tags are available at the moment </span>
				</p>
			</article>
			<TagCard v-for="t in tags" :key="t" :tag="t" class="my-2 mr-4 text-lg" />
		</div>
		<nuxt-img
			v-if="checkRoute()"
			loading="lazy"
			:src="$colorMode.dark ? `/images/dark/discover.webp` : `/images/light/discover.webp`"
		/>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import TagCard from '@/components/Tag.vue'
// import ChevronUp from '@/components/icons/ChevronUp.vue'
// import ChevronDown from '@/components/icons/ChevronDown.vue'

import { getTags } from '@/backend/post'

interface IData {
	tags: string[]
	tagFilter: string
	showFilter: boolean
}

export default Vue.extend({
	components: {
		TagCard,
		// ChevronUp,
		// ChevronDown,
	},
	data(): IData {
		return {
			tags: [],
			tagFilter: `Today`,
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
