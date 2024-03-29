<template>
	<section class="w-full">
		<!-- top -->
		<article id="header" ref="topContainer" class="min-h-fit header-profile z-20 w-full px-4 pt-3 xl:px-6 xl:pt-4">
			<!-- Back button -->
			<div class="flex flex-row items-center pb-4">
				<button
					v-if="$route.params.id !== $store.state.session.id"
					class="focus:outline-none flex flex-row items-center"
					@click="handleBack"
				>
					<span class="bg-gray1 dark:bg-gray5 rounded-full p-1"><BackButton :reduceSize="true" /></span>
					<h6 class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">Back</h6>
				</button>
				<div
					id="small"
					class="header-profile flex w-full flex-row items-center justify-between z-40 opacity0"
					:class="$route.params.id === $store.state.session.id ? `` : `ml-6`"
				>
					<div class="flex flex-row items-center">
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="showAvatar"
						>
							<Avatar
								:avatar="visitAvatar"
								:authorID="$route.params.id"
								:size="`w-8 h-8`"
								:noClick="true"
								class="rounded-base flex-shrink-0"
								:class="!visitAvatar ? `cursor-default` : ``"
							/>
						</button>
						<button
							class="focus:outline-none"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
							@click="openHeader(true)"
						>
							<h6 v-if="visitProfile.name != ``" class="ml-2 font-sans font-semibold dark:text-darkPrimaryText">
								{{ visitProfile.name }}
							</h6>
							<h6 v-else class="text-gray5 dark:text-gray3 ml-2 font-sans font-semibold">{{ visitProfile.id }}</h6>
						</button>
					</div>
					<div class="flex items-center">
						<span v-if="$store.state.session.id === $route.params.id" class="w-full h-full">
							<button class="bg-darkBG focus:outline-none rounded-lg xl:hidden p-1" @click="toggleSettings">
								<PencilIcon class="text-white" />
							</button>
							<SecondaryButton
								:text="`Edit Profile`"
								:action="toggleSettings"
								class="hidden xl:block"
								:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
								:disabled="!scrollingDown"
							/>
						</span>
						<FriendButton
							v-else
							:toggleFriend="toggleFriend"
							:userIsFollowed="userIsFollowed"
							class="header-profile"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
						<!-- Subscription button -->
						<SubscribeButton
							v-if="$store.state.session.id !== $route.params.id && paymentsEnabled"
							:toggleSubscription="toggleSubscription"
							:userIsSubscribed="activeSubscription"
							class="header-profile ml-2"
							:class="scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="!scrollingDown"
						/>
					</div>
				</div>
			</div>
			<!-- Name, socials, follow, bio -->
			<div class="flex flex-row justify-between">
				<div
					id="infos"
					class="header-profile flex items-center"
					:class="$route.params.id === $store.state.session.id ? `-mt-12` : ``"
				>
					<button class="focus:outline-none" @click="showAvatar">
						<Avatar
							:avatar="visitAvatar"
							:authorID="$route.params.id"
							:size="`w-20 h-20`"
							:noClick="true"
							class="flex-shrink-0 rounded-lg"
							:class="!visitAvatar ? `cursor-default` : ``"
						/>
					</button>
					<div class="ml-5 flex flex-grow flex-col">
						<!-- Name Username, Follow button -->
						<div class="flex flex-col">
							<h3 v-if="visitProfile.name != ``" class="pr-4 text-2xl font-semibold dark:text-darkPrimaryText">
								{{ visitProfile.name }}
							</h3>
							<h3 v-else class="text-gray5 dark:text-gray3 pr-4 text-2xl font-semibold">{{ visitProfile.id }}</h3>
							<h5 class="text-gray5 dark:text-gray3 text-lg">@{{ visitProfile.id }}</h5>
						</div>
						<!-- Tabs: posts, following, followers -->
						<div class="text-gray5 -mr-12 flex flex-row pt-2 text-sm">
							<div v-if="totalPostsCount === 1" class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Post
							</div>
							<div v-else class="text-sm text-gray5 dark:text-gray3">
								<span class="text-lightPrimaryText dark:text-darkPrimaryText font-bold">{{ totalPostsCount }}</span>
								Posts
							</div>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="$emit(`openFollowers`)"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ followers.size }}</span
								>
								Followers
							</button>
							<button
								class="pl-5 text-sm text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary hover:font-bold"
								@click="$emit(`openFollowing`)"
							>
								<span
									class="text-lightPrimaryText dark:text-darkPrimaryText hover:text-primary dark:hover:text-primary font-bold"
									>{{ following.size }}</span
								>
								Following
							</button>
						</div>
					</div>
				</div>
				<!-- Profile buttons -->
				<div
					id="buttons"
					class="header-profile h-fit flex items-center xl:h-auto"
					:class="$route.params.id === $store.state.session.id ? `-mt-12` : ``"
				>
					<!-- Edit profile button -->
					<span v-if="$store.state.session.id === $route.params.id">
						<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="toggleSettings">
							<PencilIcon class="m-2 h-5 w-5 text-white" />
						</button>
						<SecondaryButton
							:text="`Edit Profile`"
							:action="toggleSettings"
							class="hidden xl:block"
							:class="!scrollingDown ? `cursor-pointer` : `cursor-default`"
							:disabled="scrollingDown"
						/>
					</span>
					<FriendButton
						v-else
						:toggleFriend="toggleFriend"
						:userIsFollowed="userIsFollowed"
						class="header-profile flex-shrink-0"
					/>
					<!-- Subscription button -->
					<SubscribeButton
						v-if="$store.state.session.id !== $route.params.id && paymentsEnabled"
						:toggleSubscription="toggleSubscription"
						:userIsSubscribed="activeSubscription"
						class="header-profile flex-shrink-0 ml-2"
					/>
					<div
						v-if="$store.state.session.id !== $route.params.id && paymentsEnabled"
						class="cursor-pointer ml-2"
						@click="toggleDonation"
					>
						<DonateButton />
					</div>
				</div>
			</div>
			<!-- Bio -->
			<div
				v-show="visitProfile.bio"
				id="bio"
				ref="bio"
				class="header-profile px-1 pt-4 dark:text-darkPrimaryText"
				:style="expandBio ? `` : `max-height: 5.5rem; overflow: hidden`"
			>
				<p>{{ visitProfile.bio.trim().slice(0, 200) + (visitProfile.bio.trim().length > 200 ? '...' : '') }}<br /></p>
			</div>
			<button
				v-show="longBio"
				id="readMore"
				class="header-profile focus:outline-none text-xs text-primary px-1"
				@click="expandBio = true"
			>
				Read more
			</button>
			<div v-show="!visitProfile.bio" id="bio" class="header-profile"></div>
			<div id="divider" class="w-full bg-lightBorder dark:bg-darkBorder my-4 rounded" style="height: 1px"></div>
			<!-- Tabs -->
			<div id="tabs" class="text-gray5 dark:text-gray3 text-sm header-profile flex w-full justify-between pb-3 xl:px-6">
				<nuxt-link :to="'/id/' + $route.params.id" class="pb-1" :class="getStyles('id-id')">
					<span class="px-4">Posts</span>
				</nuxt-link>
				<nuxt-link :to="'/id/' + $route.params.id + '/comments'" class="pb-1" :class="getStyles('id-id-comments')">
					<span class="px-4">Comments</span>
				</nuxt-link>
				<nuxt-link :to="'/id/' + $route.params.id + '/reposts'" class="pb-1" :class="getStyles('id-id-reposts')">
					<span class="px-4">Reposts</span>
				</nuxt-link>
			</div>
		</article>
		<div
			v-if="loadedContent()"
			id="scrollContainer"
			ref="scrollContainer"
			class="w-full overflow-y-auto"
			:style="
				!scrollingDown
					? `min-height: calc(100vh - ` + `290px` + `); height: calc(100vh - ` + `290px` + `)`
					: `min-height: calc(100vh - ` + `150px` + `); height: calc(100vh - ` + `150px` + `)`
			"
		>
			<nuxt-child
				:profile="visitProfile"
				:updateFollowers="updateFollowers"
				:followers="followers"
				:mutuals="mutuals"
				:mutualProfiles="mutualProfiles"
				:toggleFriend="toggleFriend"
				:userIsFollowed="userIsFollowed"
			/>
		</div>
		<!-- Settings popup -->
		<div
			v-if="showSettings"
			class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<SettingsPopup
				class="overflow-y-auto min-h-40 max-h-90 w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation rounded-lg shadow-lg"
				:updateProfileMethod="updateProfileMethod"
				@close="toggleSettings"
			/>
		</div>
		<BioPopup
			v-if="expandBio"
			:bio="visitProfile.bio"
			:authorname="visitProfile.name"
			:authorID="visitProfile.id"
			@close="expandBio = false"
		/>
		<portal-target name="bioPopup"></portal-target>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import BackButton from '@/components/icons/ChevronLeft.vue'
