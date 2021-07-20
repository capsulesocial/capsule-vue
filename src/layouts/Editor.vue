<template>
  <main
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'"
    class=""
  >
    <div class="fixed top-0 flex justify-center w-full border-b">
      <Header class="w-full md:min-w-max md:max-w-4xl border-none" />
    </div>

    <div class="flex justify-center">
      <!-- Main Content -->
      <Nuxt class="md:min-w-max md:max-w-4xl" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'

export default Vue.extend({
	components: {
		Header,
	},
	created () {
		if (this.$store.state.session.cid === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
