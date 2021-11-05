<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section style="width: 1220px" class="flex flex-row mt-20">
			<!-- Primary widget -->
			<article
				style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px)"
				class="
					overflow-y-auto
					rounded-lg
					shadow-lg
					mr-5
					p-6
					z-10
					bg-gradient-to-r
					from-lightBGStart
					to-lightBGStop
					backdrop-filter backdrop-blur-lg
				"
			>
				<button @click="handleClose">Close</button>
				Primary widget
			</article>
			<!-- Right side: side widgets -->
			<div class="fixed" style="margin-left: 780px; width: 450px">
				<article
					class="
						overflow-y-auto
						rounded-lg
						shadow-lg
						mr-5
						p-6
						z-10
						bg-gradient-to-r
						from-lightBGStart
						to-lightBGStop
						backdrop-filter backdrop-blur-lg
					"
				>
					Side widgets
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
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
		handleClose() {
			this.$emit(`close`)
		},
	},
})
</script>