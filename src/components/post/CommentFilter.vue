<template>
	<div class="flex relative items-center">
		<!-- Comment filter -->
		<button class="text-primary font-bold font-sans">Statistics</button>
		<span class="px-2 text-xl font-sans">|</span>
		<h6>Sort by:</h6>
		<button
			class="
				toggle
				focus:outline-none
				flex
				justify-between
				items-center
				border
				rounded-lg
				px-4
				ml-4
				text-sm
				shadow-lg
				w-32
			"
			@click.stop="showFilter = !showFilter"
		>
			<span v-if="this.$props.filter === ``" class="toggle font-bold">All</span>
			<span v-else class="toggle capitalize font-bold">{{ this.$props.filter }}</span>
			<ChevronUp v-if="this.showFilter" />
			<ChevronDown v-else />
		</button>
		<button v-show="this.$props.filter !== ``" @click="$emit(`clicked`, ``)">
			<span class="text-sm italic ml-2">Clear</span>
		</button>
		<!-- comment filter dropdown -->
		<div
			v-show="this.showFilter"
			class="absolute hotzone top-0 z-10 bg-white rounded-lg shadow-lg p-2 w-full"
			style="margin-top: 28px"
		>
			<!-- Select charge of reaction button -->
			<div class="hotzone flex justify-between mb-2">
				<button
					class="hotzone focus:outline-none border-b-4"
					:class="this.feeling === `positive` ? `border-green-500` : `border-transparent`"
					@click="setCommentFilterFeeling(`positive`)"
				>
					Positive
				</button>
				<button
					class="hotzone focus:outline-none border-b-4"
					:class="this.feeling === `neutral` ? `border-yellow-500` : `border-transparent`"
					@click="setCommentFilterFeeling(`neutral`)"
				>
					Neutral
				</button>
				<button
					class="hotzone focus:outline-none border-b-4"
					:class="this.feeling === `negative` ? ` border-red-500` : `border-transparent`"
					@click="setCommentFilterFeeling(`negative`)"
				>
					Negative
				</button>
			</div>
			<!-- Show faces -->
			<div class="grid grid-cols-5 gap-1 overflow-y-auto faces" style="height: 155px; padding-right: 5px">
				<button
					v-for="r in this.feelingList[this.feeling]"
					:key="r.label"
					class="h-12 w-12 rounded-xl shadow-lg transition duration-500 ease-in-out transform hover:scale-105"
				>
					<img
						:src="reactionList[r].image"
						:alt="reactionList[r].label"
						class="flex-shrink-0 h-12 w-12"
						@click="updateFilter(reactionList[r].label)"
					/>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { reactions, feelings } from '@/config'

interface IData {
	reactionList: {}
	feelingList: {}
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
			reactionList: reactions,
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
