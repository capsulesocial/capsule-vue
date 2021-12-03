<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							:tab="tab"
							style="
								width: 750px;
								min-height: calc(100vh - 88px);
								height: calc(100vh - 88px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-t-lg shadow-lg mr-5 p-6 pt-4 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder"
						/>
						<!-- Settings tabs -->
						<aside class="fixed" style="margin-left: 770px; width: 450px">
							<div
								class="rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder overflow-hidden mb-5 py-4 px-6 pb-2"
								style="backdrop-filter: blur(10px)"
							>
								<h3 class="text-primary text-base font-semibold pb-4">Settings</h3>
								<button
									:class="tab === `account` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									@click="changeTab(`account`)"
								>
									Account
								</button>
								<button
									:class="tab === `security` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									@click="changeTab(`security`)"
								>
									Confidentiality and Security
								</button>
								<button
									:class="tab === `network` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									@click="changeTab(`network`)"
								>
									Nodes and Network
								</button>
								<button
									:class="tab === `styling` ? `bg-lightInput font-semibold` : ``"
									class="w-full rounded-lg text-gray5 py-2 px-4 mb-4 text-left focus:outline-none"
									@click="changeTab(`styling`)"
								>
									Appearance and Styling
								</button>
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
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// get logged in profile
		this.profile = await getProfile(this.$store.state.session.id)
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
	},
})
</script>

<style>
.bg-img {
	background-attachment: fixed;
	background-size: cover;
}
</style>
