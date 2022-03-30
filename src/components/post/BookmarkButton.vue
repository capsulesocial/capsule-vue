<template>
	<button class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary" @click="handleBookmark()">
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
				try {
					await sendBookmarkEvent(`ADD`, this.$store.state.session.id, this.postID)
					this.$toastSuccess(`You have added this post to your bookmarks`)
				} catch (err: any) {
					this.$toastError(err.message)
				}
			} else {
				// Remove bookmark
				try {
					await sendBookmarkEvent(`REMOVE`, this.$store.state.session.id, this.postID)
					this.$toastSuccess(`You have removed this post from your bookmarks`)
				} catch (err: any) {
					this.$toastError(err.message)
				}
			}
			this.$emit(`clicked`)
		},
	},
})
</script>
