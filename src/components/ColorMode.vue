<template>
  <div class="text-3xl">
    <button
      v-if="this.$store.state.settings.darkMode"
      class="focus:outline-none"
      @click="toggleDarkMode"
    >
      🌝
    </button>
    <button
      v-else
      class="focus:outline-none"
      @click="toggleDarkMode"
    >
      🌞
    </button>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions } from 'vuex'
import { actionType, namespace as settingStoreNamespace } from '~/store/settings'

export default Vue.extend({
	methods: {
		...mapActions(settingStoreNamespace, {
			toggleDarkMode: actionType.TOGGLE_DARK_MODE,
		}),
	},
})
</script>
