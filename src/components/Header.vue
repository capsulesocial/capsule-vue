<template>
	<header class="sticky top-0 w-full px-3 lg:px-0" :class="showMobileMenu || showDropdown ? `z-20` : ``">
		<!-- Desktop header -->
		<nav class="w-full flex-no-wrap hidden flex-row items-center justify-between py-5 lg:flex">
			<!-- Left side: Links + write post button -->
			<div class="flex flex-row items-center" style="font-size: 0.95rem">
				<nuxt-link to="/home" class="mr-5 text-lightSecondaryText dark:text-gray1">
					<CapsuleBlogchain />
				</nuxt-link>
				<nuxt-link to="/home" class="mx-4" :class="getStyles(`home`)"> Home </nuxt-link>
				<nuxt-link to="/discover" class="mx-4" :class="getStyles(`discover`)"> Discover </nuxt-link>
				<nuxt-link to="/bookmarks" class="mx-4" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
				<BrandedButton :text="`Write a Post`" :action="togglePostEditor" class="mx-4" />
			</div>
			<!-- Right side: icons and avatar -->
			<div class="relative flex flex-row">
				<button class="dropdown focus:outline-none" @click="showDropdown = !showDropdown">
					<Avatar
						class="dropdown"
						:avatar="$store.state.session.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : avatar"
						:authorID="$store.state.session.id"
						:noClick="true"
						:size="`w-10 h-10 xl:w-12 xl:h-12`"
					/>
				</button>
				<!-- Dropdown: Profile, settings, disconnect -->
				<div
					v-show="showDropdown"
					class="w-max bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation absolute mt-16 flex flex-col rounded-lg border p-4 shadow-lg right-0"
					:class="$colorMode.dark ? `dropdownOpenDark` : `dropdownOpen`"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-gray5 dark:text-gray3 mx-2 mb-4 flex w-24 flex-row items-center text-left"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-gray5 dark:text-gray3 mx-2 flex w-24 flex-row items-center text-left"
						>Register</nuxt-link
					>
					<!-- Authenticated -->
					<div v-if="$store.state.session.id !== ``" class="flex items-center">
						<div class="flex flex-col items-start">
							<p class="text-lg text-lightPrimaryText dark:text-darkPrimaryText font-semibold -mt-1">
								{{ $store.state.session.name }}
							</p>
							<p class="text-sm text-primary">@{{ $store.state.session.id }}</p>
						</div>
					</div>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</nuxt-link
					>
					<a
						v-if="$store.state.session.id !== ``"
						:href="authordashboardURL"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
						><DashboardIcon class="mr-2 h-5 w-5 flex-shrink-0" />Author Dashboard</a
					>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/subscriptions"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
					>
						<Crown2Icon class="mr-2 h-5 w-5 flex-shrink-0" />Subscriptions</nuxt-link
					>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none text-negative flex w-full flex-row items-center text-left"
						@click="disconnect"
					>
						<LogoutIcon class="mr-2 h-5 w-5 flex-shrink-0" />Disconnect
					</button>
				</div>
			</div>
		</nav>
		<!-- Mobile header -->
		<nav class="flex w-full items-center justify-between p-2 lg:hidden">
			<!-- Mobile menu dropdown -->
			<div class="relative">
				<button class="mobileDropdown" @click="showMobileMenu = !showMobileMenu">
					<MobileNav class="mobileDropdown text-lightSecondaryText dark:text-gray1" />
				</button>
				<div
					v-show="showMobileMenu"
					class="bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation absolute mt-2 ml-0 flex flex-col rounded-lg border p-4 shadow-lg"
					:class="$colorMode.dark ? `dropdownMainOpenDark` : `dropdownMainOpen`"
				>
					<nuxt-link
						to="/home"
						class="mb-4 flex w-full flex-row items-center border-none text-left"
						:class="getStyles(`home`)"
					>
						<HomeIcon class="mr-2 h-5 w-5 flex-shrink-0" />Home</nuxt-link
					>
					<nuxt-link
						to="/discover"
						class="mb-4 flex w-full flex-row items-center border-none text-left"
						:class="getStyles(`discover`)"
					>
						<DiscoverIcon class="mr-2 h-5 w-5 flex-shrink-0" />Discover</nuxt-link
					>
					<nuxt-link
						to="/bookmarks"
						class="flex w-full flex-row items-center border-none text-left"
						:class="getStyles(`bookmarks`)"
					>
						<BookmarksIcon class="mr-2 h-5 w-5 flex-shrink-0" />Bookmarks</nuxt-link
					>
				</div>
			</div>
			<!-- Middle branding -->
			<nuxt-link to="/home">
				<div class="flex items-center">
					<CapsuleIcon class="text-lightSecondaryText dark:text-gray1 mr-2" />
					<h1 class="text-lightSecondaryText dark:text-gray1 font-sans text-xl font-bold">Blogchain</h1>
				</div>
			</nuxt-link>
			<div class="relative mt-2">
				<button class="dropdown focus:outline-none" @click="toggleMobileMenu">
					<Avatar
						class="dropdown"
						:avatar="$store.state.session.id === `` ? require(`@/assets/images/avatars/unauthenticated.webp`) : avatar"
						:authorID="$store.state.session.id"
						:noClick="true"
					/>
				</button>
				<!-- Dropdown: Profile, settings, disconnect -->
				<div
					v-show="showDropdown"
					class="w-max bg-lightBG dark:bg-darkBGStop border-lightBorder modal-animation absolute mt-2 flex flex-col rounded-lg border p-4 shadow-lg right-0"
					:class="$colorMode.dark ? `dropdownOpenDark` : `dropdownOpen`"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-gray5 dark:text-gray3 mx-2 mb-2 flex w-24 flex-row items-center text-left"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-gray5 dark:text-gray3 mx-2 flex w-24 flex-row items-center text-left"
						>Register</nuxt-link
					>
					<div v-if="$store.state.session.id !== ``" class="flex items-center">
						<div class="flex flex-col items-start">
							<p class="text-lg text-lightPrimaryText dark:text-darkPrimaryText font-semibold -mt-1">
								{{ $store.state.session.name }}
							</p>
							<p class="text-sm text-primary">@{{ $store.state.session.id }}</p>
						</div>
					</div>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</nuxt-link
					>
					<a
						v-if="$store.state.session.id !== ``"
						:href="authordashboardURL"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
						><DashboardIcon class="mr-2 h-5 w-5 flex-shrink-0" />Author Dashboard</a
					>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/subscriptions"
						class="text-gray5 dark:text-gray3 flex w-full flex-row items-center text-left"
					>
						<Crown2Icon class="mr-2 h-5 w-5 flex-shrink-0" />Subscriptions</nuxt-link
					>
					<div
						v-if="$store.state.session.id !== ``"
						class="bg-lightBorder dark:bg-darkBorder w-full rounded my-3"
						style="height: 1px"
					></div>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-gray5 dark:text-gray3 mb-2 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none text-negative flex w-full flex-row items-center text-left"
						@click="disconnect"
					>
						<LogoutIcon class="mr-2 h-5 w-5 flex-shrink-0" />Disconnect
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapGetters, mapMutations } from 'vuex'
import { BrowserLocalStorageKeyStore } from 'near-api-js/lib/key_stores/browser_local_storage_key_store'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import ProfileIcon from '@/components/icons/Profile.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import LogoutIcon from '@/components/icons/Logout.vue'
import MobileNav from '@/components/icons/MobileNav.vue'
import HomeIcon from '@/components/icons/Home.vue'
import DiscoverIcon from '@/components/icons/Discover.vue'
import BookmarksIcon from '@/components/icons/Bookmarks.vue'
import CapsuleBlogchain from '@/components/icons/CapsuleBlogchain.vue'
import Crown2Icon from '@/components/icons/Crown2.vue'
import DashboardIcon from '@/components/icons/OverviewIcon.vue'
import { MutationType as profileMutation, namespace as paymentProfileNamespace } from '@/store/paymentProfile'

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { MutationType as subscriptionMutation, namespace as subscriptionNamespace } from '~/store/subscriptions'
import {
	MutationType as subscriptionTierMutation,
	namespace as subscriptionTierNamespace,
} from '~/store/subscriptionTiers'
import { MutationType as draftMutation, namespace as draftNamespace } from '~/store/draft'
import { MutationType as settingMutation, namespace as settingNamespace } from '~/store/settings'
import { walletLogout } from '@/backend/near'

