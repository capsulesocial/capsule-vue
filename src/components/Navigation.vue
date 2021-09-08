<template>
	<nav class="flex justify-center lg:justify-start lg:pl-2 xl:pl-0">
		<!-- Desktop -->
		<div
			:class="
				this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkSecondaryText bg-darkBG'
			"
			class="hidden md:flex flex-col h-screen sticky top-0 md:fixed md:pt-24 lg:mt-12"
		>
			<nuxt-link
				to="/home"
				:class="this.getStyles('home')"
				class="group flex items-center p-2 text-base leading-6 m-1 text-xl rounded-xl"
			>
				<span class="p-2">
					<HomeIcon />
				</span>
				<strong class="hidden lg:block ml-2"> Home </strong>
			</nuxt-link>
			<nuxt-link
				to="/discover"
				:class="this.getStyles('discover')"
				class="group flex items-center p-2 text-base leading-6 m-1 text-xl rounded-xl"
			>
				<span class="p-2">
					<DiscoverIcon />
				</span>
				<strong class="hidden lg:block ml-2"> Discover </strong>
			</nuxt-link>
			<!-- profile -->
			<nuxt-link
				:to="'/' + $store.state.session.id"
				:class="this.getStyles(this.$store.state.session.id)"
				class="group flex items-center p-2 text-base leading-6 m-1 text-xl rounded-xl"
			>
				<span class="p-2">
					<ProfileIcon />
				</span>
				<strong class="hidden lg:block ml-2"> Profile </strong>
			</nuxt-link>
			<nuxt-link
				to="/messages"
				:class="this.getStyles('messages')"
				class="group flex items-center p-2 text-base leading-6 m-1 text-xl rounded-xl"
			>
				<span class="p-2">
					<InboxIcon />
				</span>
				<strong class="hidden lg:block ml-2"> Messages </strong>
			</nuxt-link>
			<nuxt-link
				:to="'/' + $store.state.session.id + '/bookmarks'"
				:class="this.getStyles('id-bookmarks')"
				class="group flex items-center p-2 text-base leading-6 m-1 text-xl rounded-xl"
			>
				<span class="p-2">
					<BookmarksIcon />
				</span>
				<strong class="hidden lg:block ml-2"> Bookmarks </strong>
			</nuxt-link>
			<nuxt-link
				to="/post"
				:class="
					this.$store.state.settings.darkMode
						? 'text-lightOnPrimaryText bg-lightPrimary'
						: 'text-darkOnPrimary bg-darkPrimary'
				"
				class="lg:hidden group flex items-center p-2 text-base leading-6 m-1 mt-16 text-xl rounded-xl"
			>
				<span class="p-2">
					<PencilIcon class="fill-current" />
				</span>
			</nuxt-link>
			<BrandedButton text="Write Post" :action="redirect" class="hidden lg:block mt-5 w-48 px-12 py-4 mt-16" />
		</div>

		<!-- Mobile -->
		<div class="fixed md:hidden bottom-0 h-16 w-full flex flex-row justify-around pb-4 pt-2 items-end bg-white z-50">
			<nuxt-link to="/home">
				<HomeIcon v-show="this.$route.path === '/home'" class="stroke-current text-primary" />
				<HomeIcon v-show="this.$route.path !== '/home'" class="stroke-current text-gray-400" />
			</nuxt-link>
			<nuxt-link to="/discover">
				<DiscoverIcon v-show="this.$route.path === '/discover'" class="stroke-current text-primary" />
				<DiscoverIcon v-show="this.$route.path !== '/discover'" class="stroke-current text-gray-400" />
			</nuxt-link>
			<nuxt-link to="/post" class="focus:outline-none bg-primary p-4 rounded-full shadow-lg">
				<PencilIcon class="fill-current text-white" />
			</nuxt-link>
			<ProfileIcon
				v-show="this.$route.params.id === this.$store.state.session.id"
				class="stroke-current text-primary"
			/>
			<nuxt-link v-show="this.$route.params.id !== this.$store.state.session.id" :to="$store.state.session.id">
				<ProfileIcon class="stroke-current text-gray-400" />
			</nuxt-link>
			<nuxt-link to="/settings">
				<SettingsIcon v-show="this.$route.path === '/settings'" class="text-primary" />
				<SettingsIcon v-show="this.$route.path !== '/settings'" class="fill-gray-400 text-gray-400" />
			</nuxt-link>
		</div>
	</nav>
</template>

<script lang="ts">
import Vue from 'vue'

import HomeIcon from '@/components/icons/Home.vue'
import DiscoverIcon from '@/components/icons/Discover.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import BookmarksIcon from '@/components/icons/Bookmarks.vue'
import InboxIcon from '@/components/icons/Inbox.vue'

export default Vue.extend({
	components: {
		HomeIcon,
		DiscoverIcon,
		PencilIcon,
		ProfileIcon,
		SettingsIcon,
		BrandedButton,
		BookmarksIcon,
		InboxIcon,
	},
	data() {
		return {
			isProfileActions: false,
		}
	},
	methods: {
		toggleProfileActions() {
			this.isProfileActions = !this.isProfileActions
		},
		redirect() {
			this.$router.push(`/post`)
		},
		getStyles(tab: string): string {
			let res = ``
			// Check if current tab
			if (this.$route.name === tab || (this.$route.name === `id` && tab === this.$store.state.session.id)) {
				// Check dark mode
				if (this.$store.state.settings.darkMode) {
					res += `text-lightPrimary bg-lightPrimary shadow-lg bg-opacity-25`
				} else {
					res += `text-darkOnPrimaryText bg-darkPrimary bg-opacity-50`
				}
			}
			return res
		},
	},
})
</script>

<style></style>
