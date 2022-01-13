<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="myAvatar" />
				</header>
				<h1 class="text-4xl font-bold text-red-500 text-center">{{ error['statusCode'] }}: {{ error['message'] }}</h1>
				<h6 class="text-xl text-center p-10">😰 We're so sorry... An error has occurred 😓</h6>
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
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
	},
	methods: {
		goBack() {
			this.$router.push(`/`)
		},
	},
})
</script>
