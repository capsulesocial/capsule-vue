<template>
  <section class="grid grid-cols-4 p-4 bg-white">
    <!-- Top Left: Logo -->
    <article>
      <CapsuleIcon class="py-4 pl-6" />
    </article>

    <!-- Middle: Sticky above content -->
    <article v-if="this.$route.path !== '/settings'" class="col-span-2 flex">
      <button @click="$router.go(-1)" class="focus:outline-none">
        <BackButton class="ml-4" />
      </button>
      <SearchBar class="h-12 w-full" />
    </article>
    <article v-else class="col-span-3 lg:col-span-2 flex justify-between">
      <button @click="$router.go(-1)" class="focus:outline-none">
        <BackButton />
      </button>
      <h2 class="text-2xl pt-4">Account Settings</h2>
      <span></span>
    </article>

    <!-- Top Right -->
    <article class="hidden lg:flex items-center justify-between ml-2">
      <span v-if="this.$route.params.id === this.$store.state.user.id">{{
        this.$store.state.user.username
      }}</span>
      <nuxt-link v-else :to="$store.state.user.id">{{
        this.$store.state.user.username
      }}</nuxt-link>

      <div class="flex">
        <button
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
import CapsuleIcon from "@/components/icons/Capsule";
import BookmarksIcon from "@/components/icons/Bookmarks";
import NotificationsIcon from "@/components/icons/Notifications";
import SettingsIcon from "@/components/icons/Settings";
import SearchBar from "@/components/Search";
import BackButton from "@/components/icons/BackChevron";

export default {
  setup() {},
  components: {
    CapsuleIcon,
    SearchBar,
    SettingsIcon,
    NotificationsIcon,
    BookmarksIcon,
    BackButton
  }
};
</script>
