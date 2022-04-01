<template>
	<article class="p-6 pt-4 pb-4">
		<div class="flex flex-row justify-between items-center">
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText font-semibold">Drafts</h3>
			<div @mouseenter="showInfo = true" @mouseleave="showInfo = false">
				<InfoIcon class="w-4 h-4 text-gray5 dark:text-gray3" />
			</div>
		</div>
		<div v-if="this.$store.state.session.id !== ``">
			<div
				v-if="
					draftSubset.length === 1 &&
					draftSubset[0].title === `` &&
					draftSubset[0].subtitle === `` &&
					draftSubset[0].content === ``
				"
			>
				<div class="text-gray5 dark:text-gray3 pt-3 text-sm mb-4">
					You don't have any drafts yet,
					<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/post`)">write a new draft</button>
				</div>
			</div>
			<DraftPreview
				v-for="d in draftSubset"
				v-else
				:key="$store.state.draft.drafts.indexOf(d)"
				:draft="d"
				:index="$store.state.draft.drafts.indexOf(d)"
				:numberOfDrafts="draftSubset.length"
				:inWidget="true"
			/>
			<p class="text-primary">
				<button class="focus:outline-none text-sm" @click="handleDraftPopup">Show all</button>
			</p>
		</div>
		<div v-else class="text-gray5 dark:text-gray3 pt-3 text-sm">
			<button class="text-primary focus:outline-none ml-1" @click="$router.push(`/register`)">Sign up</button>
			to create drafts and save content
		</div>
		<!-- Info hover -->
		<div
			v-show="showInfo"
			class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-darkBG p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
			:class="$colorMode.dark ? `DraftInfoOpenDark` : `DraftInfoOpen`"
			style="top: 55px; right: 7px; width: 80%"
		>
			Note: drafts are stored in your browser's local storage and may be erased on actions such as clearing history
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import DraftPreview from '@/components/DraftPreview.vue'
import InfoIcon from '@/components/icons/Info.vue'

interface IData {
	showPopup: boolean
	showInfo: boolean
}

export default Vue.extend({
	components: {
		DraftPreview,
		InfoIcon,
	},
	data(): IData {
		return {
			showPopup: false,
			showInfo: false,
		}
	},
	computed: {
		draftSubset() {
			const s = [...this.$store.state.draft.drafts]
			s.reverse()
			return s.slice(0, 3)
		},
	},
	methods: {
		handleDraftPopup(): void {
			this.$emit(`handleDraftPopup`)
		},
	},
})
</script>
<style>
.DraftInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.DraftInfoOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #121212;
	border-radius: 2px;
	z-index: 1;
}
</style>
