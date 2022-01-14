<template>
	<section
		class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-start bg-opacity-50 modal-animation"
	>
		<div
			class="popup shadow-lg rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg p-6 pt-4 mt-12 overflow-y-auto card-animation"
			style="max-height: 90%; width: 650px; backdrop-filter: blur(10px)"
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
				<EditProfile v-show="step === 5" :updateProfileMethod="getMyProfile" class="mb-4" />
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
					<button
						:class="step > 4 ? `bg-primary` : `bg-gray1`"
						class="p-1 mx-1 rounded-full focus:outline-none"
						@click="setStep(5)"
					></button>
				</div>
				<!-- Next button -->
				<div v-if="step === 5" class="mb-2">
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
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import CloseIcon from '@/components/icons/X.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import EditProfile from '@/components/Settings.vue'

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
		EditProfile,
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
		setStep(i: number | null) {
			i === null ? (this.step = this.step + 1) : (this.step = i)
			if (this.step >= 6) {
				this.closeWizard()
			}
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
					return `As your daily entry point to Blogchain, this screen is important. Make it truly your own by picking whichever options you prefer for displaying content, editing tools, widgets, and more.`
				case 1:
					return `On this page, we make it easy for you to find posts by writers who suit your interests well. Browse categories, featured tags, or trending topics to get started.`
				case 2:
					return `Sometimes a post or headline catches your attention, but there’s no time to read it now. That’s why Blogchain makes it easy to highlight such content for later and then share with friends if you want.`
				case 3:
					return `Have an idea you’d like to share with the world? Blogchain’s simple editing tool will make it easy for you to craft and publish your post in a intuitive writing experience.`
				case 4:
					return `Agree or disagree with something you’ve read on Blogchain? Use our comment features to talk about it with other readers. You can even include one of our custom reaction illustrations to make your point.`
				case 5:
					return `You will be able to change your profile and add more informations later on your profile page.`
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
		closeWizard(): void {
			this.$store.commit(`setWelcome`, false)
			this.$emit(`closePopup`)
		},
	},
})
</script>
