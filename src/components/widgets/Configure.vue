<template>
	<div class="popup flex flex-col items-center w-full justify-center">
		<button class="bg-gray1 dark:bg-gray5 focus:outline-none m-6 mt-28 rounded-full p-1" @click="handleClose">
			<XIcon />
		</button>
		<!-- Container -->
		<section class="flex w-full lg:w-11/12 xl:w-10/12 flex-row max-w-1220">
			<!-- Primary widget -->
			<article
				style="min-height: calc(100vh - 140px); height: calc(100vh - 140px); backdrop-filter: blur(5px)"
				class="lg:w-7.5 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg"
			>
				<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Primary widget</h3>
				<!-- Select a main widget -->
				<div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-5">
					<button
						class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder h-64 rounded-lg"
						@click="changePrimary(`feed`)"
					>
						<div class="flex flex-col items-center">
							<h4 class="text-gray5 dark:text-gray3 mb-2">Post feed</h4>
							<div class="bg-darkBG my-2 h-8 w-40 rounded-lg"></div>
							<div class="bg-darkBG mb-2 h-8 w-40 rounded-lg"></div>
							<div class="bg-darkBG mb-2 h-8 w-40 rounded-lg"></div>
							<CheckCircle
								:isChecked="$store.state.widgets.primary === `feed` ? true : false"
								class="text-primary mt-2 h-6 w-6"
							/>
						</div>
					</button>
					<button
						class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder h-64 rounded-lg"
						@click="changePrimary(`editor`)"
					>
						<div class="flex flex-col items-center">
							<h4 class="text-gray5 dark:text-gray3">Draft Editor</h4>
							<div class="h-32 w-40 flex items-center justify-center">
								<span class="text-lightPrimaryText text-6xl font-semibold">Aa</span>
							</div>
							<CheckCircle
								:isChecked="$store.state.widgets.primary === `editor` ? true : false"
								class="text-primary h-6 w-6"
							/>
						</div>
					</button>
				</div>
			</article>
			<!-- Right side: side widgets -->
			<div class="w-5/12 -mr-5 -mt-4 hidden overflow-y-auto p-4 lg:block">
				<article
					class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation-delay1 z-10 mb-5 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg"
					style="backdrop-filter: blur(5px)"
				>
					<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Side widget</h3>
					<div class="grid grid-cols-2 gap-5">
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
							@click="changeSecondary2(`tags`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3 mb-2">Tags</h4>
								<div class="bg-darkBG my-2 flex h-8 w-32 items-center rounded-lg">
									<span class="pl-3 text-darkPrimaryText">#</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary2 === `tags` ? true : false"
									class="text-primary mt-2 h-6 w-6"
								/>
							</div>
						</button>
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
							@click="changeSecondary2(`followers`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3 mb-2">Followers</h4>
								<div class="my-2 flex h-8 w-32 items-center">
									<span class="bg-darkBG h-8 w-8 flex-shrink-0 flex-grow-0 rounded-full"></span>
									<span class="bg-gray5 dark:bg-gray3 ml-2 h-4 w-full rounded-full"></span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary2 === `followers` ? true : false"
									class="text-primary mt-2 h-6 w-6"
								/>
							</div>
						</button>
					</div>
				</article>
				<article
					class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation-delay2 z-10 mb-5 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg backdrop-blur-lg backdrop-filter"
					style="backdrop-filter: blur(5px)"
				>
					<h3 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 text-base font-semibold">Side widget</h3>
					<div class="grid grid-cols-2 gap-5">
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
							@click="changeSecondary(`drafts`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3 mb-2">Drafts</h4>
								<div class="my-2 flex h-8 w-32 items-center justify-center">
									<span class="bg-darkBG rounded-lg p-2 text-darkPrimaryText">
										<PencilIcon class="fill-current text-darkPrimaryText" />
									</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary === `drafts` ? true : false"
									class="text-primary mt-2 h-6 w-6"
								/>
							</div>
						</button>
						<button
							class="bg-gray1 dark:bg-gray7 focus:outline-none border-lightBorder rounded-lg p-4"
							@click="changeSecondary(`bookmarks`)"
						>
							<div class="flex flex-col items-center">
								<h4 class="text-gray5 dark:text-gray3 mb-2">Bookmarks</h4>
								<div class="my-2 flex h-8 w-32 items-center justify-center">
									<span class="bg-darkBG rounded-lg p-2 text-darkPrimaryText">
										<BookmarksIcon class="fill-current text-darkPrimaryText" />
									</span>
								</div>
								<CheckCircle
									:isChecked="$store.state.widgets.secondary === `bookmarks` ? true : false"
									class="text-primary mt-2 h-6 w-6"
								/>
							</div>
						</button>
					</div>
				</article>
				<div
					class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder focus:outline-none card-animation-delay3 mb-5 flex w-full flex-row items-center rounded-lg border bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
					style="height: 60px; backdrop-filter: blur(10px)"
				>
					<div class="flex flex-col xl:flex-row items-start justify-between px-6">
						<p class="text-gray5 dark:text-gray3 text-sm">
							<span style="background: opacity 0.9em">Change background, theme and accessibilty:</span>
						</p>
						<nuxt-link to="/settings/styling" class="text-primary xl:ml-2 text-sm">
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
import XIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: {
		CheckCircle,
		PencilIcon,
		BookmarksIcon,
		XIcon,
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
