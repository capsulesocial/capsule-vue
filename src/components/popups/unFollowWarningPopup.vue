<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section>
			<div
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 mr-5 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						You are still subscribed
					</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div class="flex items-start">
					<div class="mt-4">
						<InfoIcon class="mr-4 h-8 w-8 text-gray5 dark:text-gray3" />
					</div>
					<p class="my-4 text-gray5 dark:text-gray3">
						You unfollowed an author you are subscribed to. You will not see his posts on your home feed anymore.<br />
						If you want to cancel your subscription to this author, go to the
						<nuxt-link to="/subscriptions" class="text-primary focus:outline-none mr-6" @click="$emit(`close`)"
							>subscription page</nuxt-link
						>
					</p>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import InfoIcon from '@/components/icons/Info.vue'
import CloseIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: { CloseIcon, InfoIcon },
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