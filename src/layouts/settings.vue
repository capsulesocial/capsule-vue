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
					<section class="flex flex-row">
						<nuxt-child
							:tab="tab"
							class="lg:w-7.5 min-h-70 h-70 bg-lightBG dark:bg-darkBGStop border-lightBorder border z-10 w-full overflow-y-auto rounded-t-lg p-6 pt-4 shadow-lg"
							@togglePopup="togglePopup"
							@changeLocalBGImage="changeLocalBGImage"
							@initProfile="initProfile"
							@manageNewsletter="toggleNewsletterPopup"
						/>
						<!-- Settings tabs -->
						<aside class="w-5/12 -mr-5 -mt-4 p-4 hidden lg:block overflow-y-auto">
							<div
								class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border py-4 px-6 pb-2 shadow-lg"
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
								<nuxt-link
									:class="
										$route.name === `settings-notifications`
											? `bg-lightInput dark:bg-darkInput font-semibold text-primary`
											: `text-gray5 dark:text-gray3`
									"
									class="focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left flex flex-row items-center"
									to="/settings/notifications"
								>
									<BellIcon class="w-4 h-4" />
									<p class="ml-4">Notifications</p>
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
						</aside>
					</section>
				</div>
			</div>
			<ConfigureNewsletterPopup
				v-if="showNewsletterPopup"
				:profile="clickedAuthor"
				:avatar="clickedAuthorAvatar"
				@toggleNewsletterPopup="toggleNewsletterPopup"
			/>
		</div>
		<portal-target name="settingsLayout"></portal-target>
		<portal-target name="deleteEmail"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IBackground, backgrounds } from '@/config/backgrounds'
import ProfileIcon from '@/components/icons/Profile.vue'
import BellIcon from '@/components/icons/Bell.vue'
import BrushlIcon from '@/components/icons/Brush.vue'
import ConfigureNewsletterPopup from '@/components/popups/ConfigureNewsletterPopup.vue'

interface IData {
	profile: Profile | null
	avatar?: string | ArrayBuffer
	tab: string
	showPopup: boolean
	bgImage: IBackground
	showNewsletterPopup: boolean
	clickedAuthor: Profile | null
	clickedAuthorAvatar?: string | ArrayBuffer
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		ProfileIcon,
		BrushlIcon,
		BellIcon,
		ConfigureNewsletterPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			tab: `account`,
			showPopup: false,
			bgImage: backgrounds[0],
			avatar: undefined,
			showNewsletterPopup: false,
			clickedAuthor: null,
			clickedAuthorAvatar: undefined,
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
		changeTab(t: string): void {
			this.tab = t
		},
		togglePopup(): void {
			this.showPopup = !this.showPopup
		},
		toggleNewsletterPopup(clickedauthor: any) {
			if (clickedauthor !== undefined) {
				this.clickedAuthor = clickedauthor
				getPhotoFromIPFS(clickedauthor.avatar).then((p) => {
					this.clickedAuthorAvatar = p
				})
			}
			this.showNewsletterPopup = !this.showNewsletterPopup
		},
	},
})
</script>
