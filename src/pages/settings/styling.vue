<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-4 block flex items-center xl:hidden">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">All Settings</h6>
		</nuxt-link>
		<h2 class="text-primary mb-4 text-sm font-semibold">Display</h2>
		<div class="mb-4 flex w-4/5 items-center justify-between">
			<h3 class="w-56 font-semibold">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="toggleSelector">
				<img :src="$store.state.backgroundImage" class="h-20 w-32 rounded-lg border-2" />
				<p class="ml-4">Change</p>
			</button>
		</div>
		<!-- Popup background selector -->
		<div
			v-if="showPopup"
			class="popup bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup from-lightBGStart to-lightBGStop border-lightBorder card-animation rounded-lg bg-gradient-to-r shadow-lg"
			>
				<!-- Header and close icon -->
				<div class="flex items-center justify-between p-6 pb-2">
					<h4 class="text-primary mb-4 text-xl font-semibold">Change your Capsule background</h4>
					<button class="bg-gray1 focus:outline-none rounded-full p-1" @click="toggleSelector"><XIcon /></button>
				</div>
				<!-- Background grid -->
				<div class="grid grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
					<button
						v-for="x of backgrounds"
						:key="x.label"
						class="focus:outline-none mb-4 flex flex-shrink-0 flex-col items-center"
						@click="setBackgroundImage(x.image)"
					>
						<img
							v-if="$store.state.backgroundImage === x.image"
							:src="x.image"
							class="border-primary h-44 w-64 rounded-lg border shadow-lg"
						/>
						<img v-else :src="x.image" class="border-gray1 h-44 w-64 rounded-lg border shadow-lg" />
						<span class="text-primary mt-1 text-center">{{ x.label }}</span>
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
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import XIcon from '@/components/icons/X.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'

import { backgrounds } from '@/config'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	showPopup: boolean
	backgrounds: any
	currentbg: null | string
}

export default Vue.extend({
	components: { XIcon, ChevronLeft },
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			showPopup: false,
			backgrounds,
			currentbg: null,
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
		toggleSelector() {
			this.$emit(`togglePopup`)
			this.showPopup = !this.showPopup
			if (this.showPopup === true) {
				this.currentbg = this.$store.state.backgroundImage
			}
		},
		handleDropdown(e: any): void {
			if (!this.showPopup) {
				return
			}
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList.contains(`popup`)) {
				this.toggleSelector()
			}
		},
		setBackgroundImage(img: string | ArrayBuffer): void {
			this.$store.commit(`changeBackgroundImage`, img)
		},
		confirmBackgroundImage(): void {
			if (this.$store.state.backgroundImage) {
				this.toggleSelector()
				if (this.currentbg !== this.$store.state.backgroundImage) {
					this.$toastSuccess(`Your background has been updated`)
				}
			} else {
				this.$toastError(`Unable to save your new background`)
			}
		},
	},
})
</script>
