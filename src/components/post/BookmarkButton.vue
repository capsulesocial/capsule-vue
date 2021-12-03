<template>
	<button class="focus:outline-none hover:text-primary" @click="handleBookmark()">
		<BookmarkIcon :isActive="$props.hasBookmark" class="fill-none" />
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
				this.$toastSuccess(`You have added this post to your bookmarks`)
			} else {
				// Remove bookmark
				await sendBookmarkEvent(`REMOVE`, this.$store.state.session.id, this.$props.postID)
				this.$toastSuccess(`You have removed this post from your bookmarks`)
			}
			this.$emit(`clicked`)
		},
	},
})
</script>
