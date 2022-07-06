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
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							class="lg:w-7.5 min-h-70 h-70 bg-lightBG dark:bg-darkBGStop border-lightBorder z-10 w-full overflow-y-auto rounded-t-lg border shadow-lg pb-6"
							@infoPopup="toggleSubInfosPopup"
						/>
						<!-- Expired subscriptions -->
						<aside class="w-5/12 -mr-5 -mt-4 p-4 hidden lg:block overflow-y-auto">
							<div
								class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation mb-5 flex flex-col overflow-hidden rounded-lg border py-4 px-6 shadow-lg"
							>
								<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold">
									Expired subscriptions
								</h3>
								<div v-if="inactiveSubs.length > 0">
									<ExpiredSub
										v-for="s in inactiveSubs"
										:key="s.authorID"
										:s="s"
										:toggleSubscription="toggleSubscription"
										@infoPopup="toggleSubInfosPopup(s)"
									/>
								</div>
								<p v-else class="text-gray5 dark:text-gray3 text-sm pb-1 mt-2">you have no expired subscriptions</p>
							</div>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<SubInfos v-if="showPopup" :s="clickedSub" @switchPopup="toggleChangeTierPopup" @close="toggleSubInfosPopup" />
		<ChangeTierPopup
			v-if="showChangeTier"
			:author="subscriptionProfile"
			:authorAvatar="subscriptionProfileAvatar"
			:s="authorPaymentProfile"
			@close="showChangeTier = false"
		/>
		<SubscriptionsPopup
			v-if="showSubscriptions"
			:author="subscriptionProfile"
			:authorAvatar="subscriptionProfileAvatar"
			@close="showSubscriptions = false"
		/>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import { ISubscriptionWithProfile, namespace as SubscriptionsNamespace } from '@/store/subscriptions'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import SubInfos from '@/components/popups/SubInfosPopup.vue'
import ExpiredSub from '@/components/subscriptions/ExpiredSub.vue'
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue'
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { IBackground, backgrounds } from '@/config/backgrounds'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showPopup: boolean
	bgImage: IBackground
	dark: boolean
	clickedSub: any
	showSubscriptionInfo: boolean
	subInfo: ISubscriptionWithProfile | undefined
	showSubscriptions: boolean
	subscriptionProfile: Profile
	subscriptionProfileAvatar: null | string
	showChangeTier: boolean
	authorPaymentProfile: ISubscriptionWithProfile | undefined
}

export default Vue.extend({
	components: {
		Header,
		Footer,
		SubInfos,
		ExpiredSub,
		SubscriptionsPopup,
		ChangeTierPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showPopup: false,
			bgImage: backgrounds[0],
			dark: false,
			clickedSub: null,
			showSubscriptionInfo: false,
			subInfo: undefined,
			showSubscriptions: false,
			subscriptionProfile: createDefaultProfile(this.$store.state.session.id),
			subscriptionProfileAvatar: null,
			showChangeTier: false,
			authorPaymentProfile: undefined,
		}
	},
	computed: {
		...mapGetters(SubscriptionsNamespace, [`inactiveSubs`]),
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
			return
		}
		await this.initProfile()
	},
	methods: {
		async initProfile() {
			// get logged in profile
			const { profile } = await getProfile(this.$store.state.session.id, true)
			this.profile = profile
			this.bgImage = this.$getBGImage(this.profile?.background)
			// Get avatar
			if (this.profile && this.profile.avatar.length > 1) {
				getPhotoFromIPFS(this.profile.avatar).then((p) => {
					this.avatar = p
				})
			}
		},
		// This method is used to change the local bg on the styling tab before changing
		changeLocalBGImage(id: string): void {
			this.bgImage = this.$getBGImage(id)
		},
		updateColorMode(dark: boolean): void {
			this.dark = dark
		},
		toggleSubInfosPopup(clickedsub: any) {
			if (clickedsub !== null) {
				this.clickedSub = clickedsub
			}
			this.showPopup = !this.showPopup
		},
		toggleChangeTierPopup(author: { s: ISubscriptionWithProfile; avatar: string }) {
			this.subscriptionProfile = createDefaultProfile(author.s.authorID)
			this.subscriptionProfileAvatar = author.avatar
			this.authorPaymentProfile = author.s
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
			}
			this.showChangeTier = !this.showChangeTier
		},
		toggleSubscription(author: { s: ISubscriptionWithProfile; avatar: string }) {
			this.subscriptionProfile = createDefaultProfile(author.s.authorID)
			this.subscriptionProfileAvatar = author.avatar
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			// Prevent self-subscribing
			if (author.s.authorID !== this.$store.state.session.id) {
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
	},
})
</script>
