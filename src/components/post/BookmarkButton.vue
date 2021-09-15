<template>
	<button class="flex items-end focus:outline-none hover:text-primary" @click="handleBookmark()">
		<BookmarkIcon :isActive="isBookmarked" class="mr-2 fill-none" />
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import BookmarkIcon from '@/components/icons/Bookmark.vue'

export default Vue.extend({
	components: {
		BookmarkIcon,
	},
	props: {
		postID: {
			type: String,
			default: null,
		},
	},
	data() {
		return {
			isBookmarked: false,
		}
	},
	created() {
		const bookmarks = this.$store.state.session.bookmarks
		if (!bookmarks) {
			return
		}
		if (bookmarks.includes(this.postID)) {
			this.isBookmarked = true
		}
	},
	methods: {
		handleBookmark() {
			this.isBookmarked = !this.isBookmarked
		},
	},
})
</script>
