<template>
  <div class="px-32">
    <Header class="pb-2 sticky top-0" />

    <div class="flex">
      <!-- Left Nav Menu -->
      <Navigation class="w-1/5 text-gray-500 h-12 sticky top-0" />

      <!-- Main Content -->
      <Nuxt class="w-3/5 border overscroll-contain" />

      <!-- Right Explore Menu -->
      <Explore />
    </div>
  </div>
</template>

<script>
import Navigation from "@/components/Navigation";
import Explore from "@/components/Explore";
import Header from "@/components/Header";

export default {
  setup() {},
  components: {
    Navigation,
    Explore,
    Header
  }
};
</script>
