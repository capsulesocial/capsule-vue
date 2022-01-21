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
			<div class="flex flex-col w-full xl:w-1220">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<!-- Body -->
				<div v-if="!noProfileFound">
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row">
						<nuxt-child
							:key="componentKey"
							class="fixed xl:w-750 min-h-61 h-61 overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation"
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
								:key="componentKey"
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
					style="bottom: -10px; backdrop-filter: blur(10px)"
					class="fixed xl:w-1220 xl:min-h-80 xl:h-80 overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder"
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
		<UnauthPopup />
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
import UnauthPopup from '@/components/UnauthPopup.vue'

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
	componentKey: number
}

export default Vue.extend({
	components: {
		ProfileWidget,
		FollowersWidget,
		Header,
		Footer,
		MutualFollowersWidget,
		BrandedButton,
		UnauthPopup,
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
			componentKey: 0,
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				this.getVisitingProfile()
			}
		},
		'$store.state.session.name'() {
			this.visitProfile.name = this.$store.state.session.name
			this.componentKey += 1
		},
		'$store.state.session.bio'() {
			this.visitProfile.bio = this.$store.state.session.bio
			this.componentKey += 1
		},
		'$store.state.session.location'() {
			this.visitProfile.location = this.$store.state.session.location
			this.componentKey += 1
		},
		'$store.state.session.website'() {
			this.visitProfile.website = this.$store.state.session.website
			this.componentKey += 1
		},
		'$store.state.session.email'() {
			this.visitProfile.email = this.$store.state.session.email
			this.componentKey += 1
		},
		'$store.state.session.avatar'() {
			getPhotoFromIPFS(this.$store.state.session.avatar).then((p) => {
				this.visitAvatar = p
				this.componentKey += 1
			})
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
		},
		async toggleFriend() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
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
