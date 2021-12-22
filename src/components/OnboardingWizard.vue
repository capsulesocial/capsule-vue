<template>
	<section
		class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-start bg-opacity-50"
	>
		<div
			class="popup shadow-lg rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg p-6 pt-4 mt-12"
			style="width: 650px; backdrop-filter: blur(10px)"
		>
			<!-- Header and close icon -->
			<div class="flex justify-between items-center pb-6">
				<h1 class="text-4xl text-primary font-semibold">Welcome!</h1>
				<button class="p-1 bg-gray1 rounded-full focus:outline-none" @click="closeWizard"><CloseIcon /></button>
			</div>
			<!-- Slide 1 -->
			<article class="text-center flex flex-col items-center">
				<img
					v-show="step === 0"
					:src="require(`@/assets/images/onboarding/slide1.gif`)"
					class="rounded-lg mb-10 w-5/6 shadow-lg"
				/>
				<img
					v-show="step === 1"
					:src="require(`@/assets/images/onboarding/slide2.gif`)"
					class="rounded-lg mb-10 w-5/6 shadow-lg"
				/>
				<img
					v-show="step === 2"
					:src="require(`@/assets/images/onboarding/slide3.gif`)"
					class="rounded-lg mb-10 w-5/6 shadow-lg"
				/>
				<img
					v-show="step === 3"
					:src="require(`@/assets/images/onboarding/slide4.gif`)"
					class="rounded-lg mb-10 w-5/6 shadow-lg"
				/>
				<img
					v-show="step === 4"
					:src="require(`@/assets/images/onboarding/slide5.gif`)"
					class="rounded-lg mb-10 w-5/6 shadow-lg"
				/>
				<h6 class="text-xl mb-5 font-bold">{{ getTitle() }}</h6>
				<p class="text-gray5 mb-10 px-10">
					{{ getText() }}
				</p>
				<!-- progress circles -->
				<div class="self-center mb-10">
					<button class="p-1 mx-1 bg-primary rounded-full focus:outline-none" @click="setStep(0)"></button>
					<button
						:class="step > 0 ? `bg-primary` : `bg-gray1`"
						class="p-1 mx-1 rounded-full focus:outline-none"
						@click="setStep(1)"
					></button>
					<button
						:class="step > 1 ? `bg-primary` : `bg-gray1`"
						class="p-1 mx-1 rounded-full focus:outline-none"
						@click="setStep(2)"
					></button>
					<button
						:class="step > 2 ? `bg-primary` : `bg-gray1`"
						class="p-1 mx-1 rounded-full focus:outline-none"
						@click="setStep(3)"
					></button>
					<button
						:class="step > 3 ? `bg-primary` : `bg-gray1`"
						class="p-1 mx-1 rounded-full focus:outline-none"
						@click="setStep(4)"
					></button>
				</div>
				<!-- Next button -->
				<div v-if="step === 4" class="mb-2">
					<BrandedButton
						:action="
							() => {
								setStep(step + 1)
							}
						"
						:text="`Let's start! 🚀`"
					/>
				</div>
				<div v-else class="mb-2">
					<BrandedButton
						:action="
							() => {
								setStep(step + 1)
							}
						"
						:text="`Next`"
					/>
				</div>
			</article>
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'
import BrandedButton from '@/components/BrandedButton.vue'

interface IData {
	step: number
}

export default Vue.extend({
	components: {
		CloseIcon,
		BrandedButton,
	},
	data(): IData {
		return {
			step: 0,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
	},
	methods: {
		setStep(i: number | null) {
			i === null ? (this.step = this.step + 1) : (this.step = i)
			if (this.step >= 5) {
				this.closeWizard()
			}
		},
		getTitle(): string {
			switch (this.step) {
				case 0:
					return `Customize your homepage`
				case 1:
					return `Browse Capsule`
				case 2:
					return `Bookmarks`
				case 3:
					return `Create content`
				case 4:
					return `React easily`
				default:
					return `out of scope`
			}
		},
		getText(): string {
			switch (this.step) {
				case 0:
					return `Welcome to your Capsule, customize it as you want it to be. With quick access to your favorite decentralized content!`
				case 1:
					return `Browse new content on the Discover page with categories search, featured tags and trending topics`
				case 2:
					return `Bookmark your favorite content to read them later and share them to your Capsule network`
				case 3:
					return `Use the super simple Capsule editor to create new post and share your though on the decentralized network`
				case 4:
					return `Share your thoughts with advanced reactions in comments to really give you opinion that matter`
				default:
					return `out of scope`
			}
		},
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.closeWizard()
			}
		},
		closeWizard(): void {
			this.$store.commit(`setWelcome`, false)
		},
	},
})
</script>
