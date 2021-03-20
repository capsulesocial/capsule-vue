<template>
  <div>
    <Header class="pb-2 sticky top-0" />

    <div class="grid grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation class="text-gray-500 h-12 sticky top-0 pl-6" />

      <!-- Main Content -->
      <Nuxt class="border overscroll-contain col-span-2 w-full" />

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
