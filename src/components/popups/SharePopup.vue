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
					<h2 class="text-primary dark:text-secondary text-3xl font-semibold">Share this post</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div class="flex w-full flex-col items-center mt-4">
					<div class="bg-lightInput p-4 rounded-lg w-full flex flex-row items-center">
						<img v-if="image != ``" :src="image" class="h-48 w-48 flex-shrink-0 rounded-lg object-cover xl:h-32 mr-4" />
						<div class="flex max-w-full flex-col overflow-hidden pr-4">
							<p class="text-gray5 text-sm mb-2">blogchain.app</p>
							<h3 class="break-words mb-1 text-base font-semibold dark:text-darkPrimaryText">
								{{ title }}
							</h3>
							<h6
								v-if="(subtitle || excerpt) && image"
								class="max-w-420 break-words text-sm dark:text-darkSecondaryText"
							>
								{{ subtitle ? subtitle : this.postExcerpt() }}
							</h6>
							<h6
								v-if="(subtitle || excerpt) && !image"
								class="max-w-mobileCard xl:max-w-700 break-words text-lightSecondaryText dark:text-darkSecondaryText"
							>
								{{ subtitle ? subtitle : this.postExcerpt() }}
							</h6>
						</div>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'

interface IData {}

export default Vue.extend({
	components: { CloseIcon },
	props: {
		image: {
			type: String,
			required: true,
		},
		title: {
			type: String,
			required: true,
		},
		subtitle: {
			type: String,
			required: true,
		},
		excerpt: {
			type: String,
			required: true,
		},
	},
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
		postExcerpt(): string {
			const excerpt = this.excerpt.slice(0, 127).trim()
			if (excerpt.endsWith(`...`)) {
				return excerpt
			}
			if (excerpt.endsWith(`..`)) {
				return excerpt + `.`
			}
			if (excerpt.endsWith(`.`)) {
				return excerpt + `..`
			}
			return excerpt + `...`
		},
	},
})
</script>
