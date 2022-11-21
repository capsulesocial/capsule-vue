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
			<div class="flex flex-col w-full lg:w-11/12 xl:w-10/12 max-w-1220">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<!-- Body -->
				<div v-if="!noProfileFound">
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row">
						<nuxt-child
							:key="componentKey"
							class="lg:w-7.5 min-h-61 h-61 xl:min-h-80 xl:h-80 bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation z-10 overflow-y-hidden rounded-lg border shadow-lg"
							:visitProfile="visitProfile"
							:visitAvatar="visitAvatar"
							:followers="followers"
							:following="following"
							:toggleFriend="toggleFriend"
							:toggleSubscription="toggleSubscription"
							:toggleDonation="toggleDonation"
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
							<EmailNewsletterWidget
								v-if="this.$store.state.session.id !== `` && $store.state.session.id !== $route.params.id"
								:profile="visitProfile"
								:newsletters="newsletters"
								@toggleNewsletterPopup="toggleNewsletterPopup"
								@fetchNewsletters="refetchNewsletters"
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
							:style="`border-top: 2px solid` + $color.hex"
						></div>
					</section>
				</div>
				<div
					v-else
					style="min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
					class="xl:min-h-80 bg-lightBG dark:bg-darkBGStop border-lightBorder z-10 overflow-y-auto rounded-lg border shadow-lg xl:h-80"
				>
					<div class="items-ceter flex w-full flex-col p-5">
						<h1 class="text-negative mt-16 text-center font-sans text-6xl font-bold mb-8">404</h1>
						<h2 class="text-center text-2xl font-semibold dark:text-darkPrimaryText">This page was not found</h2>
						<p class="text-gray5 dark:text-gray3 mb-5 mt-2 self-center text-center" style="width: 360px">
							It seems that this page doesn't exist. How about navigating back home?
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
						<nuxt-img
							src="/images/error.webp"
							alt="error image"
							loading="lazy"
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
		<SubscriptionsPopup
			v-if="showSubscriptions"
			:author="visitProfile"
			:authorAvatar="visitAvatar"
			@close="showSubscriptions = false"
		/>
		<DonationsPopup
			v-if="showDonations"
			:author="visitProfile"
			:authorAvatar="visitAvatar"
			@close="showDonations = false"
		/>
		<ChangeTierPopup
			v-if="showChangeTier"
			:author="visitProfile"
			:authorAvatar="visitAvatar"
			:s="authorPaymentProfile"
			@close="showChangeTier = false"
		/>
		<unFollowWarningPopup v-if="showUnfollowWarning" @close="showUnfollowWarning = false" />
		<SubInfosPopup
			v-if="showSubscriptionInfo && subInfo"
			:s="subInfo"
			@switchPopup="toggleChangeTierPopup"
			@close="showSubscriptionInfo = false"
		/>
		<AddNewsletterPopup
			v-if="showNewsletterPopup"
			:profile="visitProfile"
			:avatar="visitAvatar"
			@toggleNewsletterPopup="toggleNewsletterPopup"
			@newsletterStarted="refetchNewsletters"
		/>
		<portal-target name="card-popup"></portal-target>
		<portal-target name="deleteEmail"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import { AxiosError } from 'axios'
import ProfileWidget from '@/components/widgets/Profile.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'
import MutualFollowersWidget from '@/components/widgets/MutualFollowers.vue'
import EmailNewsletterWidget from '@/components/widgets/EmailNewsletter.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import FollowersPopup from '@/components/popups/FollowersPopup.vue'
import FollowingPopup from '@/components/popups/FollowingPopup.vue'
import MutualFollowersPopup from '@/components/popups/MutualFollowersPopup.vue'
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue'
import DonationsPopup from '@/components/popups/DonationsPopup.vue'
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue'
import ImagePopup from '@/components/popups/Image.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import SubInfosPopup from '@/components/popups/SubInfosPopup.vue'
import unFollowWarningPopup from '@/components/popups/unFollowWarningPopup.vue'
import AddNewsletterPopup from '@/components/popups/AddNewsletter.vue'

import { IBackground, backgrounds } from '@/config/backgrounds'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getUserInfoNEAR } from '@/backend/near'
import { ActionType, namespace as paymentProfileNamespace } from '@/store/paymentProfile'
import { ISubscriptionWithProfile } from '@/store/subscriptions'
import type { ISubscriptionResponse } from '@/backend/subscription'
import { IEmailSubscription, listForAuthor } from '@/backend/emails'

