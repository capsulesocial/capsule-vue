<template>
	<button class="flex focus:outline-none hover:text-primary" @click="handleBookmark()">
		<BookmarkIcon :isActive="this.isBookmarked" class="mr-2 fill-none" />
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
			// isBookmarked: this.post.bookmarks.includes(this.$store.state.me.id),
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
			// this.$store.commit('me/handleBookmark', this.postID)
			this.isBookmarked = !this.isBookmarked
			// this.$store.commit('posts/handleBookmark', {
			//   postID: this.postID,
			//   userID: this.$store.state.me.id,
			// })
			// const p = await this.$api.post.handleBookmark(this.$store.state.me.id, this.post.id)
			// if (p.bookmarks.includes(this.$store.state.me.id)) {
			//   this.isBookmarked = true
			// } else {
			//   this.isBookmarked = false
			// }
		},
	},
})
</script>
