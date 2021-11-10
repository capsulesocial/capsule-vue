<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section style="width: 1220px; margin-top: 11rem" class="flex flex-row">
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
				Primary widget
				<!-- Select a main widget -->
				<div class="grid grid-cols-3 gap-5">
					<button class="rounded-lg bg-gray1 h-48" @click="changePrimary(`feed`)">Post feed</button>
					<button class="rounded-lg bg-gray1 h-48" @click="changePrimary(`editor`)">Post editor</button>
				</div>
			</article>
			<!-- Right side: side widgets -->
			<div class="fixed" style="margin-left: 770px; width: 450px">
				<article
					class="
						overflow-y-auto
						rounded-lg
						shadow-lg
						mr-5
						mb-5
						p-6
						z-10
						bg-gradient-to-r
						from-lightBGStart
						to-lightBGStop
						backdrop-filter backdrop-blur-lg
					"
				>
					Side widgets
					<div class="grid grid-cols-2 gap-5">
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary2(`tags`)">Tags</button>
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary2(`followers`)">Followers</button>
					</div>
				</article>
				<article
					class="
						overflow-y-auto
						rounded-lg
						shadow-lg
						p-6
						z-10
						bg-gradient-to-r
						from-lightBGStart
						to-lightBGStop
						backdrop-filter backdrop-blur-lg
					"
				>
					Side widgets
					<div class="grid grid-cols-2 gap-5">
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary(`drafts`)">Drafts</button>
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary(`bookmarks`)">Bookmarks</button>
					</div>
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
		changePrimary(type: string): void {
			// Update draft on change from editor to new widget
			if (this.$store.state.widgets.primary === `editor` && type !== `editor`) {
				this.$emit(`save`)
			}
			this.$store.commit(`widgets/changePrimary`, type)
		},
		changeSecondary(type: string) {
			this.$store.commit(`widgets/changeSecondary`, type)
		},
		changeSecondary2(type: string) {
			this.$store.commit(`widgets/changeSecondary2`, type)
		},
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