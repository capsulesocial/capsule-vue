<template>
	<button
		class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary"
		@click="handleBookmark()"
	>
		<BookmarkIcon :isActive="hasBookmark" />
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
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (!this.hasBookmark) {
				// add bookmark
				await sendBookmarkEvent(`ADD`, this.$store.state.session.id, this.postID)
				this.$toastSuccess(`You have added this post to your bookmarks`)
			} else {
				// Remove bookmark
				await sendBookmarkEvent(`REMOVE`, this.$store.state.session.id, this.postID)
				this.$toastSuccess(`You have removed this post from your bookmarks`)
			}
			this.$emit(`clicked`)
		},
	},
})
</script>
