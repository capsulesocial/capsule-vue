<template>
  <nav class="px-2 flex flex-col">
    <nuxt-link
      to="/home"
      class="group flex items-center px-2 py-2 text-base leading-6"
    >
      <span v-if="this.$route.path === '/home'" class="font-bold text-primary"
        >Home</span
      >
      <span v-else class="font-semibold">Home</span>
    </nuxt-link>
    <nuxt-link
      to="/discover"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <span
        v-if="this.$route.path === '/discover'"
        class="font-bold text-primary"
        >Discover</span
      >
      <span v-else class="font-semibold">Discover</span>
    </nuxt-link>
    <nuxt-link
      to="/messages"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <span
        v-if="this.$route.path === '/messages'"
        class="font-bold text-primary"
        >Messages</span
      >
      <span v-else class="font-semibold">Messages</span>
    </nuxt-link>
    <nuxt-link
      to="/profile"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <span
        v-if="this.$route.path === '/profile'"
        class="font-bold text-primary"
        >Profile</span
      >
      <span v-else class="font-semibold">Profile</span>
    </nuxt-link>
    <nuxt-link
      to="/settings"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <span
        v-if="this.$route.path === '/settings'"
        class="font-bold text-primary"
        >Settings</span
      >
      <span v-else class="font-semibold">Settings</span>
    </nuxt-link>
    <nuxt-link
      to="/help"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <span v-if="this.$route.path === '/help'" class="font-bold text-primary"
        >Help</span
      >
      <span v-else class="font-semibold">Help</span>
    </nuxt-link>
    <button
      class="bg-primary w-48 mt-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
    >
      Write Post
    </button>
    <div
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
    >
      <button>
        Log Out
      </button>
    </div>
  </nav>
</template>

<script>
export default {};
</script>
