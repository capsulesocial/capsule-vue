<template>
	<article class="p-6 pt-4 pb-4">
		<h3 class="text-primary dark:text-secondary font-semibold">Drafts</h3>
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
					<button class="text-primary dark:text-secondary focus:outline-none ml-1" @click="$router.push(`/post`)">
						write a new draft
					</button>
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
			<p class="text-primary dark:text-secondary">
				<button class="focus:outline-none text-sm" @click="handleDraftPopup">Show all</button>
			</p>
		</div>
		<div v-else class="text-gray5 dark:text-gray3 pt-3 text-sm">
			<button class="text-primary dark:text-secondary focus:outline-none ml-1" @click="$router.push(`/register`)">
				Sign up
			</button>
			to create drafts and save content
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import DraftPreview from '@/components/DraftPreview.vue'

interface IData {
	showPopup: boolean
}

export default Vue.extend({
	components: {
		DraftPreview,
	},
	data(): IData {
		return {
			showPopup: false,
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
