<template>
	<article class="p-6 pt-4 pb-4">
		<h3 class="text-primary font-semibold">Drafts</h3>
		<!-- Add a new draft -->
		<!-- <DraftPreview :draft="$store.state.draft" /> -->
		<DraftPreview
			v-for="d in draftSubset"
			:key="$store.state.draft.drafts.indexOf(d)"
			:draft="d"
			:index="$store.state.draft.drafts.indexOf(d)"
		/>
		<p class="text-primary">
			<button class="text-sm" @click="handleDraftPopup">Show all</button>
		</p>
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
			let s: Array<any> = new Array(...this.$store.state.draft.drafts)
			s = s.reverse()
			s = s.slice(0, 3)
			return s
		},
	},
	methods: {
		handleDraftPopup(): void {
			this.$emit(`handleDraftPopup`)
		},
	},
})
</script>
