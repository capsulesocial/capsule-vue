<template>
	<div
		v-if="this.$store.state.settings.showUnauthPopup"
		class="popup fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-start bg-opacity-50 modal-animation"
	>
		unauth
		<button @click="closePopup">Close</button>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	methods: {
		closePopup() {
			this.$store.commit(`settings/toggleUnauthPopup`)
		},
	},
})
</script>
