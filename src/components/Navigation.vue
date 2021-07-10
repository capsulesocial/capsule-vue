<template>
  <nav>
    <!-- Desktop -->
    <div
      :class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
      class="hidden lg:flex px-2 flex-col h-12 sticky top-0 pl-6 lg:fixed lg:pt-24 lg:mt-12 font-sans"
    >
      <nuxt-link
        to="/home"
        class="nav group flex items-center px-2 py-2 text-base leading-6  m-2 text-xl"
      >
        <HomeIcon class="mr-2" />
        <strong>
          Home
        </strong>
      </nuxt-link>
      <nuxt-link
        to="/discover"
        class="nav mt-1 group flex items-center px-2 py-2 text-base leading-6 m-2 text-xl"
      >
        <DiscoverIcon class="mr-2" />
        <strong>
          Discover
        </strong>
      </nuxt-link>
      <!-- profile -->
      <nuxt-link
        :to="'/' + $store.state.session.cid"
        class="nav mt-1 group flex items-center px-2 py-2 text-base leading-6 m-2 text-xl"
      >
        <ProfileIcon class="mr-2" />
        <strong>
          Profile
        </strong>
      </nuxt-link>
      <nuxt-link
        to="/messages"
        class="nav mt-1 group flex items-center px-2 py-2 text-base leading-6 m-2 text-xl"
      >
        <InboxIcon class="mr-2" />
        <strong>
          Messages
        </strong>
      </nuxt-link>
      <nuxt-link
        :to="'/' + $store.state.session.cid + '/bookmarks'"
        class="nav mt-1 group flex items-center px-2 py-2 text-base leading-6 m-2 text-xl"
      >
        <BookmarksIcon class="mr-2" />
        <strong>
          Bookmarks
        </strong>
      </nuxt-link>

      <BrandedButton text="Write Post" :action="toggleDraftMode" class="mt-5 w-48 px-12 py-4 mt-16" />
    </div>

    <!-- Mobile -->
    <div class="fixed lg:hidden bottom-0 h-16 w-full flex flex-row justify-around pb-4 pt-2 items-end bg-white z-50">
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
	},
})
</script>

<style>
a.nuxt-link-active {
  font-weight: italic;
}

a.nuxt-link-exact-active.nav {
  background-color: rgba(64, 124, 131, 0.09);
  font-weight: bold;
  color: #407c83;
  border-radius: 0.5rem;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  padding-right: 1rem;
}
</style>
