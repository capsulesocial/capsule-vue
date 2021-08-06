<template>
	<section
		class="w-full"
		:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'"
	>
		<nav class="flex flex-row border bg-secondary bg-opacity-25 py-2 px-4 pl-5">
			<div class="flex items-center mr-6">
				<button
					v-if="this.algorithm !== 'NEW'"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
					@click="sortFeed('NEW')"
				>
					New
				</button>
				<span
					v-else
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
				>
					New
				</span>
			</div>
			<div class="flex items-center mr-6">
				<button
					v-if="this.algorithm !== 'TOP'"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
					@click="sortFeed('TOP')"
				>
					Top
				</button>
				<span
					v-else
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
				>
					Top
				</span>
			</div>
			<div class="flex items-center mr-6">
				<button
					v-if="this.algorithm !== 'FOLLOWING'"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-gray-100 text-gray-800"
					@click="sortFeed('FOLLOWING')"
				>
					following
				</button>
				<span
					v-else
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg bg-primary text-white shadow-lg"
				>
					following
				</span>
			</div>
		</nav>
		<div v-for="post in this.posts" :key="post.contentAddress" class="mx-4">
			<PostCard :post="post" />
		</div>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '~/interfaces/Post'

export default Vue.extend({
	components: {
		PostCard,
	},
	data() {
		const posts: Post[] = []
		return {
			algorithm: `NEW`,
			posts,
		}
	},
	created() {
		this.$axios.$get(`/content`).then((p) => {
			console.log(p.data)
			this.posts = p.data
		})
		// this.sortFeed(this.algorithm)
	},
	methods: {
		sortFeed(a) {
			this.posts = []
			// Get list of posts
			for (const p in this.$store.state.posts.recent) {
				if (p) {
					this.$getPost(this.$store.state.posts.recent[p]).then((post: Post) => {
						post.cid = this.$store.state.posts.recent[p]
						this.posts.push(post)
					})
				}
			}
			this.algorithm = a
			// Sort by time
			if (a === `NEW`) {
				return this.posts.reverse()
			} else if (a === `FOLLOWING`) {
				// Get list of accounts being followed
				const fList: string[] = []
				const res: Post[] = []
				fList.push(...this.$store.state.session.following)
				for (const p in this.posts) {
					if (fList.includes(this.posts[p].authorID)) {
						res.push(this.posts[p])
					}
				}
				this.posts = res
			}
			return this.posts
		},
	},
})
</script>
