<template>
	<div class="flex flex-row justify-between items-center">
		<!-- Left side: Links + write post button -->
		<nav class="flex flex-row items-center" style="font-size: 0.95rem">
			<nuxt-link to="/home" class="mr-5">
				<CapsuleIcon />
			</nuxt-link>
			<nuxt-link to="/home" class="mx-4" :class="getStyles(`home`)"> Home </nuxt-link>
			<nuxt-link to="/discover" class="mx-4" :class="getStyles(`discover`)"> Discover </nuxt-link>
			<nuxt-link to="/bookmarks" class="mx-4" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
			<BrandedButton :text="`Write a Post`" :action="togglePostEditor" class="mx-4" />
		</nav>
		<!-- Right side: icons and avatar -->
		<div class="flex flex-row relative">
			<button class="dropdown focus:outline-none" @click="showDropdown = !showDropdown">
				<Avatar class="dropdown" :avatar="avatar" :authorID="$store.state.session.id" :noClick="true" />
			</button>
			<!-- Dropdown: Profile, settings, disconnect -->
			<div
				v-show="showDropdown"
				class="
					absolute
					flex flex-col
					mt-12
					rounded-lg
					shadow-lg
					p-4
					bg-gradient-to-r
					from-lightBGStart
					to-lightBGStop
					backdrop-filter backdrop-blur-lg
				"
				style="margin-left: -6rem"
			>
				<nuxt-link :to="$store.state.session.id" class="text-left w-full flex flex-row items-center text-gray7 mb-4"
					><ProfileIcon class="flex-shrink-0 w-5 h-5 mr-2" />Profile</nuxt-link
				>
				<nuxt-link to="/settings" class="text-left w-full flex flex-row items-center text-gray7 mb-4">
					<SettingsIcon class="flex-shrink-0 w-5 h-5 mr-2" />Settings</nuxt-link
				>
				<button
					class="focus:outline-none w-full text-left flex flex-row items-center text-lightError"
					@click="disconnect"
				>
					<LogoutIcon class="flex-shrink-0 w-5 h-5 mr-2" />Disconnect
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { keyStores } from 'near-api-js'

import CapsuleIcon from '@/components/icons/Capsule.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import ProfileIcon from '@/components/icons/Profile.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import LogoutIcon from '@/components/icons/Logout.vue'

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

interface IData {
	showDropdown: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		Avatar,
		BrandedButton,
		ProfileIcon,
		SettingsIcon,
		LogoutIcon,
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
			this.$router.push(`/`)
		},
		handleDropdown(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (!e.target.parentNode.classList.contains(`dropdown`)) {
				this.showDropdown = false
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
		logout() {
			this.endSession()
			window.localStorage.removeItem(`accountId`)
			const keystore = new keyStores.BrowserLocalStorageKeyStore()
			keystore.clear()
			this.$router.push(`/`)
		},
		togglePostEditor() {
			this.$router.push(`/post`)
		},
	},
})
</script>
