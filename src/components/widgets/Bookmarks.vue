<template>
	<article class="py-4">
		<h3 class="text-primary text-base font-semibold px-6 pb-4">Recent Bookmarks</h3>
		<article v-if="this.$store.state.recentBookmarks.length == 0">
			<p class="text-sm text-gray5 mb-4 px-6">
				<span>
					You didn't bookmarked any posts yet. Click the bookmark icon on a post to add it to your bookmark list
				</span>
			</p>
		</article>
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
