<template>
	<article class="w-full h-56">
		<div class="flex items-center relative modal-animation lg:pr-6">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-2 px-6 pt-4">
				Trending topics
			</h3>
			<button
				id="filter"
				class="toggle focus:outline-none lg:ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 text-sm shadow-lg dark:text-gray3 mt-2"
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

import { getTags, TagTimeframe } from '@/backend/post'

interface IData {
	tags: string[]
	showAlgorithmDropdown: boolean
	timeFrames: [TagTimeframe.WEEK, TagTimeframe.MONTH, TagTimeframe.YEAR, TagTimeframe.ALL_TIME]
	selectedTimeframe: TagTimeframe
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
			showAlgorithmDropdown: false,
			timeFrames: [TagTimeframe.WEEK, TagTimeframe.MONTH, TagTimeframe.YEAR, TagTimeframe.ALL_TIME],
			selectedTimeframe: TagTimeframe.WEEK,
		}
	},
	async created() {
		this.tags = await getTags()
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
		async handleTagFeed(timeframe?: TagTimeframe) {
			if (!timeframe) {
				return
			}
			this.selectedTimeframe = timeframe
			this.tags = await getTags(timeframe)
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
		readableTimeframe(timeframe: TagTimeframe) {
			switch (timeframe) {
				// case Timeframe.DAY:
				// 	return `Today`;
				case TagTimeframe.WEEK:
					return `This week`
				case TagTimeframe.MONTH:
					return `This month`
				case TagTimeframe.YEAR:
					return `This year`
				case TagTimeframe.ALL_TIME:
					return `All time`
				default:
					return `All time`
			}
		},
	},
})
</script>
