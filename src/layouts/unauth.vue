<template>
	<main
		class="bg-img-unauth m-0 h-screen p-0"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.webp`)})` }"
	>
		<Nuxt />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
