<template>
	<main
		ref="main"
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="
			dark
				? {
						backgroundImage: `url(` + bgImage.dark + `)`,
				  }
				: {
						backgroundImage: `url(` + bgImage.light + `)`,
				  }
		"
	>
		<div class="flex w-full justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<h1 class="text-center text-4xl font-bold text-red-500">{{ error['statusCode'] }}: {{ error['message'] }}</h1>
				<h6 class="p-10 text-center text-xl">An error has occurred</h6>
				<div class="flex justify-center">
					<BrandedButton text="Return" :action="goBack" class="w-64" />
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { disableBodyScroll } from 'body-scroll-lock'
import BrandedButton from '@/components/BrandedButton.vue'
import Header from '@/components/Header.vue'
import { IBackground, backgrounds } from '@/config'

interface IData {
	bgImage: IBackground
	dark: boolean
}

export default Vue.extend({
	components: {
		BrandedButton,
		Header,
	},
	layout: `error`,
	props: {
		error: {
			type: Object,
			default: null,
		},
	},
	data(): IData {
		return {
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
	},
	mounted() {
		// Lock background
		const mainOverlay = this.$refs.main as HTMLElement
		disableBodyScroll(mainOverlay)
	},
	methods: {
		goBack() {
			this.$router.push(`/`)
		},
	},
})
</script>
