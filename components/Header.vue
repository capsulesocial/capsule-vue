<template>
  <section class="flex justify-between p-4">
    <CapsuleIcon class="py-4" />
    <button>
      Search
    </button>
    <nuxt-link to="/profile">
      Profile
    </nuxt-link>
  </section>
</template>

<script>
import CapsuleIcon from "@/components/CapsuleIcon";
export default {
  setup() {},
  components: {
    CapsuleIcon
  }
};
</script>
