<template>
	<main
		class="w-full flex flex-col items-center bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
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
		<Header :avatar="avatar" class="lg:w-11/12 xl:w-10/12 max-w-1220 my-5 fixed top-0" />
		<div class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 mt-20 relative">
			<div
				class="w-full lg:w-760 absolute min-h-70 h-70 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
			></div>
		</div>

		<!-- Main content scroll -->
		<div ref="container" class="flex w-full overflow-y-auto overflow-x-hidden justify-center">
			<!-- Content container -->
			<div class="flex w-full lg:w-11/12 xl:w-10/12 relative flex-row justify-between max-w-1220">
				<section class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 relative h-full flex flex-row justify-between">
					<nuxt-child
						:tab="tab"
						:style="showPopup ? `` : `backdrop-filter: blur(10px);`"
						class="w-full lg:w-760 lg:flex-shrink-0 p-6"
						@togglePopup="togglePopup"
						@changeLocalBGImage="changeLocalBGImage"
						@initProfile="initProfile"
					/>
				</section>
			</div>
			<!-- Settings tabs -->
			<aside class="fixed w-full flex justify-center top-20">
				<div class="w-full hidden lg:flex flex-row-reverse justify-between lg:w-11/12 xl:w-10/12 max-w-1220 relative">
					<div
						style="left: 760px; right: 0px"
						class="shrink ml-5 absolute max-w-500 h-screen overflow-y-auto p-5 pb-24"
					>
						<div
							class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border bg-gradient-to-r py-4 px-6 pb-2 shadow-lg"
							style="backdrop-filter: blur(10px)"
						>
							<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Settings</h3>
							<nuxt-link
								:class="
									$route.name === `settings-account`
										? `bg-lightInput dark:bg-darkInput font-semibold text-primary`
										: `text-gray5 dark:text-gray3`
								"
								class="focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left flex flex-row items-center"
								to="/settings/account"
							>
								<ProfileIcon class="w-4 h-4" />
								<p class="ml-4">Account</p>
							</nuxt-link>
							<!-- <nuxt-link
									:class="$route.name === `settings-security` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									to="/settings/security"
								>
									Confidentiality and Security
								</nuxt-link> -->
							<!-- <nuxt-link
									:class="$route.name === `settings-network` ? `bg-lightInput font-semibold` : ``"
									class="text-gray5 focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left"
									to="/settings/network"
								>
									Nodes and Network
								</nuxt-link> -->
							<nuxt-link
								to="/settings/styling"
								:class="
									$route.name === `settings-styling`
										? `bg-lightInput dark:bg-darkInput font-semibold text-primary`
										: `text-gray5 dark:text-gray3`
								"
								class="focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left flex flex-row items-center"
							>
								<BrushlIcon class="w-4 h-4" />
								<p class="ml-4">Appearance and Styling</p>
							</nuxt-link>
						</div>
						<Footer />
					</div>
				</div>
			</aside>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IBackground, backgrounds } from '@/config'
import ProfileIcon from '@/components/icons/Profile.vue'
import BrushlIcon from '@/components/icons/Brush.vue'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	tab: string
	showPopup: boolean
	bgImage: IBackground
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		ProfileIcon,
		BrushlIcon,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			tab: `account`,
			showPopup: false,
			bgImage: backgrounds[0],
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		await this.initProfile()
	},
	methods: {
		async initProfile() {
			// get logged in profile
			const { profile } = await getProfile(this.$store.state.session.id, true)
			this.profile = profile
			this.bgImage = this.$getBGImage(this.profile?.background, `local`)
			// Get avatar
			if (this.profile && this.profile.avatar.length > 1) {
				getPhotoFromIPFS(this.profile.avatar).then((p) => {
					this.avatar = p
				})
			}
		},
		// This method is used to change the local bg on the styling tab before changing
		changeLocalBGImage(id: string): void {
			this.bgImage = this.$getBGImage(id, `local`)
		},
		changeTab(t: string): void {
			this.tab = t
		},
		togglePopup(): void {
			this.showPopup = !this.showPopup
		},
	},
})
</script>
