<template>
  <main class="w-full grid grid-cols-1 lg:grid-cols-6">
    <div>
      <button
        @click="$router.go(-1)"
        class="focus:outline-none fixed lg:inset-y-0 bottom-0 lg:bottom-1/2 left-0 m-5 rounded-full px-2 py-1 bg-white"
      >
        <BackButton class="hidden lg:block" size="large" />
        <BackButton class="lg:hidden" />
      </button>
    </div>
    <Nuxt class="col-span-4" />
    <div></div>
  </main>
</template>

<script>
import BackButton from "@/components/icons/BackChevron";

export default {
  components: { BackButton }
};
</script>
