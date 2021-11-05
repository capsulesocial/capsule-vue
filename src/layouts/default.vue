<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/mainBG.png`)})` }"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div class="fixed w-full flex justify-between items-center" style="width: 1220px">
						<!-- Title -->
						<h1 class="font-semibold text-primary" style="font-size: 2.6rem">
							{{ getTitle() }}
						</h1>
						<!-- Peered nodes -->
						<div class="flex items-center bg-gray1 px-2 py-1 rounded-lg">
							<span class="text-sm">n peered nodes</span>
							<CapsuleIcon />
						</div>
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20">
						<nuxt-child
							style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px)"
							class="
								fixed
								overflow-y-auto
								rounded-lg
								shadow-lg
								mr-5
								p-6
								bg-gradient-to-r
								from-lightBGStart
								to-lightBGStop
								backdrop-filter backdrop-blur-lg
							"
							:class="showWidgets ? `` : `z-10`"
						/>
						<!-- Widgets -->
						<aside class="fixed" :class="showWidgets ? `z-10` : ``" style="margin-left: 780px; width: 450px">
							<Widgets @overlay="toggleZIndex" />
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
import CapsuleIcon from '@/components/icons/Capsule.vue'
import Widgets from '@/components/Widgets.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showWidgets: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		Widgets,
		Header,
		Footer,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
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
		getTitle(): string {
			switch (this.$route.name) {
				case `home`:
					return `Hi ` + this.profile?.name + `,`
				case `discover`:
					return `Browse Capsule`
				default:
					return ``
			}
		},
		toggleZIndex() {
			this.showWidgets = !this.showWidgets
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