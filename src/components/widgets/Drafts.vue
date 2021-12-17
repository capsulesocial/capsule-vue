<template>
	<article class="p-6 pt-4 pb-4">
		<h3 class="text-primary font-semibold">Drafts</h3>
		<!-- Add a new draft -->
		<!-- <DraftPreview :draft="$store.state.draft" /> -->
		<DraftPreview
			v-for="d in $store.state.draft.drafts"
			:key="$store.state.draft.drafts.indexOf(d)"
			:draft="d"
			:index="$store.state.draft.drafts.indexOf(d)"
		/>
		<div>
			<button @click="addNewDraft">Create a new Draft</button>
		</div>
		<p class="text-primary">
			<button class="text-sm">Show all</button>
			<button class="text-sm" @click="clearDrafts">Clear all Drafts</button>
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
	methods: {
		addNewDraft() {
			this.$store.commit(`draft/createDraft`)
			this.$router.push(`/post`)
		},
		clearDrafts() {
			// this.$store.commit(`clearDrafts`)
		},
	},
})
</script>
