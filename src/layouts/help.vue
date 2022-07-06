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
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="relative flex flex-row">
						<nuxt-child
							style="min-height: calc(100vh - 60px); height: calc(100vh - 60px)"
							class="lg:w-7.5 bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation box-border w-full overflow-y-auto rounded-lg border shadow-lg"
							:class="showWidgets ? `` : `z-10`"
						/>
						<!-- Widgets -->
						<aside
							class="w-5/12 -mr-5 modal-animation -mt-4 hidden overflow-y-auto p-4 lg:block"
							:class="showWidgets ? `z-10` : ``"
							style="min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
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
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SupportWidget from '@/components/widgets/Support.vue'
import ReportWidget from '@/components/widgets/Report.vue'
import ResourcesWidget from '@/components/widgets/Resources.vue'

import { IBackground, backgrounds } from '@/config/backgrounds'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	profile: Profile | null
	avatar?: string | ArrayBuffer
	showWidgets: boolean
	displayOnboarding: boolean
	bgImage: IBackground
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SupportWidget,
		ResourcesWidget,
		ReportWidget,
		OnboardingWizard: () => import(`@/components/popups/OnboardingWizard.vue`),
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			showWidgets: false,
			displayOnboarding: false,
			bgImage: backgrounds[0],
			avatar: undefined,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// unauth
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
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
