<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="
			dark
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
			<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<!-- Body -->
				<div v-if="!noProfileFound">
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row">
						<nuxt-child
							:key="componentKey"
							class="lg:w-7.5 min-h-61 h-61 xl:min-h-80 xl:h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation z-10 overflow-y-hidden rounded-lg border bg-gradient-to-r shadow-lg"
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
							@openFollowers="showFollowers = true"
							@openFollowing="showFollowing = true"
							@showAvatar="showAvatar = true"
						/>
						<!-- Widgets -->
						<aside
							class="hidden lg:block modal-animation w-5/12 -mr-5 -mt-4 overflow-y-auto p-4"
							style="min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
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
								@openMutuals="showMutuals = true"
							/>
							<FollowersWidget
								v-if="followers.size > 0"
								:followers="followers"
								:updateFollowers="updateFollowers"
								@openFollowers="showFollowers = true"
							/>
							<Footer />
						</aside>
					</section>
					<section v-else class="modal-animation flex w-full justify-center">
						<div
							class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
							:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
						></div>
					</section>
				</div>
				<div
					v-else
					style="min-height: calc(100vh - 70px); height: calc(100vh - 70px); backdrop-filter: blur(10px)"
					class="xl:min-h-80 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder z-10 overflow-y-auto rounded-lg border bg-gradient-to-r shadow-lg xl:h-80"
				>
					<div class="items-ceter flex w-full flex-col p-5">
						<h1 class="text-negative mt-16 text-center font-sans text-6xl font-bold">404</h1>
						<h2 class="text-center text-2xl font-semibold text-darkPrimaryText">This page was not found</h2>
						<p class="text-gray5 dark:text-gray3 mb-5 mt-2 self-center text-center" style="width: 360px">
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
							class="mt-10 self-center"
							style="width: 500px"
						/>
					</div>
				</div>
			</div>
		</div>
		<FollowersPopup
			v-if="showFollowers"
			:profile="visitProfile"
			:followers="followers"
			:updateFollowers="updateFollowers"
			@close="showFollowers = false"
		/>
		<FollowingPopup
			v-if="showFollowing"
			:profile="visitProfile"
			:updateFollowers="updateFollowers"
			@close="showFollowing = false"
		/>
		<MutualFollowersPopup
			v-if="showMutuals"
			:profile="visitProfile"
			:updateFollowers="updateFollowers"
			:mutualProfiles="mutualProfiles"
			@close="showMutuals = false"
		/>
		<ImagePopup v-if="showAvatar" :image="visitAvatar" @close="showAvatar = false" />
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import ProfileWidget from '@/components/widgets/Profile.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'
import MutualFollowersWidget from '@/components/widgets/MutualFollowers.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import FollowersPopup from '@/components/popups/FollowersPopup.vue'
import FollowingPopup from '@/components/popups/FollowingPopup.vue'
import MutualFollowersPopup from '@/components/popups/MutualFollowersPopup.vue'
import ImagePopup from '@/components/popups/Image.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'

import { IBackground, backgrounds } from '@/config'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
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
	bgImage: IBackground
	showFollowers: boolean
	showFollowing: boolean
	showMutuals: boolean
	dark: boolean
	showAvatar: boolean
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
		FollowersPopup,
		FollowingPopup,
		MutualFollowersPopup,
		ImagePopup,
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
			bgImage: backgrounds[0],
			showFollowers: false,
			showFollowing: false,
			showMutuals: false,
			dark: false,
			showAvatar: false,
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				this.getVisitingProfile()
				this.componentKey += 1
				this.showFollowers = false
				this.showFollowing = false
				this.showMutuals = false
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
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
	},
	mounted() {
		// Fetch visiting profile
		this.getVisitingProfile()
	},
	methods: {
		async getVisitingProfile() {
			const [{ profile: visitProfile }, profileExists] = await Promise.all([
				getProfile(this.$route.params.id, true),
				this.checkAccountExists(),
			])
			if (!profileExists) {
				this.noProfileFound = true
				this.$toastError(`Profile does not exist`)
				return
			}
			this.visitProfile = visitProfile || createDefaultProfile(this.$route.params.id)
			// this.bgImage = this.$getBGImage(this.visitProfile?.background, `local`)
			this.visitAvatar = null
			if (this.visitProfile.avatar !== ``) {
				getPhotoFromIPFS(this.visitProfile.avatar).then((p) => {
					this.visitAvatar = p
				})
			}
			this.updateFollowers()
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
			this.bgImage = this.$getBGImage(this.myProfile?.background, `local`)
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
			if (this.$route.params.id !== this.$store.state.session.id) {
				try {
					await followChange(
						this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						this.$route.params.id,
					)
					this.$toastSuccess(
						this.userIsFollowed ? `Unfollowed ${this.$route.params.id}` : `Followed ${this.$route.params.id}`,
					)
					this.updateFollowers()
				} catch (err: unknown) {
					if (axios.isAxiosError(err)) {
						if (!err.response) {
							this.$toastError(`Network error, please try again`)
							return
						}
						if (err.response.status === 429) {
							this.$toastError(`Too many requests, please try again in a minute`)
							return
						}
						this.$toastError(err.response.data.error)
						return
					}
					if (err instanceof Error) {
						this.$toastError(err.message)
						return
					}
					throw err
				}
			}
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
