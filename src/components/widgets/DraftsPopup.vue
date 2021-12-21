<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section>
			<div
				style="width: 600px; min-height: calc(100vh - 260px); height: calc(100vh - 260px); backdrop-filter: blur(5px)"
				class="overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop"
			>
				<div class="flex sticky justify-between items-center">
					<h2 class="text-primary text-3xl font-semibold">Drafts</h2>
					<button class="rounded-full focus:outline-none bg-gray1 p-1" @click="$emit(`close`)"><CloseIcon /></button>
				</div>
				<div class="flex flex-col-reverse w-full items-center">
					<div
						v-for="d in $store.state.draft.drafts"
						:key="$store.state.draft.drafts.indexOf(d)"
						class="flex w-full items-center relative"
					>
						<DraftPreview :draft="d" :index="$store.state.draft.drafts.indexOf(d)" class="flex-grow" />
						<button
							class="p-3 bg-negative text-white rounded-lg ml-4 focus:outline-none"
							style="padding-left: 0.88rem"
							@click="toggleDropdownDelete"
						>
							<BinIcon class="fill-current w-5 h-5" />
						</button>
						<div
							v-show="showDelete"
							:class="
								$store.state.settings.darkMode
									? 'bg-lightBG text-lightPrimaryText border-lightBorder'
									: 'bg-darkBG text-darkPrimaryText border-darkBorder'
							"
							class="absolute flex flex-col rounded-lg w-32 shadow-lg z-10 p-1"
							style="top: 80px; right: 0px"
						>
							<!-- Delete -->
							<button class="flex focus:outline-none text-negative" @click="deleteDraft(d)">
								<BinIcon class="p-1" />
								<span class="text-xs self-center text-negative">Delete this draft</span>
							</button>
						</div>
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
import BinIcon from '@/components/icons/Bin.vue'

interface IData {
	showDelete: boolean
}

export default Vue.extend({
	components: { DraftPreview, CloseIcon, BinIcon },
	data(): IData {
		return {
			showDelete: false,
		}
	},
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
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
	},
})
</script>
