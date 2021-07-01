<template>
  <main>
    <!-- Dark Mode: {{ isDarkMode ? 'enabled' : 'disabled' }}
    <button @click="toggleDarkMode">Click</button> -->
    <div>
      {{ this.$store.state.session }}
    </div>
    update name:
    <input v-model="text" type="text" class="border" />
    <button @click="updateName">
      Update Name
    </button>
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapState, mapMutations } from 'vuex'

// import { actionType, namespace as settingStoreNamespace, SettingState } from '~/store/settings'
import { MutationType, namespace as sessionStoreNamespace, SessionState } from '~/store/session'

export default Vue.extend({
	layout: `landing`,
	data () {
		return {
			text: ``,
		}
	},
	computed: {
		// ...mapState(settingStoreNamespace, {
		//   isDarkMode: state => (state as SettingState).darkMode,
		// }),
		...mapState({
			currentUser: state => (state as SessionState),
		}),
	},
	methods: {
		// ...mapActions(settingStoreNamespace, {
		//   toggleDarkMode: actionType.TOGGLE_DARK_MODE
		// }),
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
		}),
		updateName () {
			this.changeCID(this.text)
			console.log(this.text)
		},
	},
})
</script>
