<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Display</h3>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-36 xl:w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="toggleBGSelector">
				<p class="mr-4">
					{{ this.profilebgImage.label }}
				</p>
				<img
					:src="$colorMode.dark ? profilebgImage.dark : profilebgImage.light"
					class="h-20 w-32 rounded-lg bg-lightBG dark:bg-darkBG border border-lightBorder"
				/>
			</button>
		</div>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Light Mode</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="toggleModeSelector">
				<p class="mr-4">{{ $store.state.settings.mode }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-lightBG dark:bg-darkBG"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-gray5 dark:bg-gray3"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-darkBG dark:bg-lightBG"></div>
			</button>
		</div>
		<div class="mb-8 flex w-full xl:w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold text-gray5 dark:text-gray3 text-sm">App Color Theme</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="toggleColorSelector">
				<p class="mr-4">{{ $store.state.settings.color }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-primary"></div>
			</button>
		</div>
		<!-- Popup background selector -->
		<div
			v-if="showPopupBG"
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center dark:bg-opacity-50 bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2">
					<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						Change your Blogchain background
					</h4>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="toggleBGSelector">
						<XIcon />
					</button>
				</div>
				<!-- Background grid -->
				<div class="grid grid-cols-1 lg:grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
					<button
						v-for="x of backgrounds"
						:key="x.label"
						class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
						@click="setBackgroundImage(x)"
					>
						<img
							v-if="selectedBG === x"
							:src="$colorMode.dark ? x.dark : x.light"
							class="border-primary h-44 w-64 rounded-lg border shadow-lg bg-lightBG dark:bg-darkBG"
						/>
						<img
							v-else
							:src="$colorMode.dark ? x.dark : x.light"
							class="border-lightBorder h-44 w-64 rounded-lg border shadow-lg bg-lightBG dark:bg-darkBG"
						/>
						<span class="mt-1 text-center" :class="selectedBG === x ? `text-primary` : `text-gray5 dark:text-gray3`">{{
							x.label
						}}</span>
					</button>
				</div>
				<!-- Select button -->
				<div class="flex items-center justify-end p-6 pt-5">
					<button class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white" @click="confirmBackgroundImage">
						Select
					</button>
				</div>
			</div>
		</div>
		<!-- Popup Mode selector -->
		<div
			v-if="showPopupMode"
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2 mb-4">
					<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						Change your Blogchain light mode
					</h4>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="toggleModeSelector">
						<XIcon />
					</button>
				</div>
				<!-- color mode grid -->
				<div class="flex flex-col lg:flex-row justify-between p-6 pt-4">
					<button
						v-for="x of modes"
						:key="x.label"
						class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
						@click="setColorMode(x.label)"
					>
						<img
							v-if="$store.state.settings.mode === x.label"
							:src="x.image"
							class="border-primary h-32 w-44 rounded-lg border shadow-lg"
						/>
						<img v-else :src="x.image" class="border-lightBorder h-32 w-44 rounded-lg border shadow-lg" />
						<span
							class="mt-1 text-center"
							:class="$store.state.settings.mode === x.label ? `text-primary` : `text-gray5 dark:text-gray3`"
							>{{ x.label }}</span
						>
					</button>
				</div>
				<!-- Select button -->
				<div class="flex items-center justify-end p-6 pt-5">
					<button class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white" @click="confirmColorMode">
						Select
					</button>
				</div>
			</div>
		</div>
		<!-- Popup Color selector -->
		<div
			v-if="showPopupColor"
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2 mb-4">
					<h4 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold">
						Change your Blogchain color theme
					</h4>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="toggleColorSelector">
						<XIcon />
					</button>
				</div>
				<!-- color grid -->
				<div class="flex flex-col lg:flex-row justify-between m-6 py-4 bg-lightInput dark:bg-darkInput rounded-lg">
					<button
						v-for="x of colors"
						:key="x.label"
						class="focus:outline-none flex flex-shrink-0 flex-col items-center w-1/5"
						@click="setColor(x.id)"
					>
						<div class="flex flex-col justify-center items-center">
							<Check v-if="$store.state.settings.color === x.id" class="text-lightBG h-4 w-4 absolute" />
							<div
								class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
								:style="`background-color:` + x.hex"
							></div>
						</div>
						<p
							class="mt-2"
							:class="$store.state.settings.color === x.id ? `text-primary` : `text-gray5 dark:text-gray3`"
						>
							{{ x.id }}
						</p>
					</button>
					<!-- <button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Orange`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #ff4747"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Blue`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #396bf8"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Pink`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #eb3d7c"
						></div>
					</button>
					<button class="focus:outline-none flex flex-shrink-0 flex-col items-center" @click="setColor(`Yellow`)">
						<div
							class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder"
							style="background-color: #ffcc33"
						></div>
					</button> -->
				</div>
				<!-- Select button -->
				<div class="flex items-center justify-end p-6 pt-5">
					<button class="bg-primary focus:outline-none rounded-lg px-4 py-2 text-white" @click="confirmColor">
						Select
					</button>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import XIcon from '@/components/icons/X.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import Check from '@/components/icons/Check.vue'

import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile, getProfile, Profile } from '@/backend/profile'
<<<<<<< HEAD
import { IBackground, backgrounds, modes, colors } from '@/config'
=======
import { colors } from '@/config/colors'
import { IBackground, backgrounds } from '@/config/backgrounds'
>>>>>>> 72c7a0d (feat: split the config directory)

interface IData {
	profile: Profile | null
	backgroundImage: null | string | ArrayBuffer
	showPopupBG: boolean
	showPopupMode: boolean
	showPopupColor: boolean
	backgrounds: any
	modes: any
	colors: any
	currentbg: null | string
	selectedBG: IBackground
	currentmode: null | string
	currentcolor: null | string
	profilebgImage: IBackground
}

export default Vue.extend({
	components: { XIcon, ChevronLeft, Check },
	layout: `settings`,
	data(): IData {
		return {
			profile: null,
			backgroundImage: null,
			showPopupBG: false,
			showPopupMode: false,
			showPopupColor: false,
			backgrounds,
			modes,
			colors,
			currentbg: null,
			selectedBG: backgrounds[0],
			currentmode: null,
			currentcolor: null,
			profilebgImage: backgrounds[0],
		}
	},
	head() {
		return {
			title: `Style settings - Blogchain`,
			meta: [{ hid: `settings-styling`, name: `settings-styling`, content: `Style settings on Blogchain` }],
		}
	},
	async created() {
		window.addEventListener(`click`, this.handleDropdownBG, false)
		window.addEventListener(`click`, this.handleDropdownMode, false)
		window.addEventListener(`click`, this.handleDropdownColor, false)
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.profilebgImage = this.$getBGImage(this.profile?.background, `local`)
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeBackground: MutationType.CHANGE_BACKGROUND,
			changeCID: MutationType.CHANGE_CID,
		}),
		toggleBGSelector() {
			this.$emit(`togglePopup`)
			this.showPopupBG = !this.showPopupBG
			if (this.showPopupBG === true) {
				this.currentbg = this.$store.state.backgroundImage
			}
			this.selectedBG = this.profilebgImage
		},
		toggleModeSelector() {
			this.$emit(`togglePopup`)
			this.showPopupMode = !this.showPopupMode
			if (this.showPopupMode === true) {
				this.currentmode = this.$store.state.settings.mode
			}
		},
		toggleColorSelector() {
			this.$emit(`togglePopup`)
			this.showPopupColor = !this.showPopupColor
			if (this.showPopupColor === true) {
				this.currentcolor = this.$store.state.settings.color
			}
		},
		handleDropdownBG(e: any): void {
			if (!this.showPopupBG) {
				return
			}
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList.contains(`popup`)) {
				this.toggleBGSelector()
			}
		},
		handleDropdownMode(e: any): void {
			if (!this.showPopupMode) {
				return
			}
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList.contains(`popup`)) {
				this.toggleModeSelector()
			}
		},
		handleDropdownColor(e: any): void {
			if (!this.showPopupColor) {
				return
			}
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList.contains(`popup`)) {
				this.toggleColorSelector()
			}
		},
		setBackgroundImage(image: IBackground): void {
			this.selectedBG = image
			this.$emit(`changeLocalBGImage`, this.selectedBG.id)
		},
		async confirmBackgroundImage() {
			this.profilebgImage = this.selectedBG
			try {
				// Update local profile store before saving new profile
				this.changeBackground(this.selectedBG.id)
				const backendProfile = getProfileFromSession(this.$store.state.session)
				const cid = await setProfile(backendProfile)
				this.changeCID(cid)
				this.$toastSuccess(`Your background has been updated`)
				this.toggleBGSelector()
				// location.reload()
				this.$emit(`initProfile`)
			} catch {
				throw new Error(`Failed at updateProfile (src/pages/settings/styling.vue)`)
			}
		},
		setColorMode(type: string): void {
			this.$store.commit(`settings/changeColorMode`, type)
			this.$setColorMode(this.$store.state.settings.mode)
		},
		confirmColorMode(): void {
			if (this.$store.state.settings.mode) {
				this.toggleModeSelector()
				if (this.currentmode !== this.$store.state.settings.mode) {
					this.$toastSuccess(`Your light mode has been updated`)
				}
			} else {
				this.$toastError(`Unable to save your light mode`)
			}
		},
		setColor(type: string): void {
			this.$store.commit(`settings/changeColor`, type)
			this.$setColor(this.$store.state.settings.color)
		},
		confirmColor(): void {
			if (this.$store.state.settings.color) {
				this.toggleColorSelector()
				if (this.currentcolor !== this.$store.state.settings.color) {
					this.$toastSuccess(`Your color theme has been updated`)
				}
			} else {
				this.$toastError(`Unable to save your color theme`)
			}
		},
	},
})
</script>
