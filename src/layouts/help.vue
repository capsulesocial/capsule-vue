<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10 pb-4">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row relative">
						<nuxt-child
							style="
								width: 750px;
								min-height: calc(100vh - 70px);
								height: calc(100vh - 70px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation"
							:class="showWidgets ? `` : `z-10`"
						/>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4 modal-animation"
							:class="showWidgets ? `z-10` : ``"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
						>
							<SupportWidget />
							<RessourcesWidget v-if="this.$store.state.session.id !== ``" @overlay="openOnboarding" />
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
import RessourcesWidget from '@/components/widgets/Ressources.vue'
import OnboardingWizard from '@/components/OnboardingWizard.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showWidgets: boolean
	following: Set<string>
	followers: Set<string>
	userIsFollowed: boolean
	displayOnboarding: boolean
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SupportWidget,
		RessourcesWidget,
		OnboardingWizard,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
			following: new Set(),
			followers: new Set(),
			userIsFollowed: false,
			displayOnboarding: false,
		}
	},
	async created() {
		// unauth
		if (this.$store.state.session.id === ``) {
			return
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
		// Get followers and following
		const { followers, following } = await getFollowersAndFollowing(this.$store.state.session.id)
		this.following = following
		this.followers = followers
		this.userIsFollowed = followers.has(this.$store.state.session.id)
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
			this.followers = followers
			this.following = following
		},
		toggleZIndex() {
			this.showWidgets = !this.showWidgets
		},
		saveDraftState(): void {
			if (this.$refs.editor) {
				// @ts-ignore
				this.$refs.editor.saveContent()
			}
		},
		openOnboarding() {
			this.displayOnboarding = !this.displayOnboarding
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
