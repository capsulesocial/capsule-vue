<template>
  <aside class="fixed right-0 pr-10 w-1/4">
    <ul
      class="border-primary border-2 rounded-lg p-2 bg-gray-100 shadow-lg font-sans mx-4"
    >
      <h3 class="font-serif text-2xl underline">Trending Tags</h3>
      <li v-for="t in this.$store.state.tags" :key="t.tag">
        <nuxt-link :to="'/tag/' + t.tag" class="hover:text-primary">
          #{{ t.tag }} ({{ t.posts.length }})</nuxt-link
        >
      </li>
    </ul>
  </aside>
</template>
