<template>
  <section class="grid grid-cols-4 px-4 py-2 bg-white z-10 border-b border-gray1">
    <!-- Top Left: Logo -->
    <article>
      <CapsuleIcon class="py-4 pl-6" />
    </article>

    <article class="col-span-3 lg:col-span-2 flex justify-between">
      <div class="flex">
        <button
          class="focus:outline-none"
          @click="$router.go(-1)"
        >
          <BackButton />
        </button>
        <button
          class="focus:outline-none"
          @click="$router.go(1)"
        >
          <ForwardButton />
        </button>
      </div>
      <h2 class="text-2xl pt-4">
      </h2>
      <span></span>
    </article>

    <!-- Top Right -->
    <article class="relative hidden lg:flex items-center justify-end ml-2">
      <div class="flex">
        <span>
          <button
            class="bg-gray-200 rounded-full w-10 h-10 focus:outline-none flex justify-center shadow-lg"
          >
            <SearchIcon class="self-center" />
          </button>
        </span>
        <span class="px-2">
          <button
            class="bg-gray-200 rounded-full w-10 h-10 focus:outline-none flex justify-center shadow-lg"
          >
            <NotificationsIcon class="self-center" />
          </button>
        </span>
        <span>
          <button
            class="bg-gray-200 rounded-full w-10 h-10 focus:outline-none flex justify-center shadow-lg"
            @click="showMore = !showMore"
          >
            <DownIcon class="self-center" />
          </button>
        </span>
      </div>
      <!-- Dropdown menu -->
      <div v-if="showMore" class="absolute mt-64 z-10 bg-white shadow-lg rounded-lg w-full">
        <nuxt-link
          to="/settings"
          class="w-full p-2 grid grid-cols-4 items-center"
        >
          <span class="bg-gray-200 rounded-full w-12 h-12 flex justify-center">
            <SettingsIcon class="self-center" />
          </span>
          <h5 class="text-base font-sans justify-self-start col-span-2">
            Settings
          </h5>
          <ForwardButton class="justify-self-end" />
        </nuxt-link>
        <nuxt-link
          to="/help"
          class="w-full p-2 grid grid-cols-4 items-center"
        >
          <span class="bg-gray-200 rounded-full w-12 h-12 flex justify-center">
            <HelpIcon class="self-center" />
          </span>
          <h5 class="text-base font-sans justify-self-start col-span-2">
            Help & Support
          </h5>
          <ForwardButton class="justify-self-end" />
        </nuxt-link>
        <button
          class="w-full p-2 grid grid-cols-4 items-center"
          @click="logout"
        >
          <span class="bg-gray-200 rounded-full w-12 h-12 flex justify-center">
            <LogoutIcon class="self-center" />
          </span>
          <h5 class="text-base font-sans justify-self-start col-span-2">
            Log Out
          </h5>
          <span></span>
        </button>
      </div>
    </article>
  </section>
</template>

<script>
import CapsuleIcon from '@/components/icons/Capsule'
import NotificationsIcon from '@/components/icons/Notifications'
import SettingsIcon from '@/components/icons/Settings'
import BackButton from '@/components/icons/ChevronLeft'
import ForwardButton from '@/components/icons/ChevronRight'
import DownIcon from '@/components/icons/ChevronDown'
import SearchIcon from '@/components/icons/Search'
import HelpIcon from '@/components/icons/Help'
import LogoutIcon from '@/components/icons/Logout'

export default {
  components: {
    CapsuleIcon,
    SettingsIcon,
    NotificationsIcon,
    BackButton,
    ForwardButton,
    SearchIcon,
    DownIcon,
    HelpIcon,
    LogoutIcon,
  },
  data () {
    return {
      showMore: false,
    }
  },
  methods: {
    logout () {
      this.$store.commit('me/endSession')
      this.$router.push('/')
    },
  },
}
</script>
