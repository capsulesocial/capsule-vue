<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section>
			<div
				style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px); backdrop-filter: blur(5px)"
				class="overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop"
			>
				<div class="flex sticky justify-between items-center">
					<h2 class="text-primary text-3xl font-semibold">Drafts</h2>
					<button class="rounded-full focus:outline-none bg-gray1 p-1" @click="$emit(`close`)"><CloseIcon /></button>
				</div>
				<div class="flex flex-col-reverse w-full">
					<div v-for="d in $store.state.draft.drafts" :key="$store.state.draft.drafts.indexOf(d)" class="flex w-full">
						<DraftPreview :draft="d" :index="$store.state.draft.drafts.indexOf(d)" class="flex-grow" />
						<button @click="deleteDraft(d)">Delete</button>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DraftPreview from '@/components/DraftPreview.vue'
import CloseIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: { DraftPreview, CloseIcon },
	created() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleCloseClick)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.parentNode.classList[0] === `popup`) {
				this.$emit(`close`)
			}
		},
		deleteDraft(d: any): void {
			const i: number = this.$store.state.draft.drafts.indexOf(d)
			this.$store.commit(`draft/deleteDraft`, i)
		},
	},
})
</script>
