<template>
	<div class="relative flex flex-grow items-center flex-row-reverse">
		<!-- bookmarks sort -->
		<div class="toggle flex w-full flex-row items-center justify-end">
			<h6 class="hidden lg:block text-gray5 dark:text-gray3">Sort by:</h6>
			<button
				class="toggle focus:outline-none ml-4 flex items-center justify-between rounded-lg border dark:border-gray3 px-4 text-sm shadow-lg dark:text-gray3"
				@click="showFilter = !showFilter"
			>
				<span v-if="filter === `BOOKMARK_DESC`" class="toggle font-bold capitalize">Bookmarks date</span>
				<span v-if="filter === `POST_DESC`" class="toggle font-bold capitalize">Posts date</span>
				<ChevronUp v-if="showFilter" />
				<ChevronDown v-else />
			</button>
		</div>
		<!-- bookmarks sort dropdown -->
		<div
			v-if="showFilter"
			class="hotzone border-lightBorder modal-animation absolute top-0 z-20 rounded-lg border bg-lightBG dark:bg-darkBG px-4 py-3 shadow-lg"
			style="margin-top: 28px"
		>
			<!-- Select charge of sorting button -->
			<div class="hotzone flex justify-start items-start flex-col dark:text-gray3">
				<button
					class="hotzone focus:outline-none mb-4"
					:class="
						filter === `BOOKMARK_DESC` ? `text-primary dark:text-secondary font-semibold` : `text-gray5 dark:text-gray3`
					"
					@click="updateSort(`BOOKMARK_DESC`)"
				>
					Bookmarks date
				</button>
				<button
					class="hotzone focus:outline-none"
					:class="
						filter === `POST_DESC` ? ` text-primary dark:text-secondary font-semibold` : `text-gray5 dark:text-gray3`
					"
					@click="updateSort(`POST_DESC`)"
				>
					Posts date
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import ChevronUp from '@/components/icons/ChevronUp.vue'
import ChevronDown from '@/components/icons/ChevronDown.vue'
import { BookmarkSort } from '@/backend/bookmarks'

interface IData {
	showFilter: boolean
	dark: boolean
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
			default: `BOOKMARK_DESC`,
		},
	},
	data(): IData {
		return {
			showFilter: false,
			dark: false,
		}
	},
	created() {
		// Set filter dropdown event handler
		window.addEventListener(`click`, this.handleDropdown, false)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
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
		updateSort(sort: BookmarkSort) {
			// When a user selects a filter
			this.$emit(`clicked`, sort)
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
