<template>
	<main>
		<h2 class="text-primary font-semibold mb-4 text-sm">Display</h2>
		<div class="flex mb-4 justify-between items-center w-4/5">
			<h3 class="w-56 font-semibold">App Background</h3>
			<button class="text-primary focus:outline-none flex flex-row items-center" @click="toggleSelector">
				<img :src="$store.state.backgroundImage" class="w-32 h-20 rounded-lg border-2" />
				<p class="ml-4">Change</p>
			</button>
		</div>
		<!-- Popup background selector -->
		<div
			v-if="showPopup"
			class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-opacity-50 modal-animation"
		>
			<!-- Inner space -->
			<div
				style="width: 650px; backdrop-filter: blur(10px)"
				class="popup rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder card-animation"
			>
				<!-- Header and close icon -->
				<div class="flex justify-between items-center p-6 pb-2">
					<h4 class="text-xl font-semibold text-primary mb-4">Change your Capsule background</h4>
					<button class="rounded-full bg-gray1 p-1 focus:outline-none" @click="toggleSelector"><XIcon /></button>
				</div>
				<!-- Background grid -->
				<div class="grid grid-cols-2 gap-1 overflow-y-scroll p-6 pt-4" style="height: 500px">
					<button
						v-for="x of backgrounds"
						:key="x.label"
						class="flex flex-col flex-shrink-0 items-center focus:outline-none mb-4"
						@click="setBackgroundImage(x.image)"
					>
						<img
							v-if="$store.state.backgroundImage === x.image"
							:src="x.image"
							class="rounded-lg w-64 h-44 border border-primary shadow-lg"
						/>
						<img v-else :src="x.image" class="rounded-lg w-64 h-44 border border-gray1 shadow-lg" />
						<span class="text-center text-primary mt-1">{{ x.label }}</span>
					</button>
				</div>
				<!-- Select button -->
				<div class="flex justify-end items-center p-6 pt-5">
					<button class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2" @click="confirmBackgroundImage">
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

import { backgrounds } from '@/config'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	showPopup: boolean
	backgrounds: any
	currentbg: null | string
}

export default Vue.extend({
	components: { XIcon },
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			showPopup: false,
			backgrounds,
			currentbg: null,
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
