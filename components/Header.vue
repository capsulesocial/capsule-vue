<template>
  <section class="flex justify-between p-4">
    <CapsuleIcon class="py-4" />
    <SearchBar />
    <nuxt-link to="/profile"> Profile </nuxt-link>
  </section>
</template>

<script>
import CapsuleIcon from "@/components/icons/Capsule";
import SearchBar from "@/components/Search";
export default {
  setup() {},
  components: {
    CapsuleIcon,
    SearchBar
  }
};
</script>
