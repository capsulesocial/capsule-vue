<template>
	<main
		class="emoji-cursor h-screen p-0 m-0 bg-img-unauth"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/auth.jpg`)})` }"
	>
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
.bg-img-unauth {
	background-position: right top;
	background-size: cover;
	background-repeat: no-repeat;
}
</style>
