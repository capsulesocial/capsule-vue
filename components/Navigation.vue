<template>
  <nav class="px-2 flex flex-col">
    <nuxt-link
      to="/home"
      class="group flex items-center px-2 py-2 text-base leading-6 font-bold rounded-full text-primary"
      >Home</nuxt-link
    >
    <nuxt-link
      to="/discover"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
      >Discover</nuxt-link
    >
    <nuxt-link
      to="/messages"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
      >Messages</nuxt-link
    >
    <nuxt-link
      to="/profile"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
      >Profile</nuxt-link
    >
    <nuxt-link
      to="/settings"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
      >Settings</nuxt-link
    >
    <nuxt-link
      to="/help"
      class="mt-1 group flex items-center px-2 py-2 text-base leading-6 font-semibold"
      >Help</nuxt-link
    >
    <button
      class="bg-primary w-48 mt-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg"
    >
      Post
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
