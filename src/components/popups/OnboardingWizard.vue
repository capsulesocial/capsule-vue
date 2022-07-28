<template>
	<section
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<div
			class="popup w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
		>
			<!-- Header and close icon -->
			<div class="flex items-center justify-between pb-6">
				<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-4xl font-semibold">Welcome!</h1>
				<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="closeWizard">
					<CloseIcon />
				</button>
			</div>
			<!-- Slide 1 -->
			<article class="flex flex-col items-center text-center">
				<nuxt-img
					v-show="step === 0"
					loading="lazy"
					src="/images/onboarding/slide1.webp"
					class="mb-10 w-4/6 rounded-lg shadow-lg"
				/>
				<nuxt-img
					v-show="step === 1"
					loading="lazy"
					src="/images/onboarding/slide2.webp"
					class="mb-10 w-4/6 rounded-lg shadow-lg"
				/>
				<nuxt-img
					v-show="step === 2"
					loading="lazy"
					src="/images/onboarding/slide3.webp"
					class="mb-10 w-4/6 rounded-lg shadow-lg"
				/>
				<nuxt-img
					v-show="step === 3"
					loading="lazy"
					src="/images/onboarding/slide4.webp"
					class="mb-10 w-4/6 rounded-lg shadow-lg"
				/>
				<nuxt-img
					v-show="step === 4"
					loading="lazy"
					src="/images/onboarding/slide5.webp"
					class="mb-10 w-4/6 rounded-lg shadow-lg"
				/>
				<h6 class="mb-5 text-xl font-bold dark:text-darkPrimaryText">{{ getTitle() }}</h6>
				<EditProfile
					v-if="this.$route.name != `help` && step === 5"
					ref="settings"
					:updateProfileMethod="getMyProfile"
					class="mb-4"
				/>
				<p class="text-gray5 dark:text-gray3 mb-10 px-10">
					{{ getText() }}
				</p>
				<!-- progress circles -->
				<div class="mb-10 self-center">
					<button class="bg-primary focus:outline-none mx-1 rounded-full p-1" @click="setStep(0)"></button>
					<button
						:class="step > 0 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="setStep(1)"
					></button>
					<button
						:class="step > 1 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="setStep(2)"
					></button>
					<button
						:class="step > 2 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="setStep(3)"
					></button>
					<button
						:class="step > 3 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="setStep(4)"
					></button>
					<button
						v-if="this.$route.name != `help`"
						:class="step > 4 ? `bg-primary` : `bg-gray3`"
						class="focus:outline-none mx-1 rounded-full p-1"
						@click="setStep(5)"
					></button>
				</div>
				<!-- Next button -->
				<div v-if="(this.$route.name === `help` && step === 4) || step === 5" class="mb-2">
					<BrandedButton
						:action="
							() => {
								handleSettings()
								closeWizard()
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
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import CloseIcon from '@/components/icons/X.vue'
import BrandedButton from '@/components/BrandedButton.vue'

interface IData {
	step: number
	myProfile: Profile
	myAvatar: string | ArrayBuffer | null
	myFollowing: Set<string>
	visitProfile: Profile
	visitAvatar: string | ArrayBuffer | null
}

export default Vue.extend({
	components: {
		CloseIcon,
		BrandedButton,
		EditProfile: () => import(`@/components/popups/Settings.vue`),
	},
	data(): IData {
		return {
			step: 0,
			myProfile: createDefaultProfile(this.$store.state.session.id),
			myAvatar: null,
			myFollowing: new Set(),
			visitProfile: createDefaultProfile(this.$route.params.id),
			visitAvatar: null,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleClose, false)
	},
	methods: {
		setStep(i: number) {
			this.step = i
		},
		getTitle(): string {
			switch (this.step) {
				case 0:
					return `Customize your homepage`
				case 1:
					return `Discover great content`
				case 2:
					return `Save and share bookmarks`
				case 3:
					return `Create content easily `
				case 4:
					return `Join the conversation `
				case 5:
					return `Start by editing your profile`
				default:
					return `out of scope`
			}
		},
		getText(): string {
			switch (this.step) {
				case 0:
					return `Make it truly your own by selecting your preferences for displaying content, editing tools, updating widgets, and customizing everything as you wish!`
				case 1:
					return `Here you can easily browse posts that suit your interests. Scroll through  various categories, trending tags, or trending topics to get started.`
				case 2:
					return `Sometimes a post or headline catches your attention, but you’re short of time. No worries. Blogchain makes it easy to save and share content for later.`
				case 3:
					return `Have an idea you’d like to share with the world? Blogchain’s simple editing tool makes it easy to craft and publish your post through an intuitive writing experience.`
				case 4:
					return `Agree or disagree with something you’ve read on Blogchain? Use our comment features to discuss with other readers. You can even include a custom reaction to make your point.`
				case 5:
					return `You’ll be able to update your profile or add more information later!`
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
		async getMyProfile(update: boolean = false) {
			const { profile } = await getProfile(this.$store.state.session.id, update)
			this.myProfile = profile || createDefaultProfile(this.$store.state.session.id)
			if (this.myProfile.avatar.length > 1) {
				getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
					this.myAvatar = p
				})
			}
			// Set visitProfile to myProfile if viewing my own profile
			if (this.$store.state.session.id !== `` && this.$store.state.session.id === this.$route.params.id) {
				this.visitProfile = this.myProfile
				this.visitAvatar = this.myAvatar
			}
		},
		handleSettings(): void {
			if (this.$route.name !== `help`) {
				console.log(`updateSettings`)
				if (!(`settings` in this.$refs && this.$refs.settings)) {
					throw new Error(`This shouldn't happen`)
				}
				const settings = this.$refs.settings as any
				settings.updateSettings()
			}
		},
		closeWizard(): void {
			this.$store.commit(`setWelcome`, false)
			this.$emit(`closePopup`)
		},
	},
})
</script>
