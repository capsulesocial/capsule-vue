<template>
  <main
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'"
    class="h-full"
  >
    <div class="flex justify-center">
      <Nuxt class="md:max-w-3xl md:min-w-max" />
    </div>
    <div>
      <button
        class="focus:outline-none fixed bottom-0 lg:top-0 right-0 m-5 rounded-full border border-2 border-primary bg-white w-10 h-10"
        @click="$router.go(-1)"
      >
        <CloseButton class="hidden lg:block" size="large" />
        <CloseButton class="lg:hidden" />
      </button>
    </div>
    <!-- Toggle Light / Dark Mode -->
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script>
import CloseButton from '@/components/icons/Close.vue'
import ColorMode from '@/components/ColorMode.vue'

export default {
	name: `ReaderLayout`,
	components: {
		CloseButton,
		ColorMode,
	},
}
</script>
