<template>
  <section class="px-4">
    <div v-for="p in this.posts" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from '@/components/post/Card.vue'

export default {
	components: {
		PostCard,
	},
	data () {
		return {
			currentUser: {},
			posts: [],
		}
	},
	async created () {
		// The user in which I am currently viewing
		// Check if this is my profile
		if (this.$route.params.id === this.$store.state.session.cid) {
			this.currentUser = this.$store.state.session
		}
		// Get user profile
		this.currentUser = await this.$getProfile(this.$route.params.id)
		this.getBookmarkList()
	},
	methods: {
		async getBookmarkList () {
			// Get list of bookmarked posts by visited profile
			// let targetProfile = this.$getProfile(this.$route.params.id)
			let targetProfile = {}
			if (this.$route.params.id === this.$store.state.session.cid) {
				targetProfile = this.$store.state.session
			} else {
				this.$getProfile(this.$route.params.id).then((profile) => {
					targetProfile = profile
				})
			}
			const bookmarkList = targetProfile.bookmarks
			// Loop through list of bookmarks on a profile
			for (let i = 0; i < bookmarkList.length; i++) {
				// Find post object and add it to result
				const post = await this.$getPost(bookmarkList[i])
				post.id = bookmarkList[i]
				// @ts-ignore
				this.posts.push(post)
			}
		},
	},
}
</script>
