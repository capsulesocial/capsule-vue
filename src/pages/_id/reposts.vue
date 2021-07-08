<template>
  <section class="px-4">
    <div v-for="p in this.posts" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'

export default Vue.extend({
	components: {
		PostCard,
	},
	data () {
		return {
			currentUser: {},
			posts: [],
		}
	},
	created () {
		// The user in which I am currently viewing
		// Check if this is my profile
		if (this.$route.params.id === this.$store.state.session.cid) {
			this.currentUser = this.$store.state.session
		}
		// Get user profile
		this.currentUser = this.$getProfile(this.$route.params.id)
		this.getRepostList()
	},
	methods: {
		async getRepostList () {
			// Get list of reposts posts by visited profile
			let targetProfile = {}
			if (this.$route.params.id === this.$store.state.session.cid) {
				targetProfile = this.$store.state.session
			} else {
				this.$getProfile(this.$route.params.id).then((profile) => {
					targetProfile = profile
				})
			}
			// @ts-ignore
			const repostList = targetProfile.reposts
			// Loop through list of reposts on a profile
			for (let i = 0; i < repostList.length; i++) {
				// Find post object and add it to result
				const post = await this.$getPost(repostList[i])
				post.id = repostList[i]
				// @ts-ignore
				this.posts.push(post)
			}
		},
	},
})
</script>
