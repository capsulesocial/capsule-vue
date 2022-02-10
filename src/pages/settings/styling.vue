<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-4 flex items-center xl:hidden">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">All Settings</h6>
		</nuxt-link>
		<h2 class="text-primary dark:text-secondary mb-4 text-sm font-semibold">Display</h2>
		<div class="mb-6 flex w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold dark:text-darkPrimaryText">App Background</h3>
			<button
				class="text-primary dark:text-secondary focus:outline-none flex flex-row items-center"
				@click="toggleBGSelector"
			>
				<p class="mr-4">
					{{
						$store.state.backgroundImage
							.substring($store.state.backgroundImage.lastIndexOf('/') + 1)
							.replace(`.webp`, '')
					}}
				</p>
				<img :src="$store.state.backgroundImage" class="h-20 w-32 rounded-lg border border-lightBorder" />
			</button>
		</div>
		<div class="mb-6 flex w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold dark:text-darkPrimaryText">App Color Theme</h3>
			<button
				class="text-primary dark:text-secondary focus:outline-none flex flex-row items-center"
				@click="toggleColorSelector"
			>
				<p class="mr-4">{{ $store.state.settings.darkMode }}</p>
				<div class="h-8 w-8 shadow-lg rounded-3xl border border-lightBorder bg-lightBG dark:bg-darkBG"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-primary dark:bg-secondary"></div>
				<div class="h-8 w-8 -ml-2 shadow-lg rounded-3xl border border-lightBorder bg-secondary dark:bg-gray3"></div>
			</button>
		</div>
		<!-- Popup background selector -->
		<div
			v-if="showPopupBG"
			class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center dark:bg-opacity-50 bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2">
					<h4 class="text-primary dark:text-secondary mb-4 text-xl font-semibold">Change your Capsule background</h4>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="toggleBGSelector">
						<XIcon />
					</button>
				</div>
				<!-- Background grid -->
				<div class="grid grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
					<button
						v-for="x of backgrounds"
						:key="x.label"
						class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
						@click="setBackgroundImage(x.id)"
					>
						<img
							v-if="$store.state.backgroundImage === x.image"
							:src="x.image"
							class="border-primary dark:border-secondary h-44 w-64 rounded-lg border shadow-lg bg-lightBG"
						/>
						<img v-else :src="x.image" class="border-lightBorder h-44 w-64 rounded-lg border shadow-lg bg-lightBG" />
						<span class="text-primary dark:text-secondary mt-1 text-center">{{ x.label }}</span>
					</button>
				</div>
				<!-- Select button -->
				<div class="flex items-center justify-end p-6 pt-5">
					<button
						class="bg-primary dark:bg-secondary focus:outline-none rounded-lg px-4 py-2 text-white"
						@click="confirmBackgroundImage"
					>
						Select
					</button>
				</div>
			</div>
		</div>
		<!-- Popup Color selector -->
		<div
			v-if="showPopupColor"
			class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2">
					<h4 class="text-primary dark:text-secondary mb-4 text-xl font-semibold">Change your Capsule color theme</h4>
					<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="toggleColorSelector">
						<XIcon />
					</button>
				</div>
				<!-- Background grid -->
				<div class="flex flex-row justify-between p-6 pt-4">
					<button
						v-for="x of colors"
						:key="x.label"
						class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
						@click="setColorMode(x.label)"
					>
						<img
							v-if="$store.state.settings.darkMode === x.label"
							:src="x.image"
							class="border-primary dark:border-secondary h-32 w-44 rounded-lg border shadow-lg"
						/>
						<img v-else :src="x.image" class="border-lightBorder h-32 w-44 rounded-lg border shadow-lg" />
						<span class="text-primary dark:text-secondary mt-1 text-center">{{ x.label }}</span>
					</button>
				</div>
				<!-- Select button -->
				<div class="flex items-center justify-end p-6 pt-5">
					<button
						class="bg-primary dark:bg-secondary focus:outline-none rounded-lg px-4 py-2 text-white"
						@click="confirmColorMode"
					>
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

import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile } from '@/backend/profile'
import { backgrounds, colors } from '@/config'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	showPopupBG: boolean
	showPopupColor: boolean
	backgrounds: any
	colors: any
	currentbg: null | string
	selectedBG: string
	currentcolor: null | string
}

export default Vue.extend({
	components: { XIcon, ChevronLeft },
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			showPopupBG: false,
			showPopupColor: false,
			backgrounds,
			colors,
			currentbg: null,
			selectedBG: `default`,
			currentcolor: null,
		}
	},
	head() {
		return {
			title: `Style settings - Capsule Social`,
			meta: [{ hid: `settings-styling`, name: `settings-styling`, content: `Style settings on Capsule Social` }],
		}
	},
	created() {
		window.addEventListener(`click`, this.handleDropdown, false)
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
		},
		toggleColorSelector() {
			this.$emit(`togglePopup`)
			this.showPopupColor = !this.showPopupColor
			if (this.showPopupColor === true) {
				this.currentcolor = this.$store.state.settings.darkMode
			}
		},
		handleDropdown(e: any): void {
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
		setBackgroundImage(id: string): void {
			this.selectedBG = id
			this.$emit(`changeLocalBGImage`, this.selectedBG)
		},
		async confirmBackgroundImage() {
			try {
				// Update local profile store before saving new profile
				this.changeBackground(this.selectedBG)
				const backendProfile = getProfileFromSession(this.$store.state.session)
				const cid = await setProfile(backendProfile)
				this.changeCID(cid)
				this.$toastSuccess(`Background changed!`)
				this.toggleBGSelector()
				// location.reload()
				this.$emit(`initProfile`)
			} catch {
				throw new Error(`Failed at updateProfile (src/pages/settings/styling.vue)`)
			}
		},
		setColorMode(type: string): void {
			this.$store.commit(`settings/changeDarkMode`, type)
			this.$setColorMode(this.$store.state.settings.darkMode)
		},
		confirmColorMode(): void {
			if (this.$store.state.settings.darkMode) {
				this.toggleColorSelector()
				if (this.currentcolor !== this.$store.state.settings.darkMode) {
					this.$toastSuccess(`Your color theme has been updated`)
				}
			} else {
				this.$toastError(`Unable to save your color theme`)
			}
		},
	},
})
</script>
