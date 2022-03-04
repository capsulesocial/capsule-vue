<template>
	<div
		class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section>
			<div
				style="width: 600px; backdrop-filter: blur(10px)"
				class="min-h-40 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-primary dark:text-secondary text-3xl font-semibold">Drafts</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div
					v-if="
						$store.state.draft.drafts.length === 1 &&
						$store.state.draft.drafts[0].title === `` &&
						$store.state.draft.drafts[0].subtitle === `` &&
						$store.state.draft.drafts[0].content === ``
					"
					class="flex w-full flex-col items-center mt-24"
				>
					<p class="text-gray5 dark:text-gray3 mb-5 text-sm">
						It seems you don't have any drafts yet, you can start a new one here:
					</p>
					<SecondaryButton :text="`Write a post`" :action="handleWriteNewDraft" />
				</div>
				<div v-else class="flex w-full flex-col-reverse items-center">
					<div
						v-for="d in $store.state.draft.drafts"
						:key="$store.state.draft.drafts.indexOf(d)"
						class="relative flex w-full items-center"
					>
						<DraftPreview
							:draft="d"
							:index="$store.state.draft.drafts.indexOf(d)"
							:displayDeleteButton="true"
							:numberOfDrafts="$store.state.draft.drafts.length"
							:inWidget="false"
							class="flex-grow"
							@closeDraftsPopup="closeDraftsPopup"
						/>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DraftPreview from '@/components/DraftPreview.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import CloseIcon from '@/components/icons/X.vue'

interface IData {}

export default Vue.extend({
	components: { DraftPreview, CloseIcon, SecondaryButton },
	data(): IData {
		return {}
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
			if (e.target.classList[0] === `popup`) {
				this.closeDraftsPopup()
			}
		},
		closeDraftsPopup(): void {
			this.$emit(`close`)
		},
		handleWriteNewDraft() {
			this.$router.push(`/post`)
		},
	},
})
</script>
