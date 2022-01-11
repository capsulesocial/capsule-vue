<template>
	<div class="popup w-full flex justify-center">
		<!-- Container -->
		<section style="width: 1220px; margin-top: 10.5rem" class="flex flex-row">
			<!-- Primary widget -->
			<article
				style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px); backdrop-filter: blur(5px)"
				class="overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop card-animation"
			>
				<h3 class="text-primary text-base font-semibold mb-4">Primary widget</h3>
				<!-- Select a main widget -->
				<div class="grid grid-cols-3 gap-5">
					<button class="rounded-lg bg-gray1 h-64 focus:outline-none border-lightBorder" @click="changePrimary(`feed`)">
						<div class="flex flex-col items-center">
							<h4 class="text-gray5 mb-2">Post feed</h4>
							<div class="w-40 h-8 rounded-lg bg-primary my-2"></div>
							<div class="w-40 h-8 rounded-lg bg-primary mb-2"></div>
							<div class="w-40 h-8 rounded-lg bg-primary mb-2"></div>
							<CheckCircle
								:isChecked="$store.state.widgets.primary === `feed` ? true : false"
								class="w-6 h-6 mt-2 text-gray5"
							/>
						</div>
					</button>
					<button
						class="rounded-lg bg-gray1 h-64 focus:outline-none border-lightBorder"
						@click="changePrimary(`editor`)"
					>
						<div class="flex flex-col items-center">
							<h4 class="text-gray5">Draft Editor</h4>
							<div class="h-32 w-40">
								<span class="text-6xl text-primary font-semibold">Aa</span>
							</div>
							<CheckCircle
								:isChecked="$store.state.widgets.primary === `editor` ? true : false"
								class="w-6 h-6 text-gray5"
							/>
						</div>
					</button>
				</div>
			</article>
			<!-- Right side: side widgets -->
			<div class="fixed" style="margin-left: 770px; width: 453px">
				<article
					class="overflow-y-auto rounded-lg shadow-lg mb-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop card-animation-delay1"
					style="backdrop-filter: blur(5px)"
				>
					<h3 class="text-primary text-base font-semibold mb-4">Side widget</h3>
					<div class="grid grid-cols-2 gap-5">
						<button
							class="rounded-lg bg-gray1 p-4 focus:outline-none border-lightBorder"
							@click="changeSecondary2(`tags`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 mb-2">Tags</h4>
								<div class="w-32 h-8 my-2 flex items-center rounded-lg bg-primary">
									<span class="text-white pl-3">#</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary2 === `tags` ? true : false"
									class="w-6 h-6 mt-2 text-gray5"
								/>
							</div>
						</button>
						<button
							class="rounded-lg bg-gray1 p-4 focus:outline-none border-lightBorder"
							@click="changeSecondary2(`followers`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 mb-2">Followers</h4>
								<div class="w-32 h-8 my-2 flex items-center">
									<span class="w-8 h-8 bg-primary rounded-full flex-shrink-0 flex-grow-0"></span>
									<span class="w-full h-4 bg-gray4 rounded-full ml-2"></span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary2 === `followers` ? true : false"
									class="w-6 h-6 mt-2 text-gray5"
								/>
							</div>
						</button>
					</div>
				</article>
				<article
					class="overflow-y-auto rounded-lg shadow-lg p-6 pt-4 z-10 mb-5 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg card-animation-delay2"
					style="backdrop-filter: blur(5px)"
				>
					<h3 class="text-primary text-base font-semibold mb-4">Side widget</h3>
					<div class="grid grid-cols-2 gap-5">
						<button
							class="rounded-lg bg-gray1 p-4 focus:outline-none border-lightBorder"
							@click="changeSecondary(`drafts`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 mb-2">Drafts</h4>
								<div class="w-32 h-8 my-2 flex justify-center items-center">
									<span class="bg-primary rounded-lg p-2 text-white">
										<PencilIcon class="fill-current text-white" />
									</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary === `drafts` ? true : false"
									class="w-6 h-6 mt-2 text-gray5"
								/>
							</div>
						</button>
						<button
							class="rounded-lg bg-gray1 p-4 focus:outline-none border-lightBorder"
							@click="changeSecondary(`bookmarks`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 mb-2">Bookmarks</h4>
								<div class="w-32 h-8 my-2 flex justify-center items-center">
									<span class="bg-primary rounded-lg p-2 text-white">
										<BookmarksIcon class="fill-current text-white" />
									</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary === `bookmarks` ? true : false"
									class="w-6 h-6 mt-2 text-gray5"
								/>
							</div>
						</button>
					</div>
				</article>
				<div
					class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder mb-5 w-full focus:outline-none flex-row items-center flex card-animation-delay3"
					style="height: 60px; backdrop-filter: blur(10px)"
				>
					<div class="flex flex-row justify-between items-center px-6">
						<p class="text-gray5 text-sm">
							<span style="background: opacity 0.9em">Change background, theme and accessibilty:</span>
						</p>
						<nuxt-link to="/settings/styling" class="text-primary text-sm ml-2">
							<span style="background: opacity 0.9em">Styling settings</span>
						</nuxt-link>
					</div>
				</div>
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
