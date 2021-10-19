<template>
	<button class="flex items-end focus:outline-none hover:text-primary" @click="handleBookmark()">
		<BookmarkIcon :isActive="isBookmarked()" class="mr-2 fill-none" />
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import BookmarkIcon from '@/components/icons/Bookmark.vue'
import { sendBookmarkEvent } from '@/backend/bookmarks'

interface IData {
	isBookmarked: Function
}

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
			type: Function,
			default: null,
		},
	},
	data(): IData {
		return {
			isBookmarked: () => {
				return false
			},
		}
	},
	created() {
		this.isBookmarked = this.$props.hasBookmark
	},
	methods: {
		sendBookmarkEvent,
		async handleBookmark() {
			if (!this.isBookmarked()) {
				await sendBookmarkEvent(
					this.$props.isBookmarked ? `REMOVE` : `ADD`,
					this.$store.state.session.id,
					this.$props.postID,
				)
				this.isBookmarked = () => {
					return true
				}
			} else {
				await sendBookmarkEvent(
					this.$props.isBookmarked ? `REMOVE` : `ADD`,
					this.$store.state.session.id,
					this.$props.postID,
				)
				this.isBookmarked = () => {
					return false
				}
			}
		},
	},
})
</script>
