<template>
	<main
		class="bg-img m-0 h-screen p-0"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				this.bgImage.image +
				`)`,
			backgroundSize: `contain`,
		}"
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
							class="xl:w-750 from-lightBGStart to-lightBGStop border-lightBorder modal-animation fixed mr-5 box-border w-full overflow-y-auto rounded-lg border bg-gradient-to-r shadow-lg"
							:class="showWidgets ? `` : `z-10`"
						/>
						<!-- Widgets -->
						<aside
							class="modal-animation fixed -mt-4 hidden overflow-y-auto p-4 xl:block"
							:class="showWidgets ? `z-10` : ``"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
						>
							<SupportWidget />
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
import ResourcesWidget from '@/components/widgets/Resources.vue'
import OnboardingWizard from '@/components/OnboardingWizard.vue'

import { IBackground, backgrounds } from '@/config'
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
	bgImage: IBackground
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SupportWidget,
		ResourcesWidget,
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
			bgImage: backgrounds[0],
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
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
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
