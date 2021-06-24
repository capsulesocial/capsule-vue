<template>
  <main class="w-full grid grid-cols-1 lg:grid-cols-6 bg-white h-auto">
    <div>
    </div>
    <Nuxt class="col-span-4" />
    <div>
      <button
        class="focus:outline-none fixed bottom-0 lg:top-0 right-0 m-5 rounded-full border border-2 border-primary bg-white w-10 h-10"
        @click="$router.go(-1)"
      >
        <CloseButton class="hidden lg:block" size="large" />
        <CloseButton class="lg:hidden" />
      </button>
    </div>
  </main>
</template>

<script>
import CloseButton from '@/components/icons/Close.vue'

export default {
  components: { CloseButton },
}
</script>
