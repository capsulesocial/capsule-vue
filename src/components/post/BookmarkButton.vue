<template>
	<button class="flex items-end focus:outline-none hover:text-primary" @click="handleBookmark()">
		<BookmarkIcon :isActive="$props.hasBookmark" class="mr-2 fill-none" />
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import BookmarkIcon from '@/components/icons/Bookmark.vue'
import { sendBookmarkEvent } from '@/backend/bookmarks'

export default Vue.extend({
	components: {
		BookmarkIcon,
	},
	props: {
		postID: {
			type: String,
			default: null,
		},
		hasBookmark: {
			type: Boolean,
			default: false,
		},
	},
	methods: {
		sendBookmarkEvent,
		async handleBookmark() {
			if (!this.$props.hasBookmark) {
				// add bookmark
				await sendBookmarkEvent(`ADD`, this.$store.state.session.id, this.$props.postID)
			} else {
				// Remove bookmark
				await sendBookmarkEvent(`REMOVE`, this.$store.state.session.id, this.$props.postID)
			}
			this.$emit(`clicked`)
		},
	},
})
</script>
