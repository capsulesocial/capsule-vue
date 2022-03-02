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
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="relative flex flex-row">
						<nuxt-child
							style="backdrop-filter: blur(10px); min-height: calc(100vh - 60px); height: calc(100vh - 60px)"
							class="xl:w-750 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation fixed mr-5 box-border w-full overflow-y-auto rounded-lg border bg-gradient-to-r shadow-lg"
							:class="showWidgets ? `` : `z-10`"
						/>
						<!-- Widgets -->
						<aside
							class="modal-animation fixed -mt-4 hidden overflow-y-auto p-4 xl:block"
							:class="showWidgets ? `z-10` : ``"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<SupportWidget />
							<ReportWidget />
							<ResourcesWidget v-if="this.$store.state.session.id !== ``" @overlay="openOnboarding" />
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<!-- Onboarding Wizard -->
		<OnboardingWizard v-if="displayOnboarding" @closePopup="openOnboarding" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { disableBodyScroll } from 'body-scroll-lock'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SupportWidget from '@/components/widgets/Support.vue'
import ReportWidget from '@/components/widgets/Report.vue'
import ResourcesWidget from '@/components/widgets/Resources.vue'
import OnboardingWizard from '@/components/popups/OnboardingWizard.vue'

import { IBackground, backgrounds } from '@/config'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showWidgets: boolean
	displayOnboarding: boolean
	bgImage: IBackground
	dark: boolean
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SupportWidget,
		ResourcesWidget,
		ReportWidget,
		OnboardingWizard,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
			displayOnboarding: false,
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
		// unauth
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
	},
	mounted() {
		// Lock background
		const mainOverlay = this.$refs.main as HTMLElement
		disableBodyScroll(mainOverlay)
	},
	methods: {
		toggleZIndex() {
			this.showWidgets = !this.showWidgets
		},
		openOnboarding() {
			this.displayOnboarding = !this.displayOnboarding
		},
	},
})
</script>
