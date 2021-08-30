<template>
	<section
		class="w-full"
		:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'"
	>
		<nav class="flex flex-row border bg-secondary bg-opacity-25 py-2 px-4 pl-5">
			<div class="flex items-center mr-6">
				<button
					:class="this.algorithm === `NEW` ? `bg-primary text-white shadow-lg` : `bg-gray-100 text-gray-800`"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg"
					@click="sortFeed('NEW')"
				>
					New
				</button>
			</div>
			<div class="flex items-center mr-6">
				<button
					:class="this.algorithm === `TOP` ? `bg-primary text-white shadow-lg` : `bg-gray-100 text-gray-800`"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg"
					@click="sortFeed('TOP')"
				>
					Top
				</button>
			</div>
			<div class="flex items-center mr-6">
				<button
					:class="this.algorithm === `FOLLOWING` ? `bg-primary text-white shadow-lg` : `bg-gray-100 text-gray-800`"
					class="font-sans py-2 px-4 focus:outline-none uppercase rounded-lg"
					@click="sortFeed('FOLLOWING')"
				>
					following
				</button>
			</div>
		</nav>

		<!-- Not loaded yet -->
		<article v-show="this.isLoading" class="flex justify-center">
			<div class="loader m-10"></div>
		</article>

		<article v-for="post in this.posts" :key="post.contentAddress" class="px-4">
			<PostCard :post="post" />
		</article>
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
			isLoading: true,
		}
	},
	async created() {
		const p = await this.$axios.$get(`/content`)
		this.posts = p.data.reverse()
		this.isLoading = false
	},
	methods: {
		async sortFeed(a: `NEW` | `FOLLOWING` | `TOP`) {
			this.posts = []
			this.isLoading = true
			this.algorithm = a
			const p = await this.$axios.$get(`/content`)
			// This should be refactored to a switch statement (TODO)
			// Sort by time
			if (a === `NEW`) {
				// Get new posts from all following & category feeds
				this.posts = p.data.reverse()
				this.isLoading = false
			} else if (a === `FOLLOWING`) {
				// Get list of accounts being followed
				this.posts = p.data
				this.isLoading = false
			} else if (a === `TOP`) {
				this.posts = p.data
				this.isLoading = false
			}
			return this.posts
		},
	},
})
</script>

<style>
.loader {
	border: 16px solid #eeeeee; /* Light grey */
	border-top: 16px solid #1e566c; /* Blue */
	border-radius: 50%;
	width: 120px;
	height: 120px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
