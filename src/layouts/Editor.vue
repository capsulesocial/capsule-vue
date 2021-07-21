<template>
  <main
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'"
    class=""
  >
    <div class="flex justify-center">
      <!-- Main Content -->
      <Nuxt class="md:min-w-max md:max-w-4xl" />
    </div>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({

	created () {
		if (this.$store.state.session.cid === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
