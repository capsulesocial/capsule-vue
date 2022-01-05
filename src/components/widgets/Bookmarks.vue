<template>
	<article class="py-4">
		<h3 class="text-primary text-base font-semibold px-6 pb-4">Recent Bookmarks</h3>
		<nuxt-link
			v-for="p in this.$store.state.recentBookmarks"
			:key="p.postCID"
			:to="`/post/` + p.postCID"
			class="w-full flex flex-row items-center px-6 pb-4"
		>
			<!-- Left side: title and author name -->
			<div class="flex flex-col flex-grow">
				<h5 class="font-semibold">{{ p.title }}</h5>
				<h6 class="text-gray5">By {{ p.authorID }}</h6>
			</div>
			<!-- Right side: featured photo -->
			<div class="w-24">
				<img v-if="p.featuredPhoto" :src="p.featuredPhoto" class="flex-shrink-0 h-16 object-cover rounded-lg w-full" />
			</div>
		</nuxt-link>
		<nuxt-link to="/bookmarks" class="px-6 text-sm italics text-primary">See More</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
