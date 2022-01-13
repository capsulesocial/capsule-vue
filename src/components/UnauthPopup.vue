<template>
	<div
		v-if="this.$store.state.settings.showUnauthPopup"
		class="fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-start bg-opacity-50 modal-animation"
	>
		<div
			class="card shadow-lg rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg p-6 pt-4 mt-12 overflow-y-auto card-animation"
			style="max-height: 90%; width: 650px; backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex justify-between items-center pb-6">
				<h1 class="text-4xl text-primary font-semibold">Who's there?</h1>
				<button class="p-1 bg-gray1 rounded-full focus:outline-none" @click="closePopup"><CloseIcon /></button>
			</div>
			<article class="text-center flex flex-col items-center">
				<img :src="require(`@/assets/images/brand/protect-content.webp`)" class="w-10/12 mb-5" />
				<h6 class="text-xl mb-5 font-bold">You need an account to do that</h6>
				<p class="text-gray5 mb-10 px-10">
					Create a Blogchain account to publish posts, follow your favorite content creators and personalise your
					Capsule
				</p>
				<!-- Next button -->
				<div class="mb-2">
					<BrandedButton
						:action="
							() => {
								$router.push(`/register`)
							}
						"
						:text="`Create an account 🚀`"
					/>
				</div>
			</article>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: {
		CloseIcon,
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
	},
	methods: {
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `card`) {
				this.closePopup()
			}
		},
		closePopup() {
			this.$store.commit(`settings/toggleUnauthPopup`)
		},
	},
})
</script>