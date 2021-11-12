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
					<button class="rounded-lg bg-gray1 h-64" @click="changePrimary(`feed`)">
						<div class="flex flex-col items-center">
							<h4 class="text-gray7">Feed</h4>
							<div class="w-40 h-8 rounded-lg bg-primary my-2"></div>
							<div class="w-40 h-8 rounded-lg bg-primary mb-2"></div>
							<div class="w-40 h-8 rounded-lg bg-primary mb-2"></div>
							<CheckCircle :isChecked="$store.state.widgets.primary === `feed` ? true : false" class="w-6 h-6" />
						</div>
					</button>
					<button class="rounded-lg bg-gray1 h-64" @click="changePrimary(`editor`)">
						<div class="flex flex-col items-center">
							<h4 class="text-gray7">Editor</h4>
							<div class="h-32 w-40">
								<span class="text-6xl text-primary font-semibold">Aa</span>
							</div>
							<CheckCircle :isChecked="$store.state.widgets.primary === `editor` ? true : false" class="w-6 h-6" />
						</div>
					</button>
				</div>
			</article>
			<!-- Right side: side widgets -->
			<div class="fixed" style="margin-left: 770px; width: 450px">
				<article
					class="
						overflow-y-auto
						rounded-lg
						shadow-lg
						mb-5
						p-6
						z-10
						bg-gradient-to-r
						from-lightBGStart
						to-lightBGStop
						backdrop-filter backdrop-blur-lg
					"
				>
					Side widget
					<div class="grid grid-cols-2 gap-5">
						<button class="rounded-lg bg-gray1" @click="changeSecondary2(`tags`)">
							<div class="flex flex-col items-center">
								<h4 class="text-gray7">Tags</h4>
								<div class="w-32 h-8 my-2 flex items-center rounded-lg bg-primary">
									<span class="text-white pl-3">#</span>
								</div>
								<CheckCircle :isChecked="$store.state.widgets.secondary2 === `tags` ? true : false" class="w-6 h-6" />
							</div>
						</button>
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary2(`followers`)">
							<div class="flex flex-col items-center">
								<h4 class="text-gray7">Followers</h4>
								<div class="w-32 h-8 my-2 flex items-center">
									<span class="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex-grow-0"></span>
									<span class="w-full h-4 bg-gray4 rounded-full ml-2"></span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary2 === `followers` ? true : false"
									class="w-6 h-6"
								/>
							</div>
						</button>
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
					Side widget
					<div class="grid grid-cols-2 gap-5">
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary(`drafts`)">
							<div class="flex flex-col items-center">
								<h4 class="text-gray7">Drafts</h4>
								<div class="w-32 h-8 my-2 flex justify-center items-center">
									<span class="bg-primary rounded-lg p-2 text-white">
										<PencilIcon class="fill-current" />
									</span>
								</div>
								<CheckCircle :isChecked="$store.state.widgets.secondary === `drafts` ? true : false" class="w-6 h-6" />
							</div>
						</button>
						<button class="rounded-lg bg-gray1 h-32" @click="changeSecondary(`bookmarks`)">
							<div class="flex flex-col items-center">
								<h4 class="text-gray7">Bookmarks</h4>
								<div class="w-32 h-8 my-2 flex justify-center items-center">
									<span class="bg-primary rounded-lg p-2 text-white">
										<BookmarksIcon class="fill-current text-white" />
									</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary === `bookmarks` ? true : false"
									class="w-6 h-6"
								/>
							</div>
						</button>
					</div>
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CheckCircle from '@/components/icons/CheckCircle.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import BookmarksIcon from '@/components/icons/Bookmarks.vue'

export default Vue.extend({
	components: {
		CheckCircle,
		PencilIcon,
		BookmarksIcon,
	},
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