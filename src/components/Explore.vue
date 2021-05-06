<template>
  <aside class="fixed right-0 pr-10 w-1/4">
    <!-- Name -->
    <h6 v-for="t in this.$store.state.tags" :key="t.tag">
      <nuxt-link :to="'/tag/' + t.tag">
        #{{ t.tag }} ({{ t.posts.length }})</nuxt-link
      >
    </h6>
  </aside>
</template>
