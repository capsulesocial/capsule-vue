<template>
	<div class="relative flex flex-grow items-center">
		<!-- Comment filter -->
		<div class="flex w-full flex-row items-center justify-end">
			<h6 class="hidden xl:block dark:text-gray3">Filter by:</h6>
			<button
				class="toggle focus:outline-none ml-4 flex w-32 items-center justify-between rounded-lg border dark:border-gray3 px-4 text-sm shadow-lg dark:text-gray3"
				@click.stop="showFilter = !showFilter"
			>
				<span v-if="filter === ``" class="toggle font-bold">All</span>
				<span v-else class="toggle font-bold capitalize">{{ filter }}</span>
				<ChevronUp v-if="showFilter" />
				<ChevronDown v-else />
			</button>
			<button v-show="filter !== ``" @click="$emit(`clicked`, ``)">
				<span class="ml-2 text-sm text-primary dark:text-secondary">Clear</span>
			</button>
		</div>
		<!-- comment filter dropdown -->
		<div
			v-show="showFilter"
			class="hotzone border-lightBorder modal-animation absolute top-0 z-20 w-full rounded-lg border bg-lightBG dark:bg-darkBG p-4 shadow-lg"
			style="margin-top: 28px"
		>
			<!-- Select charge of reaction button -->
			<div class="hotzone mb-6 flex flex-col justify-start xl:flex-row dark:text-gray3">
				<button
					class="hotzone focus:outline-none mr-4 border-b-2"
					:class="feeling === `positive` ? `border-positive` : `border-transparent`"
					@click="setCommentFilterFeeling(`positive`)"
				>
					Positive
				</button>
				<button
					class="hotzone focus:outline-none mr-4 border-b-2"
					:class="feeling === `neutral` ? `border-neutral` : `border-transparent`"
					@click="setCommentFilterFeeling(`neutral`)"
				>
					Neutral
				</button>
				<button
					class="hotzone focus:outline-none mr-4 border-b-2"
					:class="feeling === `negative` ? ` border-negative` : `border-transparent`"
					@click="setCommentFilterFeeling(`negative`)"
				>
					Negative
				</button>
			</div>
			<!-- Show faces -->
			<div
				class="faces grid grid-cols-1 gap-x-1 gap-y-4 overflow-y-auto overflow-x-hidden xl:grid-cols-5"
				style="height: 225px; padding-right: 5px"
			>
				<button
					v-for="r in feelingList[feeling]"
					:key="r.label"
					class="tooltip focus:outline-none border-lightBorder relative inline-block h-24 w-24 transform rounded-xl border transition duration-500 ease-in-out hover:scale-105"
				>
					<img
						:src="reactionList[r].image"
						:alt="reactionList[r].label"
						class="h-24 w-24 flex-shrink-0"
						@click="updateFilter(reactionList[r].label)"
					/>
					<span class="tooltiptext -ml-8 -mt-1 w-16 bg-white bg-opacity-75 text-center text-xs text-black">{{
						reactionList[r].label
					}}</span>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { faces, feelings } from '@/config'

interface IData {
	reactionList: Record<string, any>
	feelingList: Record<string, any>
	feeling: string
	showFilter: boolean
}

export default Vue.extend({
	name: `PostCommentFilter`,
	components: {
		ChevronUp,
		ChevronDown,
	},
	props: {
		filter: {
			type: String,
			default: ``,
		},
	},
	data(): IData {
		return {
			reactionList: faces,
			feelingList: feelings,
			feeling: `positive`,
			showFilter: false,
		}
	},
	created() {
		// Set filter dropdown event handler
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
			if (e.target.parentNode.classList.contains(`hotzone`)) {
				this.showFilter = true
			}
		},
		setCommentFilterFeeling(feeling: string) {
			this.feeling = feeling
			this.$emit(`clicked`, feeling)
			this.showFilter = true
		},
		updateFilter(reaction: string) {
			// When a user selects a filter
			this.$emit(`clicked`, reaction)
			this.showFilter = false
		},
	},
})
</script>

<style scoped>
.tooltip .tooltiptext {
	visibility: hidden;
	/* Position the tooltip */
	position: absolute;
	z-index: 1;
}

.tooltip:hover .tooltiptext {
	visibility: visible;
	top: 100%;
	left: 50%;
}
</style>
