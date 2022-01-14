<template>
	<main
		class="h-screen p-0 m-0 bg-img-unauth"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.webp`)})` }"
	>
		<Nuxt />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
