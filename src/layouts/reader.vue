<template>
  <main class="w-full grid grid-cols-1 lg:grid-cols-6">
    <div></div>
    <Nuxt class="col-span-4" />
    <button
      @click="$router.go(-1)"
      class="focus:outline-none fixed bottom-0 m-5 rounded-full px-2 py-1 bg-white"
    >
      <BackButton />
    </button>
  </main>
</template>

<script>
import BackButton from "@/components/icons/BackChevron";

export default {
  components: { BackButton }
};
</script>
