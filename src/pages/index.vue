<template>
	<main></main>
</template>

<script lang="ts">
import Vue from 'vue'
export default Vue.extend({
	layout: `unauth`,
	created() {
		this.$router.push(`/home`)
	},
})
</script>