interface IData {
	myProfile: Profile
	myAvatar?: string | ArrayBuffer
	myFollowing: Set<string>
	visitProfile: Profile
	visitAvatar?: string | ArrayBuffer
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
	showAvatar: boolean
	showSubscriptions: boolean
	showDonations: boolean
	showSubscriptionInfo: boolean
	subInfo: ISubscriptionWithProfile | undefined
	activeSubscription: boolean
	showUnfollowWarning: boolean
	authorPaymentProfile: ISubscriptionWithProfile | undefined
	showChangeTier: boolean
	showNewsletterPopup: boolean
	newsletters: Array<IEmailSubscription>
}

export default Vue.extend({
	components: {
		ProfileWidget,
		FollowersWidget,
		Header,
		Footer,
		MutualFollowersWidget,
		EmailNewsletterWidget,
		BrandedButton,
		UnauthPopup,
		FollowersPopup,
		FollowingPopup,
		MutualFollowersPopup,
		ImagePopup,
		SubscriptionsPopup,
		DonationsPopup,
		SubInfosPopup,
		unFollowWarningPopup,
		ChangeTierPopup,
		AddNewsletterPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			myProfile: createDefaultProfile(this.$store.state.session.id),
			myFollowing: new Set(),
			visitProfile: createDefaultProfile(this.$route.params.id),
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
			showAvatar: false,
			myAvatar: undefined,
			visitAvatar: undefined,
			showSubscriptions: false,
			showDonations: false,
			showSubscriptionInfo: false,
			subInfo: undefined,
			activeSubscription: false,
			showUnfollowWarning: false,
			authorPaymentProfile: undefined,
			showChangeTier: false,
			showNewsletterPopup: false,
			newsletters: [],
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
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
	},
	async mounted() {
		// Fetch visiting profile
		this.getVisitingProfile()
		this.fetchNewsletters()
		try {
			await this.fetchPaymentProfile({ username: this.$route.params.id })
		} catch (err) {
			if (!(err instanceof AxiosError && err.response?.status === 404)) {
				this.$handleError(err)
			}
		}
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
			if (this.visitProfile.avatar !== ``) {
				getPhotoFromIPFS(this.visitProfile.avatar).then((p) => {
					this.visitAvatar = p
				})
			} else {
				this.visitAvatar = ``
			}
			this.updateFollowers()
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id)
			this.followers = followers
			this.following = following
			this.userIsFollowed = followers.has(this.$store.state.session.id)

			this.$store.state.subscriptions.active.forEach((sub: ISubscriptionResponse) => {
				if (sub.authorID === this.$route.params.id) {
					this.activeSubscription = true
				}
			})

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
			this.bgImage = this.$getBGImage(this.myProfile?.background)
			if (this.myProfile.avatar.length > 1) {
				getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
					this.myAvatar = p
				})
			}
		},
		async fetchNewsletters() {
			if (this.$store.state.session.id === ``) {
				return
			}
			try {
				this.newsletters = await listForAuthor(this.$route.params.id, this.$store.state.session.id)
			} catch (err) {
				this.$handleError(err)
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
					this.$handleError(err)
				}
			}
			if (this.activeSubscription === true && this.userIsFollowed === true) {
				this.showUnfollowWarning = !this.showUnfollowWarning
			}
		},
		toggleChangeTierPopup(author: { s: ISubscriptionWithProfile; avatar: string }) {
			this.authorPaymentProfile = author.s
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
			}
			this.showChangeTier = !this.showChangeTier
		},
		toggleSubscription(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			// Prevent self-subscribing
			if (authorID !== this.$store.state.session.id) {
				// If already subscribed
				this.$store.state.subscriptions.active.forEach((sub: ISubscriptionWithProfile) => {
					if (sub.authorID === this.$route.params.id) {
						this.showSubscriptionInfo = true
						this.subInfo = sub
					}
				})
				// show add subscription
				if (!this.showSubscriptionInfo) {
					this.showSubscriptions = !this.showSubscriptions
				}
			}
		},
		toggleDonation(authorID: string) {
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID === this.$store.state.session.id) {
				this.$toastError(`You cannot donate to yourself`)
				return
			}
			this.showDonations = !this.showDonations
		},
		toggleNewsletterPopup() {
			this.showNewsletterPopup = !this.showNewsletterPopup
		},
		refetchNewsletters() {
			this.fetchNewsletters()
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
		...mapActions(paymentProfileNamespace, {
			fetchPaymentProfile: ActionType.FETCH_PROFILE,
		}),
	},
})
</script>
