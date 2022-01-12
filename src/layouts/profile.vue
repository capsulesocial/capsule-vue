<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="myAvatar" />
				</header>
				<!-- Body -->
				<div v-if="!noProfileFound">
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row">
						<nuxt-child
							style="width: 750px; min-height: calc(100vh - 80px); height: calc(100vh - 80px)"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation"
							:visitProfile="visitProfile"
							:visitAvatar="visitAvatar"
							:followers="followers"
							:following="following"
							:toggleFriend="toggleFriend"
							:updateFollowers="updateFollowers"
							:userIsFollowed="userIsFollowed"
							:mutuals="mutuals"
							:mutualProfiles="mutualProfiles"
							:updateProfileMethod="getMyProfile"
						/>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4 modal-animation"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<ProfileWidget
								:location="visitProfile.location"
								:email="visitProfile.email"
								:website="visitProfile.website"
							/>
							<MutualFollowersWidget
								v-if="this.$route.params.id !== this.$store.state.session.id"
								:mutuals="mutuals"
								:mutualProfiles="mutualProfiles"
							/>
							<FollowersWidget v-if="followers.size > 0" :followers="followers" :updateFollowers="updateFollowers" />
							<Footer />
						</aside>
					</section>
					<section v-else class="w-full flex justify-center modal-animation">
						<div class="loader m-5 p-10 rounded-lg"></div>
					</section>
				</div>
				<div
					v-else
					style="width: 1220px; min-height: calc(100vh - 80px); height: calc(100vh - 80px) bottom: -10px; backdrop-filter: blur(10px);"
					class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder"
				>
					<div class="w-full p-5 flex flex-col items-ceter">
						<h1 class="font-bold text-negative text-6xl font-sans text-center mt-16">404</h1>
						<h2 class="text-center font-semibold text-2xl">This page was not found</h2>
						<p class="text-center text-gray7 self-center mb-5 mt-2" style="width: 360px">
							It seems that this page doesn't exist, we suggest you to go back home
						</p>
						<div class="flex justify-center">
							<BrandedButton
								:action="
									() => {
										this.$router.push(`/home`)
									}
								"
								:text="`Back to Home`"
							/>
						</div>
						<img
							:src="require(`@/assets/images/brand/error.webp`)"
							alt="error image"
							class="self-center mt-10"
							style="width: 500px"
						/>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileWidget from '@/components/widgets/Profile.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'
import MutualFollowersWidget from '@/components/widgets/MutualFollowers.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getUserInfoNEAR } from '@/backend/near'

interface IData {
	myProfile: Profile
	myAvatar: string | ArrayBuffer | null
	myFollowing: Set<string>
	visitProfile: Profile
	visitAvatar: string | ArrayBuffer | null
	followers: Set<string>
	following: Set<string>
	userIsFollowed: boolean
	noProfileFound: boolean
	mutuals: Set<string>
	mutualProfiles: Array<Profile>
}

export default Vue.extend({
	components: {
		ProfileWidget,
		FollowersWidget,
		Header,
		Footer,
		MutualFollowersWidget,
		BrandedButton,
	},
	data(): IData {
		return {
			myProfile: createDefaultProfile(this.$store.state.session.id),
			myAvatar: null,
			myFollowing: new Set(),
			visitProfile: createDefaultProfile(this.$route.params.id),
			visitAvatar: null,
			followers: new Set(),
			following: new Set(),
			userIsFollowed: false,
			noProfileFound: false,
			mutuals: new Set(),
			mutualProfiles: [],
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				this.getVisitingProfile()
			}
		},
	},
	created() {
		// Fetch visiting profile
		this.getVisitingProfile()
	},
	methods: {
		async getVisitingProfile() {
			const [{ profile: visitProfile }, profileExists] = await Promise.all([
				getProfile(this.$route.params.id),
				this.checkAccountExists(),
			])
			if (!profileExists) {
				this.noProfileFound = true
				this.$toastError(`Profile does not exist`)
				return
			}
			this.visitProfile = visitProfile || createDefaultProfile(this.$route.params.id)
			this.visitAvatar = null
			if (this.visitProfile.avatar !== ``) {
				getPhotoFromIPFS(this.visitProfile.avatar).then((p) => {
					this.visitAvatar = p
				})
			}
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id)
			this.followers = followers
			this.following = following
			this.userIsFollowed = followers.has(this.$store.state.session.id)

			if (this.$store.state.session.id !== ``) {
				// get my profile and avatar
				this.getMyProfile()
				const myConnections = await getFollowersAndFollowing(this.$store.state.session.id)
				this.myFollowing = myConnections.following
				// Get mutual followers list
				this.mutuals = new Set([...followers].filter((p) => this.myFollowing.has(p)))
				this.mutualProfiles = []
				for (const p of this.mutuals) {
					if (this.mutualProfiles.length > 3) {
						return
					}
					const { profile } = await getProfile(p)
					if (profile) {
						this.mutualProfiles.push(profile)
					}
				}
			}
		},
		async getMyProfile(update: boolean = false) {
			const { profile } = await getProfile(this.$store.state.session.id, update)
			this.myProfile = profile || createDefaultProfile(this.$store.state.session.id)
			if (this.myProfile.avatar.length > 1) {
				getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
					this.myAvatar = p
				})
			}
			// Set visitProfile to myProfile if viewing my own profile
			if (this.$store.state.session.id !== `` && this.$store.state.session.id === this.$route.params.id) {
				this.visitProfile = this.myProfile
				this.visitAvatar = this.myAvatar
			}
		},
		async toggleFriend() {
			await followChange(
				this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
				this.$store.state.session.id,
				this.$route.params.id,
			)
			this.updateFollowers()
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id, true)
			this.followers = followers
			this.following = following
			this.userIsFollowed = followers.has(this.$store.state.session.id)
		},
		async checkAccountExists() {
			try {
				await getUserInfoNEAR(this.$route.params.id)
				return true
			} catch (err: any) {
				if (err.message === `Username not found on NEAR!`) {
					return false
				}

				throw err
			}
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
