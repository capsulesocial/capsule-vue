<template>
	<article class="w-full">
		<div class="flex items-center relative modal-animation lg:pr-6">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2 px-6 pt-4">
				Trending topics
			</h3>
			<button
				id="filter"
				class="toggle focus:outline-none lg:ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 text-sm shadow-lg dark:text-gray3"
				@click.stop="showAlgorithmDropdown = !showAlgorithmDropdown"
			>
				<span class="toggle font-bold capitalize pl-4">
					{{ readableTimeframe(selectedTimeframe) }}
				</span>
				<ChevronUp v-if="showAlgorithmDropdown" class="toggle pr-4" />
				<ChevronDown v-else class="toggle pr-4" />
			</button>
			<div
				v-if="showAlgorithmDropdown"
				class="hotzone border-lightBorder modal-animation absolute top-0 right-20 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg mr-0 lg:mr-6"
				style="margin-top: 40px"
			>
				<div
					v-for="timeframe in timeFrames"
					:key="timeframe"
					class="hotzone flex justify-start items-start flex-col dark:text-gray3"
				>
					<button
						:class="selectedTimeframe === timeframe ? ` text-primary font-semibold` : `text-gray5 dark:text-gray3`"
						class="hotzone focus:outline-none my-1 px-2 whitespace-nowrap"
						@click="handleTagFeed(timeframe)"
					>
						{{ readableTimeframe(timeframe) }}
					</button>
				</div>
			</div>
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
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'

import { getTags } from '@/backend/post'

enum Timeframe {
	// DAY = `1`,
	WEEK = `7`,
	MONTH = `30`,
	YEAR = `365`,
	ALL_TIME = `ALL_TIME`,
}

interface IData {
	tags: string[]
	tagFilter: string
	showFilter: boolean
	showAlgorithmDropdown: boolean
	timeFrames: [Timeframe.WEEK, Timeframe.MONTH, Timeframe.YEAR, Timeframe.ALL_TIME]
	selectedTimeframe: Timeframe
	readableTime: string
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
			tagFilter: `Today`,
			showFilter: false,
			showAlgorithmDropdown: false,
			timeFrames: [Timeframe.WEEK, Timeframe.MONTH, Timeframe.YEAR, Timeframe.ALL_TIME],
			selectedTimeframe: Timeframe.MONTH,
			readableTime: Timeframe.MONTH,
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
		handleTagFeed(timeframe?: Timeframe) {
			if (!timeframe) {
				return
			}
			this.readableTime = timeframe
			this.selectedTimeframe = timeframe
			// todo: fetch trending tags and update here
			// this.tags=
		},
		handleDropdown() {
			window.addEventListener(`click`, (event: Event): void => {
				if (!event) {
					return
				}
				if (!this.showAlgorithmDropdown) {
					return
				}
				this.showAlgorithmDropdown = false
			})
		},
		readableTimeframe(timeframe: Timeframe) {
			switch (timeframe) {
				// case Timeframe.DAY:
				// 	return `Today`;
				case Timeframe.WEEK:
					return `This week`
				case Timeframe.MONTH:
					return `This month`
				case Timeframe.YEAR:
					return `This year`
				case Timeframe.ALL_TIME:
					return `All time`
				default:
					return `All time`
			}
		},
	},
})
</script>
