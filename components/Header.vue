<template>
  <section class="grid grid-cols-4 p-4">
    <CapsuleIcon class="py-4 pl-6" />
    <SearchBar class="col-span-2" />
    <article class="hidden lg:flex items-center justify-between ml-2">
      <nuxt-link to="/profile">Username</nuxt-link>
      <button class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none">
        <BookmarksIcon class="ml-4" />
      </button>
      <button class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none">
        <NotificationsIcon class="ml-3" />
      </button>
      <button class="bg-gray-200 rounded-full w-12 h-12 focus:outline-none">
        <SettingsIcon class="ml-3" />
      </button>
    </article>
  </section>
</template>

<script>
import CapsuleIcon from "@/components/icons/Capsule";
import BookmarksIcon from "@/components/icons/Bookmarks";
import NotificationsIcon from "@/components/icons/Notifications";
import SettingsIcon from "@/components/icons/Settings";
import SearchBar from "@/components/Search";
export default {
  setup() {},
  components: {
    CapsuleIcon,
    SearchBar,
    SettingsIcon,
    NotificationsIcon,
    BookmarksIcon
  }
};
</script>
