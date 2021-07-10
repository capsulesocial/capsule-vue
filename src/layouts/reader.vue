<template>
  <main
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'"
    class="w-full grid grid-cols-1 lg:grid-cols-6 h-auto"
  >
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
    <!-- Toggle Light / Dark Mode -->
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script>
import CloseButton from '@/components/icons/Close.vue'
import ColorMode from '@/components/ColorMode.vue'

export default {
	components: {
		CloseButton,
		ColorMode,
	},
}
</script>
