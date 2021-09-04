<template>
	<header
		:class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'"
		class="w-full flex justify-center z-20 border-b py-4 xl:pr-16"
	>
		<!-- Top Left: Logo -->
		<div class="flex xl:justify-between" style="width: 240px">
			<CapsuleIcon class="ml-8 xl:ml-0 mr-2" />
			<div
				class="flex md:pl-8 xl:pl-0"
				:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
			>
				<button class="focus:outline-none" @click="$router.go(-1)">
					<BackButton />
				</button>
				<button class="focus:outline-none" @click="$router.go(1)">
					<ForwardButton />
				</button>
			</div>
		</div>

		<!-- Top Right -->
		<article class="relative hidden md:flex md:justify-center xl:justify-end items-center xl:ml-0" style="width: 640px">
			<div class="flex items-center">
				<span>
					<button
						class="bg-gray1 rounded-full focus:outline-none flex justify-center shadow-lg"
						style="width: 38px; height: 38px"
					>
						<SearchIcon class="self-center" />
					</button>
				</span>
				<span class="px-3">
					<button
						class="bg-gray1 rounded-full focus:outline-none flex justify-center shadow-lg"
						style="width: 38px; height: 38px"
					>
						<NotificationsIcon class="self-center" />
					</button>
				</span>
				<span class="dropdown">
					<button
						class="bg-gray1 rounded-full focus:outline-none flex justify-center shadow-lg"
						style="width: 38px; height: 38px"
						@click.stop="toggleDropdown"
					>
						<DownIcon v-show="!showMore" class="self-center dropdown" />
						<UpIcon v-show="showMore" class="self-center dropdown" />
					</button>
				</span>
			</div>
			<!-- Dropdown menu -->
			<div
				v-show="showMore"
				class="absolute mt-56 z-10 bg-white shadow-lg rounded-lg w-64"
				style="margin-right: -7rem"
				@click.stop="toggleDropdown"
			>
				<nuxt-link to="/settings" class="w-full p-2 grid grid-cols-4 items-center">
					<span class="bg-gray1 rounded-full w-10 h-10 flex justify-center">
						<SettingsIcon class="self-center" />
					</span>
					<h5 class="text-base font-sans justify-self-start col-span-2">Settings</h5>
					<ForwardButton class="justify-self-end" />
				</nuxt-link>
				<nuxt-link to="/help" class="w-full p-2 grid grid-cols-4 items-center">
					<span class="bg-gray1 rounded-full w-10 h-10 flex justify-center">
						<HelpIcon class="self-center" />
					</span>
					<h5 class="text-base font-sans justify-self-start col-span-2">Help & Support</h5>
					<ForwardButton class="justify-self-end" />
				</nuxt-link>
				<button class="w-full p-2 grid grid-cols-4 items-center" @click="logout">
					<span class="bg-gray1 rounded-full w-10 h-10 flex justify-center">
						<LogoutIcon class="self-center" />
					</span>
					<h5 class="text-base font-sans justify-self-start col-span-2">Log Out</h5>
					<span></span>
				</button>
			</div>
		</article>
	</header>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import CapsuleIcon from '@/components/icons/Capsule.vue'
import NotificationsIcon from '@/components/icons/Notifications.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import BackButton from '@/components/icons/ChevronLeft.vue'
import ForwardButton from '@/components/icons/ChevronRight.vue'
import DownIcon from '@/components/icons/ChevronDown.vue'
import UpIcon from '@/components/icons/ChevronUp.vue'
import SearchIcon from '@/components/icons/Search.vue'
import HelpIcon from '@/components/icons/Help.vue'
import LogoutIcon from '@/components/icons/Logout.vue'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

export default Vue.extend({
	components: {
		CapsuleIcon,
		SettingsIcon,
		NotificationsIcon,
		BackButton,
		ForwardButton,
		SearchIcon,
		DownIcon,
		UpIcon,
		HelpIcon,
		LogoutIcon,
	},
	data() {
		return {
			showMore: false,
		}
	},
	mounted() {
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`dropdown`)
				) {
					this.showMore = false
				}
			},
			false,
		)
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			endSession: MutationType.LOGOUT,
		}),
		logout() {
			this.endSession()
			this.$router.push(`/`)
		},
		toggleDropdown() {
			this.showMore = !this.showMore
		},
	},
})
</script>
