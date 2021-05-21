<template>
  <section class="grid grid-cols-4 p-4 bg-white z-10">
    <!-- Top Left: Logo -->
    <article>
      <CapsuleIcon class="py-4 pl-6" />
    </article>

    <!-- Middle: Sticky above content -->
    <article v-if="this.$route.path !== '/settings'" class="col-span-2 flex">
      <button
        class="focus:outline-none flex-none"
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
      <SearchBar class="h-12 w-full flex-grow" />
    </article>
    <article v-else class="col-span-3 lg:col-span-2 flex justify-between">
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
        Account Settings
      </h2>
      <span></span>
    </article>

    <!-- Top Right -->
    <article class="hidden lg:flex items-center justify-between ml-2">
      <div class="flex">
        <nuxt-link
          v-if="
            this.$route.path !== '/' + this.$store.state.me.id + '/bookmarks'
          "
          :to="this.$store.state.me.id + '/bookmarks'"
          class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none flex justify-center"
        >
          <BookmarksIcon class="self-center" />
        </nuxt-link>
        <button
          v-else
          class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none flex justify-center"
        >
          <BookmarksIcon class="self-center" />
        </button>
        <span class="px-2">
          <button
            class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none flex justify-center"
          >
            <NotificationsIcon class="self-center" />
          </button>
        </span>

        <nuxt-link
          to="/settings"
          class="bg-gray-200 rounded-full w-12 h-12 flex justify-center"
        >
          <SettingsIcon class="self-center" />
        </nuxt-link>
      </div>
    </article>
  </section>
</template>

<script>
import CapsuleIcon from '@/components/icons/Capsule'
import BookmarksIcon from '@/components/icons/Bookmarks'
import NotificationsIcon from '@/components/icons/Notifications'
import SettingsIcon from '@/components/icons/Settings'
import SearchBar from '@/components/Search'
import BackButton from '@/components/icons/ChevronLeft'
import ForwardButton from '@/components/icons/ChevronRight'

export default {
  components: {
    CapsuleIcon,
    SearchBar,
    SettingsIcon,
    NotificationsIcon,
    BookmarksIcon,
    BackButton,
    ForwardButton,
  },
}
</script>
