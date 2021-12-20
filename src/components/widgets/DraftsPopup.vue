<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section>
			<div
				style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px); backdrop-filter: blur(5px)"
				class="overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop"
			>
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

export default Vue.extend({
	components: { DraftPreview },
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
