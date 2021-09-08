<template>
	<main class="emoji-cursor w-full h-screen" :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'">
		<Nuxt />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
.emoji-cursor {
	cursor: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg'  width='40' height='48' viewport='0 0 100 100' style='fill:black;font-size:24px;'><text y='50%'>🚀</text></svg>"),
		auto;
}
</style>
