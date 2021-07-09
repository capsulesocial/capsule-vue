<template>
  <main :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'">
    <Nuxt />
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import ColorMode from '@/components/ColorMode.vue'

export default Vue.extend({
	components: {
		ColorMode,
	},
})
</script>
