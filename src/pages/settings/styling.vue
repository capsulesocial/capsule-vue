<template>
	<main>
		<h2 class="text-primary font-semibold mb-4 text-sm">Display</h2>
		<div class="flex mb-4 justify-between">
			<h3 class="w-56 font-semibold">App Background</h3>
			<button class="text-primary focus:outline-none" @click="toggleSelector">
				<img :src="$store.state.backgroundImage" class="w-32 h-24 rounded-lg border-2" />
				Choose
			</button>
		</div>
		<!-- Popup background selector -->
		<div
			v-if="showPopup"
			class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center items-start bg-opacity-50 modal-animation"
		>
			<!-- Inner space -->
			<div
				style="width: 750px"
				class="popup rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder"
			>
				<!-- Header and close icon -->
				<div class="flex justify-between items-center p-6">
					<h4 class="text-xl font-semibold text-primary mb-4">Change your Capsule background</h4>
					<button class="rounded-full bg-gray1 p-1 focus:outline-none" @click="toggleSelector"><XIcon /></button>
				</div>
				<!-- Background grid -->
				<div class="grid grid-cols-2 gap-1 overflow-y-scroll py-6" style="height: 600px">
					<button
						v-for="x of backgrounds"
						:key="x.label"
						class="flex flex-col flex-shrink-0 items-center focus:outline-none"
						@click="setBackgroundImage(x.image)"
					>
						<img :src="x.image" class="rounded-lg w-64 h-48 border border-gray1" />
						<span class="text-center text-primary">{{ x.label }}</span>
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
}

export default Vue.extend({
	components: { XIcon },
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			showPopup: false,
			backgrounds,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	methods: {
		toggleSelector() {
			this.$emit(`togglePopup`)
			this.showPopup = !this.showPopup
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
	},
})
</script>