import SubscribeButton from '@/components/SubscribeButton.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import BioPopup from '@/components/popups/BioPopup.vue'
import { getProfile, Profile } from '@/backend/profile'
import { namespace as SubscriptionsNamespace } from '@/store/subscriptions'
import type { ISubscriptionResponse } from '@/backend/subscription'
import { getShareableProfileLink } from '@/backend/shareable_links'

interface IData {
	totalPostsCount: number
	padding: string
	showSettings: boolean
	lastScroll: number
	scrollingDown: boolean
	longBio: boolean
	expandBio: boolean
	fromExternalSite: boolean
	activeSubscription: boolean
	isLeaving: boolean
	friendlyUrl: string | null
	realUrl: string
}

export default Vue.extend({
	name: `RootIDPage`,
	components: {
		Avatar,
		FriendButton,
		SecondaryButton,
		SettingsPopup: () => import(`@/components/popups/Settings.vue`),
		BackButton,
		PencilIcon,
		BioPopup,
		SubscribeButton,
	},
	beforeRouteEnter(to, from, next) {
		next((vm: any) => {
			if (to && from.name === null) {
				vm.fromExternalSite = true
			}
		})
		return true
	},
	beforeRouteLeave(to, from, next) {
		if (this.realUrl !== `` && to.path !== from.path) {
			history.replaceState(null, ``, this.realUrl)
		}
		next()
	},
	layout: `profile`,
	props: {
		visitProfile: {
			type: Object as PropType<Profile | null>,
			default: null,
		},
		visitAvatar: {
			type: String as PropType<ArrayBuffer | string | undefined>,
			default: undefined,
		},
		followers: {
			type: Set,
			required: true,
		},
		following: {
			type: Set,
			required: true,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
		toggleSubscription: {
			type: Function as PropType<() => void>,
			required: true,
		},
		toggleDonation: {
			type: Function as PropType<() => void>,
			required: true,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
		userIsFollowed: {
			type: Boolean,
			required: true,
		},
		mutuals: {
			type: Set,
			default: new Set(),
		},
		mutualProfiles: {
			type: Array,
			default: () => {
				return []
			},
		},
		toggleEdit: {
			type: Boolean,
			required: false,
		},
		updateProfileMethod: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			totalPostsCount: 0,
			padding: `0px`,
			showSettings: false,
			lastScroll: 0,
			scrollingDown: false,
			longBio: false,
			expandBio: false,
			fromExternalSite: false,
			activeSubscription: false,
			isLeaving: false,
			friendlyUrl: null,
			realUrl: ``,
		}
	},
	head() {
		return {
			title: this.visitProfile?.name
				? `${this.visitProfile.name} (${this.$route.params.id}) - Blogchain`
				: `${this.$route.params.id} - Blogchain`,
			meta: [
				{
					hid: `description`,
					name: `description`,
					content: this.visitProfile?.bio ? this.visitProfile.bio : `${this.$route.params.id}'s profile on Blogchain.`,
				},
			],
		}
	},
	computed: {
		...mapGetters(SubscriptionsNamespace, [`activeSubs`]),
		paymentsEnabled() {
			return this.$store.getters[`paymentProfile/getPaymentProfile`](this.$route.params.id).paymentsEnabled
		},
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				// Updates post count
				window.addEventListener(`click`, this.handleClose, false)
				this.fetchProfile()
				this.initHeader()
			}
		},
		visitProfile() {
			this.$nextTick(() => {
				this.initHeader()
			})
		},
	},
	beforeDestroy() {
		this.isLeaving = true
	},
	created() {
		this.fetchProfile()
		// Check if existing subscription
		if (!this.$store.state.session.id) {
			return
		}
		getShareableProfileLink(this.$route.params.id)
			.then((friendlyUrl) => {
				this.friendlyUrl = friendlyUrl
				if (!this.isLeaving) {
					this.realUrl = this.$route.fullPath
					history.replaceState(null, ``, friendlyUrl)
				}
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log(`Cannot replace state to shareable profile link: ${err.message}`)
			})
		this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
		this.$store.state.subscriptions.active.forEach((sub: ISubscriptionResponse) => {
			if (sub.authorID === this.$route.params.id) {
				this.activeSubscription = true
			}
		})
	},
	mounted() {
		if (this.$store.state.settings.recentlyInSettings) {
			this.showSettings = true
		}
		this.$nextTick(() => {
			this.initHeader()
		})
		window.addEventListener(`click`, this.handleClose, false)
	},
	destroyed() {
		if (this.$store.state.settings.recentlyInSettings) {
			this.$store.commit(`settings/setRecentlyInSettings`, false)
		}
	},
	methods: {
		initHeader() {
			// Set scroll padding
			const topContainer = this.$refs.topContainer as HTMLElement
			this.padding = topContainer.clientHeight + `px`
			this.scrollingDown = false
			const container = document.getElementById(`scrollContainer`)
			if (container) {
				container.addEventListener(`scroll`, this.handleScrollHeader)
			}
			// handle long bios
			if (this.visitProfile && this.visitProfile.bio.trim().length > 200) {
				this.longBio = true
			}
		},
		showAvatar() {
			if (this.visitAvatar) {
				this.$emit(`showAvatar`)
			}
		},
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.showSettings = false
			}
		},
		toggleSettings(): void {
			this.showSettings = !this.showSettings
		},
		loadedContent(): boolean {
			// Check follow page
			return !(this.$route.name === `id-followers` && this.followers.size === 0)
		},
		getStyles(tab: string): string {
			let res = ``
			if (this.$route.name === tab) {
				res += ` text-primary font-bold`
			} else {
				if (this.$route.name !== `id-followers` && this.$route.name !== `id-following`) {
					res += ` text-grey1`
				}
				res += ` text-gray5 dark:text-gray3`
			}
			return res
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
		openHeader(open: boolean) {
			const body = document.getElementById(`scrollContainer`)
			const header = document.getElementById(`header`)
			const buttons = document.getElementById(`buttons`)
			const infos = document.getElementById(`infos`)
			const tabs = document.getElementById(`tabs`)
			const divider = document.getElementById(`divider`)
			const bio = document.getElementById(`bio`)
			const readMore = document.getElementById(`readMore`)
			const small = document.getElementById(`small`)
			this.padding = header?.clientHeight + `px`
			const scrollUp = `headernotcollapsed`
			const scrollDown = `headercollapsed`
			const opacity1 = `opacity1`
			const opacity0 = `opacity0`
			if (!body || !buttons || !infos || !header || !tabs || !divider || !bio || !small || !readMore) {
				return
			}
			// Close header
			if (!open) {
				this.scrollingDown = true
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
				buttons.classList.remove(opacity1)
				buttons.classList.add(opacity0)
				infos.classList.remove(opacity1)
				infos.classList.add(opacity0)
				tabs.classList.add(opacity0)
				tabs.classList.remove(opacity1)
				divider.classList.add(opacity0)
				divider.classList.remove(opacity1)
				bio.classList.add(opacity0)
				bio.classList.remove(opacity1)
				readMore.classList.add(opacity0)
				readMore.classList.remove(opacity1)
				small.classList.add(opacity1)
				small.classList.remove(opacity0)
				return
			}
			// open
			this.scrollingDown = false
			header.classList.remove(scrollDown)
			header.classList.add(scrollUp)
			buttons.classList.remove(opacity0)
			buttons.classList.add(opacity1)
			infos.classList.remove(opacity0)
			infos.classList.add(opacity1)
			tabs.classList.remove(opacity0)
			tabs.classList.add(opacity1)
			divider.classList.remove(opacity0)
			divider.classList.add(opacity1)
			bio.classList.remove(opacity0)
			bio.classList.add(opacity1)
			readMore.classList.remove(opacity0)
			readMore.classList.add(opacity1)
			small.classList.remove(opacity1)
			small.classList.add(opacity0)
		},
		handleScrollHeader() {
			const body = document.getElementById(`scrollContainer`)
			const header = document.getElementById(`header`)
			const buttons = document.getElementById(`buttons`)
			const infos = document.getElementById(`infos`)
			const tabs = document.getElementById(`tabs`)
			const bio = document.getElementById(`bio`)
			const small = document.getElementById(`small`)
			this.padding = header?.clientHeight + `px`
			const scrollDown = `headercollapsed`
			if (!body || !buttons || !infos || !header || !tabs || !bio || !small) {
				return
			}
			const currentScroll = body.scrollTop

			// Reached bottom, prevent mobile glitching
			if (currentScroll + body.clientHeight + 1 >= body.scrollHeight) {
				if (body.scrollHeight === body.clientHeight && currentScroll === 0) {
					this.openHeader(true)
					const container = document.getElementById(`scrollContainer`)
					if (container) {
						container.removeEventListener(`scroll`, this.handleScrollHeader)
					}
					return
				}
				return
			}

			// Reached top
			if (body.scrollTop <= 0 && !this.scrollingDown) {
				this.openHeader(true)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				this.openHeader(false)
			} else if (
				currentScroll < this.lastScroll &&
				header.classList.contains(scrollDown) &&
				body.scrollTop + body.clientHeight !== body.scrollHeight
			) {
				// up
				this.openHeader(true)
			}
			this.lastScroll = currentScroll
		},
		async fetchProfile() {
			if (this.$route.params.id === null) {
				return
			}
			const { totalPostsCount } = await getProfile(this.$route.params.id, true)
			this.totalPostsCount = totalPostsCount
		},
		handleBack() {
			if (this.fromExternalSite) {
				this.$router.push({ name: `home` })
				return
			}
			this.$router.go(-1)
		},
	},
})
</script>

<style>
.header-profile {
	transition: all 0.4s;
	/* z-index: 50; */
}
.headercollapsed {
	min-height: 1rem !important;
	height: 4rem !important;
}
.headernotcollapsed {
	opacity: 1;
}
.opacity0 {
	opacity: 0;
}
.opacity1 {
	opacity: 1;
}
</style>