interface IData {
	showDropdown: boolean
	showMobileMenu: boolean
	authordashboardURL: string
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		Avatar,
		BrandedButton,
		ProfileIcon,
		SettingsIcon,
		LogoutIcon,
		MobileNav,
		HomeIcon,
		DiscoverIcon,
		BookmarksIcon,
		CapsuleBlogchain,
		Crown2Icon,
		DashboardIcon,
	},
	props: {
		avatar: {
			type: String as PropType<string | ArrayBuffer>,
			default: ``,
		},
	},
	data(): IData {
		return {
			showDropdown: false,
			showMobileMenu: false,
			authordashboardURL: window.location.origin + `/authordashboard`,
		}
	},
	computed: {
		...mapGetters(paymentProfileNamespace, [`getPaymentProfile`]),
	},
	created() {
		// Set filter dropdown event handler
		window.addEventListener(`click`, this.handleDropdown, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleDropdown)
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			endSession: MutationType.LOGOUT,
		}),
		...mapMutations(paymentProfileNamespace, {
			resetProfile: profileMutation.RESET,
		}),
		...mapMutations(subscriptionNamespace, {
			resetSubs: subscriptionMutation.RESET,
		}),
		...mapMutations(subscriptionTierNamespace, {
			resetSubTiers: subscriptionTierMutation.LOGOUT,
		}),
		...mapMutations(draftNamespace, {
			clearDrafts: draftMutation.CLEAR_DRAFTS,
		}),
		...mapMutations(settingNamespace, {
			resetSettings: settingMutation.RESET_SETTINGS,
		}),
		disconnect(): void {
			this.endSession()
			this.resetProfile()
			this.resetSubs()
			this.resetSubTiers()
			this.clearDrafts()
			this.resetSettings()

			this.$store.commit(`reset`)
			this.$store.commit(`widgets/reset`)

			const keystore = new BrowserLocalStorageKeyStore()
			keystore.clear()

			window.localStorage.clear()
			walletLogout()

			this.$router.push(`/login`)
		},
		toggleMobileMenu() {
			this.showDropdown = !this.showDropdown
		},
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`dropdown`)) {
				this.showDropdown = false
			}
			if (!e.target.parentNode.classList.contains(`mobileDropdown`)) {
				this.showMobileMenu = false
			}
		},
		getStyles(tab: string): string {
			let res: string = ``
			// Check if current tab
			if (this.$route.name === tab) {
				res += `font-bold text-primary`
			} else {
				res += `font-regular text-gray5 dark:text-gray3`
			}
			return res
		},
		togglePostEditor() {
			// Check auth
			if (this.$store.state.session.id === ``) {
				// trigger popup
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (this.$route.name !== `post`) {
				if (this.$route.name === `home` && this.$store.state.widgets.primary === `editor`) {
					this.$store.commit(`draft/handleDraftWidget`, true)
					this.$router.push(`/post`)
					return
				}
				this.$store.commit(`draft/createDraft`)
				this.$router.push(`/post`)
			}
		},
	},
})
</script>
<style>
.dropdownOpen {
	margin-left: -6rem;
}
.dropdownOpenDark {
	margin-left: -6rem;
}
.dropdownOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: rgba(46, 46, 46, 0.95);
	border-radius: 2px;
}
.dropdownMainOpen {
	margin-top: 1rem !important;
	margin-left: -1rem !important;
}
.dropdownMainOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
}
.dropdownMainOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: rgba(46, 46, 46, 0.95);
	border-radius: 2px;
}
</style>
