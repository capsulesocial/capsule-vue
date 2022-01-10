<template>
	<main></main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	layout: `unauth`,
	created() {
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/home`)
		} else {
			this.$router.push(`/register`)
		}
	},
})
</script>
