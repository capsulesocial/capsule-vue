<template>
	<portal to="bioPopup" class="popup">
		<div
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<!-- Container -->
			<div
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 v-if="authorname !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						{{ authorname }}'s bio
					</h2>
					<h2 v-else class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						@{{ authorID }}'s bio
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click.prevent="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<article>
					<div class="text-gray5 dark:text-gray3 my-5 text-sm">
						<p v-for="(line, lineNumber) of bio.split('\n')" :key="lineNumber">{{ line }}</p>
					</div>
				</article>
			</div>
		</div>
	</portal>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: { CloseIcon },
	props: {
		bio: {
			type: String,
			required: true,
		},
		authorname: {
			type: String,
			required: true,
		},
		authorID: {
			type: String,
			required: true,
		},
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
				this.$emit(`close`)
			}
		},
	},
})
</script>
<style></style>
