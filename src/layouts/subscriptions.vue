<template>
	<main
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
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							style="backdrop-filter: blur(10px)"
							class="lg:w-7.5 min-h-70 h-70 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder z-10 w-full overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
							@popup="toggleSubInfosPopup"
						/>
						<!-- Expired subscriptions -->
						<aside class="w-5/12 -mr-5 -mt-4 p-4 hidden lg:block overflow-y-auto">
							<div
								class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border bg-gradient-to-r py-4 px-6 shadow-lg"
								style="backdrop-filter: blur(10px)"
							>
								<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold mb-4">
									Expired subscriptions
								</h3>
								<p class="text-gray5 dark:text-gray3 text-sm pb-1">you have no expired subscriptions yet</p>
							</div>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<SubInfos v-if="showPopup" :s="clickedSub" @close="toggleSubInfosPopup" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SubInfos from '@/components/popups/SubInfosPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IBackground, backgrounds } from '@/config/backgrounds'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showPopup: boolean
	bgImage: IBackground
	dark: boolean
	clickedSub: any
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SubInfos,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showPopup: false,
			bgImage: backgrounds[0],
			dark: false,
			clickedSub: null,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
			return
		}
		await this.initProfile()
	},
	methods: {
		async initProfile() {
			// get logged in profile
			const { profile } = await getProfile(this.$store.state.session.id, true)
			this.profile = profile
			this.bgImage = this.$getBGImage(this.profile?.background)
			// Get avatar
			if (this.profile && this.profile.avatar.length > 1) {
				getPhotoFromIPFS(this.profile.avatar).then((p) => {
					this.avatar = p
				})
			}
		},
		// This method is used to change the local bg on the styling tab before changing
		changeLocalBGImage(id: string): void {
			this.bgImage = this.$getBGImage(id)
		},
		updateColorMode(dark: boolean): void {
			this.dark = dark
		},
		toggleSubInfosPopup(clickedsub: any) {
			if (clickedsub !== null) {
				this.clickedSub = clickedsub
			}
			this.showPopup = !this.showPopup
		},
	},
})
</script>
