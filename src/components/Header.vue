<template>
	<header
		class="sticky top-0 w-full bg-gradient-to-r px-3 xl:px-0"
		:class="showMobileMenu || showDropdown ? `z-20` : ``"
	>
		<!-- Desktop header -->
		<nav class="xl:min-w-1220 flex-no-wrap hidden flex-row items-center justify-between py-5 xl:flex">
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
					class="dropdownOpen from-lightBGStart to-lightBGStop border-lightBorder modal-animation absolute mt-16 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-gray5 mx-2 mb-4 flex w-24 flex-row items-center text-left"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-gray5 mx-2 flex w-24 flex-row items-center text-left"
						>Register</nuxt-link
					>
					<!-- Authenticated -->
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-gray5 mb-4 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</nuxt-link
					>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-gray5 mb-4 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none text-lightError flex w-full flex-row items-center text-left"
						@click="disconnect"
					>
						<LogoutIcon class="mr-2 h-5 w-5 flex-shrink-0" />Disconnect
					</button>
				</div>
			</div>
		</nav>
		<!-- Mobile header -->
		<nav class="flex w-full items-center justify-between p-2 xl:hidden">
			<!-- Mobile menu dropdown -->
			<div class="relative">
				<button class="mobileDropdown" @click="showMobileMenu = !showMobileMenu">
					<MobileNav class="mobileDropdown" />
				</button>
				<div
					v-show="showMobileMenu"
					class="dropdownMainOpen from-lightBGStart to-lightBGStop border-lightBorder modal-animation absolute mt-2 ml-0 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter"
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
					<CapsuleIcon />
					<h1 class="text-primary font-sans text-xl font-bold">Blogchain</h1>
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
					class="dropdownOpen from-lightBGStart to-lightBGStop border-lightBorder modal-animation absolute mt-2 flex flex-col rounded-lg border bg-gradient-to-r p-4 shadow-lg backdrop-blur-lg backdrop-filter"
				>
					<!-- Unauthenticated: Log in -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/login"
						class="text-gray5 mx-2 mb-4 flex w-24 flex-row items-center text-left"
						>Log In</nuxt-link
					>
					<!-- Unauthenticated: Register -->
					<nuxt-link
						v-if="$store.state.session.id === ``"
						to="/register"
						class="text-gray5 mx-2 flex w-24 flex-row items-center text-left"
						>Register</nuxt-link
					>
					<!-- Authenticated -->
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						:to="`/id/` + $store.state.session.id"
						class="text-gray5 mb-4 flex w-full flex-row items-center text-left"
						><ProfileIcon class="mr-2 h-5 w-5 flex-shrink-0" />Profile</nuxt-link
					>
					<nuxt-link
						v-if="$store.state.session.id !== ``"
						to="/settings/account"
						class="text-gray5 mb-4 flex w-full flex-row items-center text-left"
					>
						<SettingsIcon class="mr-2 h-5 w-5 flex-shrink-0" />Settings</nuxt-link
					>
					<button
						v-if="$store.state.session.id !== ``"
						class="focus:outline-none text-lightError flex w-full flex-row items-center text-left"
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
.dropdownMainOpen {
	margin-top: 1rem !important;
	margin-left: -1rem !important;
	backdrop-filter: blur(10px);
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
</style>
