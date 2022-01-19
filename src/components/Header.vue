<template>
	<header
		class="w-full sticky top-0 bg-gradient-to-r px-3 xl:px-0"
		:class="showMobileMenu || showDropdown ? `z-20` : ``"
	>
		<!-- Desktop header -->
		<nav class="hidden xl:min-w-1220 xl:flex py-5 flex-row flex-no-wrap justify-between items-center">
			<!-- Left side: Links + write post button -->
			<div class="flex flex-row items-center" style="font-size: 0.95rem">
				<nuxt-link to="/home" class="mr-5">
					<CapsuleIcon />
				</nuxt-link>
				<nuxt-link to="/home" class="mx-4" :class="getStyles(`home`)"> Home </nuxt-link>
				<nuxt-link to="/discover" class="mx-4" :class="getStyles(`discover`)"> Discover </nuxt-link>
				<nuxt-link to="/bookmarks" class="mx-4" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
				<BrandedButton :text="`Write a Post`" :action="togglePostEditor" class="mx-4" />
			</div>
			<!-- Right side: icons and avatar -->
			<div class="flex flex-row relative">
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
					class="dropdownOpen absolute flex flex-col mt-16 rounded-lg shadow-lg p-4 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder modal-animation"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-left flex flex-row items-center text-gray5 mb-4 w-24 mx-2"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-left flex flex-row items-center text-gray5 w-24 mx-2"
						>Register</nuxt-link
					>
					<!-- Authenticated -->
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-left w-full flex flex-row items-center text-gray5 mb-4"
						><ProfileIcon class="flex-shrink-0 w-5 h-5 mr-2" />Profile</nuxt-link
					>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-left w-full flex flex-row items-center text-gray5 mb-4"
					>
						<SettingsIcon class="flex-shrink-0 w-5 h-5 mr-2" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none w-full text-left flex flex-row items-center text-lightError"
						@click="disconnect"
					>
						<LogoutIcon class="flex-shrink-0 w-5 h-5 mr-2" />Disconnect
					</button>
				</div>
			</div>
		</nav>
		<!-- Mobile header -->
		<nav class="flex xl:hidden w-full p-2 justify-between items-center">
			<!-- Mobile menu dropdown -->
			<div class="relative">
				<button class="mobileDropdown" @click="showMobileMenu = !showMobileMenu">
					<MobileNav class="mobileDropdown" />
				</button>
				<div
					v-show="showMobileMenu"
					class="absolute flex flex-col mt-2 ml-0 rounded-lg shadow-lg p-4 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder modal-animation"
				>
					<nuxt-link to="/home" class="text-left w-full flex flex-row items-center text-gray5 mb-4">
						<HomeIcon class="flex-shrink-0 w-5 h-5 mr-2" />Home</nuxt-link
					>
					<nuxt-link to="/discover" class="text-left w-full flex flex-row items-center text-gray5 mb-4">
						<DiscoverIcon class="flex-shrink-0 w-5 h-5 mr-2" />Discover</nuxt-link
					>
					<nuxt-link to="/bookmarks" class="text-left w-full flex flex-row items-center text-gray5">
						<BookmarksIcon class="flex-shrink-0 w-5 h-5 mr-2" />Bookmarks</nuxt-link
					>
				</div>
			</div>
			<!-- Middle branding -->
			<nuxt-link to="/home">
				<div class="flex items-center">
					<CapsuleIcon />
					<h1 class="text-xl font-bold font-sans text-primary">Blogchain</h1>
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
					class="dropdownOpen absolute flex flex-col mt-2 rounded-lg shadow-lg p-4 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg border border-lightBorder modal-animation"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-left flex flex-row items-center text-gray5 mb-4 w-24 mx-2"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-left flex flex-row items-center text-gray5 w-24 mx-2"
						>Register</nuxt-link
					>
					<!-- Authenticated -->
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-left w-full flex flex-row items-center text-gray5 mb-4"
						><ProfileIcon class="flex-shrink-0 w-5 h-5 mr-2" />Profile</nuxt-link
					>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-left w-full flex flex-row items-center text-gray5 mb-4"
					>
						<SettingsIcon class="flex-shrink-0 w-5 h-5 mr-2" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none w-full text-left flex flex-row items-center text-lightError"
						@click="disconnect"
					>
						<LogoutIcon class="flex-shrink-0 w-5 h-5 mr-2" />Disconnect
					</button>
				</div>
			</div>
		</nav>
	</header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { keyStores } from 'near-api-js'

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

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

interface IData {
	showDropdown: boolean
	showMobileMenu: boolean
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
	},
	props: {
		avatar: {
			type: String,
			default: ``,
		},
	},
	data(): IData {
		return {
			showDropdown: false,
			showMobileMenu: false,
		}
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
		disconnect(): void {
			this.endSession()
			window.localStorage.removeItem(`accountId`)
			const keystore = new keyStores.BrowserLocalStorageKeyStore()
			keystore.clear()
			this.$store.commit(`draft/clearDrafts`)
			this.$store.commit(`reset`)
			this.$store.commit(`widgets/reset`)
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
				res += `font-bold text-primary border-primary border-b`
			} else {
				res += `font-regular text-gray5`
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
	backdrop-filter: blur(10px);
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
</style>
