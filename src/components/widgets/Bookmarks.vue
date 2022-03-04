<template>
	<article class="py-4">
		<h3 class="text-primary dark:text-secondary px-6 pb-4 text-base font-semibold">Recent Bookmarks</h3>
		<article v-if="this.$store.state.recentBookmarks.length == 0">
			<p class="text-gray5 dark:text-gray3 mb-4 px-6 text-sm">
				<span>
					You haven't bookmarked any posts yet. Click the bookmark icon on a post to add it to your bookmark list
				</span>
			</p>
		</article>
		<nuxt-link
			v-for="p in this.$store.state.recentBookmarks"
			:key="p.postCID"
			:to="`/post/` + p.postCID"
			class="flex w-full flex-row items-center px-6 pb-4"
		>
			<!-- Left side: title and author name -->
			<div class="flex flex-grow flex-col">
				<h5 class="font-semibold dark:text-darkSecondaryText">{{ p.title }}</h5>
				<h6 class="text-gray5 dark:text-gray3">By {{ p.authorID }}</h6>
			</div>
			<!-- Right side: featured photo -->
			<div class="w-24 hidden xl:block">
				<img v-if="p.featuredPhoto" :src="p.featuredPhoto" class="h-16 w-full flex-shrink-0 rounded-lg object-cover" />
			</div>
		</nuxt-link>
		<nuxt-link to="/bookmarks" class="italics text-primary dark:text-secondary px-6 text-sm">See More</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>
