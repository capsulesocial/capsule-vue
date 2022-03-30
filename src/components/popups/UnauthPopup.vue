<template>
	<div
		v-if="this.$store.state.settings.showUnauthPopup && this.$store.state.session.id === ``"
		class="bg-darkBG dark:bg-gray7 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-start justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popupCard from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation mt-12 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-4 shadow-lg backdrop-blur-lg backdrop-filter"
			style="max-height: 90%; width: 650px; backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Who's there?</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="closePopup">
					<CloseIcon />
				</button>
			</div>
			<article class="flex flex-col items-center text-center">
				<img :src="require(`@/assets/images/brand/protect-content.webp`)" class="mb-5 w-10/12" />
				<h6 class="mb-5 text-xl font-bold text-lightPrimaryText dark:text-darkPrimaryText">
					You need an account to do that
				</h6>
				<p class="text-gray5 dark:text-gray3 mb-10 px-10">
					Create a Blogchain account to publish posts, follow your favorite content creators and personalise your
					Blogchain
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
				<p class="text-gray7 dark:text-gray3 mt-2 mb-4 text-center text-sm">
					Already have an account?
					<nuxt-link to="/login" class="text-primary dark:text-secondary text-center font-bold">Log in</nuxt-link>
				</p>
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
	methods: {
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popupCard`) {
				this.closePopup()
			}
		},
		closePopup() {
			this.$store.commit(`settings/toggleUnauthPopup`, false)
		},
	},
})
</script>
