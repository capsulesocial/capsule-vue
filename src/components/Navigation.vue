<template>
  <nav>
    <!-- Desktop -->
    <div
      class="hidden lg:flex px-2 flex-col text-gray-500 h-12 sticky top-0 pl-6 lg:fixed lg:pt-24"
    >
      <nuxt-link
        to="/home"
        class="group flex items-center px-2 py-2 text-base leading-6 font-semibold m-2"
      >
        <HomeIcon class="mr-2" />
        Home
      </nuxt-link>
      <nuxt-link
        to="/discover"
        class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold m-2"
      >
        <DiscoverIcon class="mr-2" />
        Discover
      </nuxt-link>
      <nuxt-link
        :to="'/' + $store.state.user.id + '/bookmarks'"
        class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold m-2"
      >
        <BookmarksIcon class="mr-2" />
        Bookmarks
      </nuxt-link>
      <!-- profile -->
      <nuxt-link
        :to="'/' + $store.state.user.id"
        class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold m-2"
      >
        <ProfileIcon class="mr-2" />
        Profile
      </nuxt-link>
      <nuxt-link
        to="/help"
        class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold m-2"
      >
        <HelpIcon class="mr-2" />
        Help
      </nuxt-link>
      <BrandedButton text="Write Post" :action="toggle" class="mt-5 w-48" />

      <div
        class="flex flex-col items-center fixed bottom-0 mb-4"
        @click="toggleProfileActions"
      >
        <!-- Actions tab -->
        <div v-if="isProfileActions" class="flex flex-col py-2">
          <nuxt-link :to="'/' + $store.state.user.id">
            Visit Profile
          </nuxt-link>
          <button class="focus:outline-none" @click="signOut">
            Sign Out
          </button>
        </div>
        <button class="block flex items-center focus:outline-none">
          <ProfileIcon />
          <span class="pl-2 group text-base leading-6 font-semibold">
            {{ this.$store.state.user.username }}
          </span>
        </button>
      </div>
    </div>

    <!-- Mobile -->
    <div
      class="fixed lg:hidden bottom-0 h-16 w-full flex flex-row justify-around pb-4 pt-2 items-end bg-white z-50"
    >
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
        @click="toggle()"
      >
        <PencilIcon class="fill-current text-white" />
      </button>

      <ProfileIcon
        v-if="this.$route.params.id === this.$store.state.user.id"
        class="stroke-current text-primary"
      />
      <nuxt-link v-else :to="$store.state.user.id">
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

<script>
import { mapMutations } from 'vuex'

import HomeIcon from '@/components/icons/Home'
import DiscoverIcon from '@/components/icons/Discover'
import PencilIcon from '@/components/icons/Pencil'
import ProfileIcon from '@/components/icons/Person'
import SettingsIcon from '@/components/icons/Settings'
import BrandedButton from '@/components/BrandedButton'
import BookmarksIcon from '@/components/icons/Bookmarks'
import HelpIcon from '@/components/icons/Help'

export default {
  components: {
    HomeIcon,
    DiscoverIcon,
    PencilIcon,
    ProfileIcon,
    SettingsIcon,
    BrandedButton,
    BookmarksIcon,
    HelpIcon,
  },
  data () {
    return {
      isProfileActions: false,
    }
  },
  methods: {
    ...mapMutations({
      toggle: 'toggleCompose',
      logout: 'startSession',
    }),
    toggleProfileActions () {
      this.isProfileActions = !this.isProfileActions
    },
    signOut () {
      this.logout(null)
      this.$router.push('/')
    },
  },
}
</script>
