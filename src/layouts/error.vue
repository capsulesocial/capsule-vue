<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
		:style="
			$colorMode.dark
				? {
						backgroundImage: `url(` + bgImage.dark + `)`,
				  }
				: {
						backgroundImage: `url(` + bgImage.light + `)`,
				  }
		"
	>
		<div class="flex w-full justify-center">
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
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
import BrandedButton from '@/components/BrandedButton.vue'
import Header from '@/components/Header.vue'
import { IBackground, backgrounds } from '@/config/backgrounds'

interface IData {
	bgImage: IBackground
}

export default Vue.extend({
	components: {
		BrandedButton,
		Header,
	},
	middleware: `auth`,
	props: {
		error: {
			type: Object,
			default: null,
		},
	},
	data(): IData {
		return {
			bgImage: backgrounds[0],
		}
	},
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
	},
	methods: {
		goBack() {
			this.$router.push(`/`)
		},
	},
})
</script>
