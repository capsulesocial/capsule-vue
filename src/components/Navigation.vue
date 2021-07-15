<template>
  <nav>
    <!-- Desktop -->
    <div
      :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkSecondaryText bg-darkBG'"
      class="hidden md:flex flex-col px-2  h-screen sticky top-0 xl:pl-6 md:fixed md:pt-24 xl:mt-12"
    >
      <nuxt-link
        to="/home"
        :class="this.getStyles('home')"
        class="group flex items-center p-2 text-base leading-6 m-2 text-xl rounded-xl"
      >
        <span class="p-2">
          <HomeIcon />
        </span>
        <strong class="hidden xl:block ml-2">
          Home
        </strong>
      </nuxt-link>
      <nuxt-link
        to="/discover"
        :class="this.getStyles('discover')"
        class="group flex items-center p-2 text-base leading-6 m-2 text-xl rounded-xl"
      >
        <span class="p-2">
          <DiscoverIcon />
        </span>
        <strong class="hidden xl:block ml-2">
          Discover
        </strong>
      </nuxt-link>
      <!-- profile -->
      <nuxt-link
        :to="'/' + $store.state.session.cid"
        :class="this.getStyles(this.$store.state.session.cid)"
        class="group flex items-center p-2 text-base leading-6 m-2 text-xl rounded-xl"
      >
        <span class="p-2">
          <ProfileIcon />
        </span>
        <strong class="hidden xl:block ml-2">
          Profile
        </strong>
      </nuxt-link>
      <nuxt-link
        to="/messages"
        :class="this.getStyles('messages')"
        class="group flex items-center p-2 text-base leading-6 m-2 text-xl rounded-xl"
      >
        <span class="p-2">
          <InboxIcon />
        </span>
        <strong class="hidden xl:block ml-2">
          Messages
        </strong>
      </nuxt-link>
      <nuxt-link
        :to="'/' + $store.state.session.cid + '/bookmarks'"
        :class="this.getStyles('id-bookmarks')"
        class="group flex items-center p-2 text-base leading-6 m-2 text-xl rounded-xl"
      >
        <span class="p-2">
          <BookmarksIcon />
        </span>
        <strong class="hidden xl:block ml-2">
          Bookmarks
        </strong>
      </nuxt-link>
      <div
        :class="this.$store.state.settings.darkMode ? 'text-lightOnPrimaryText bg-lightPrimary' : 'text-darkOnPrimary bg-darkPrimary'"
        class="xl:hidden group flex items-center p-2 text-base leading-6 m-2 mt-16 text-xl rounded-xl"
        @click="toggleDraftMode"
      >
        <span
          class="p-2"
        >
          <PencilIcon class="fill-current" />
        </span>
      </div>
      <BrandedButton text="Write Post" :action="toggleDraftMode" class="hidden xl:block mt-5 w-48 px-12 py-4 mt-16" />
    </div>

    <!-- Mobile -->
    <div class="fixed md:hidden bottom-0 h-16 w-full flex flex-row justify-around pb-4 pt-2 items-end bg-white z-50">
      <nuxt-link to="/home">
        <HomeIcon
          v-if="this.$route.path === '/home'"
          class="stroke-current text-primary"
        />
        <HomeIcon v-else class="stroke-current text-gray-400" />
      </nuxt-link>
      <nuxt-link to="/discover">
        <DiscoverIcon
          v-if="this.$route.path === '/discover'"
          class="stroke-current text-primary"
        />
        <DiscoverIcon v-else class="stroke-current text-gray-400" />
      </nuxt-link>
      <button
        class="focus:outline-none bg-primary p-4 rounded-full shadow-lg"
        @click="toggleDraftMode()"
      >
        <PencilIcon class="fill-current text-white" />
      </button>
      <ProfileIcon
        v-if="this.$route.params.id === this.$store.state.session.cid"
        class="stroke-current text-primary"
      />
      <nuxt-link v-else :to="$store.state.session.cid">
        <ProfileIcon class="stroke-current text-gray-400" />
      </nuxt-link>
      <nuxt-link to="/settings">
        <SettingsIcon
          v-if="this.$route.path === '/settings'"
          class="text-primary"
        />
        <SettingsIcon v-else class="fill-gray-400 text-gray-400" />
      </nuxt-link>
    </div>
  </nav>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'

import HomeIcon from '@/components/icons/Home.vue'
import DiscoverIcon from '@/components/icons/Discover.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import SettingsIcon from '@/components/icons/Settings.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import BookmarksIcon from '@/components/icons/Bookmarks.vue'
import InboxIcon from '@/components/icons/Inbox.vue'
import { actionType, namespace as settingStoreNamespace } from '~/store/settings'

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
	data () {
		return {
			isProfileActions: false,
		}
	},
	methods: {
		...mapActions(settingStoreNamespace, {
			toggleDraftMode: actionType.TOGGLE_DRAFT_MODE,
		}),
		toggleProfileActions () {
			this.isProfileActions = !this.isProfileActions
		},
		getStyles (tab: string): string {
			let res = ``
			// Check if current tab
			if (this.$route.name === tab || (this.$route.name === `id` && tab === this.$store.state.session.cid)) {
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

<style>
</style>
