<template>
	<main
		class="bg-img m-0 h-screen p-0"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="xl:w-1220 flex w-full flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							:tab="tab"
							:style="showPopup ? `` : `backdrop-filter: blur(10px);`"
							class="xl:w-750 min-h-70 h-70 from-lightBGStart to-lightBGStop border-lightBorder fixed z-10 mr-5 w-full overflow-y-auto rounded-t-lg bg-gradient-to-r p-6 pt-4 shadow-lg"
							@togglePopup="togglePopup"
						/>
						<!-- Settings tabs -->
						<aside class="fixed hidden xl:block" style="margin-left: 770px; width: 450px">
							<div
								class="from-lightBGStart to-lightBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border bg-gradient-to-r py-4 px-6 pb-2 shadow-lg"
								style="backdrop-filter: blur(10px)"
							>
								<h3 class="text-primary pb-4 text-base font-semibold">Settings</h3>
								<nuxt-link
									:class="$route.name === `settings-account` ? `bg-lightInput font-semibold` : ``"
									class="text-gray5 focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left"
									to="/settings/account"
								>
									Account
								</nuxt-link>
								<!-- <nuxt-link
									:class="$route.name === `settings-security` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									to="/settings/security"
								>
									Confidentiality and Security
								</nuxt-link> -->
								<nuxt-link
									:class="$route.name === `settings-network` ? `bg-lightInput font-semibold` : ``"
									class="text-gray5 focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left"
									to="/settings/network"
								>
									Nodes and Network
								</nuxt-link>
								<nuxt-link
									to="/settings/styling"
									:class="$route.name === `settings-styling` ? `bg-lightInput font-semibold` : ``"
									class="text-gray5 focus:outline-none mb-4 w-full rounded-lg py-2 px-4 text-left"
								>
									Appearance and Styling
								</nuxt-link>
							</div>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	tab: string
	showPopup: boolean
}

export default Vue.extend({
	components: {
		Header,
		Footer,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			tab: `account`,
			showPopup: false,
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
	},
	methods: {
		changeTab(t: string): void {
			this.tab = t
		},
		togglePopup(): void {
			this.showPopup = !this.showPopup
		},
	},
})
</script>
