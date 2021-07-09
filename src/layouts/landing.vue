<template>
  <main class="emoji-cursor w-full h-screen">
    <Nuxt />
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script>
import Vue from 'vue'
import ColorMode from '@/components/ColorMode.vue'
export default Vue.extend({
	components: {
		ColorMode,
	},
})
</script>

<style>
.emoji-cursor {
  cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>"),
    auto;
}
</style>
