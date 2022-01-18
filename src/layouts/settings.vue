<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="avatar" class="w-full sticky top-0 py-5 bg-gradient-to-r z-10" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							:tab="tab"
							style="width: 750px; min-height: calc(100vh - 88px); height: calc(100vh - 88px)"
							:style="showPopup ? `` : `backdrop-filter: blur(10px);`"
							class="fixed overflow-y-auto rounded-t-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder"
							@togglePopup="togglePopup"
						/>
						<!-- Settings tabs -->
						<aside class="fixed" style="margin-left: 770px; width: 450px">
							<div
								class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder overflow-hidden mb-5 py-4 px-6 pb-2 modal-animation flex flex-col"
								style="backdrop-filter: blur(10px)"
							>
								<h3 class="text-primary text-base font-semibold pb-4">Settings</h3>
								<nuxt-link
									:class="$route.name === `settings-account` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
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
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									to="/settings/network"
								>
									Nodes and Network
								</nuxt-link>
								<nuxt-link
									to="/settings/styling"
									:class="$route.name === `settings-styling` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
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
