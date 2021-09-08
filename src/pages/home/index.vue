<template>
	<div class="w-full border-l border-r">
		<section
			:class="
				this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'
			"
		>
			<nav class="flex flex-row bg-secondary bg-opacity-25 h-12">
				<div class="flex items-center">
					<button
						:class="this.algorithm === `NEW` ? `bg-primary text-white` : ``"
						class="h-full focus:outline-none px-5"
						@click="sortFeed('NEW')"
					>
						New
					</button>
				</div>
				<div class="flex items-center">
					<button
						:class="this.algorithm === `TOP` ? `bg-primary text-white` : ``"
						class="h-full focus:outline-none px-5"
						@click="sortFeed('TOP')"
					>
						Top
					</button>
				</div>
				<div class="flex items-center">
					<button
						:class="this.algorithm === `FOLLOWING` ? `bg-primary text-white shadow-lg` : ``"
						class="h-full focus:outline-none px-5"
						@click="sortFeed('FOLLOWING')"
					>
						Following
					</button>
				</div>
			</nav>

			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>

			<article v-for="post in this.posts" :key="post._id" style="padding-left: 11px">
				<PostCard :post="post" :cid="post._id" />
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { Post } from '~/interfaces/Post'

type Algorithm = `NEW` | `FOLLOWING` | `TOP`

interface IData {
	posts: Post[]
	isLoading: boolean
	algorithm: Algorithm
}

export default Vue.extend({
	components: {
		PostCard,
	},
	data(): IData {
		return {
			algorithm: `NEW`,
			posts: [],
			isLoading: true,
		}
	},
	async created() {
		const p = await this.$axios.$get(`/content`)
		this.posts = p.data.reverse()
		this.isLoading = false
	},
	methods: {
		async sortFeed(a: Algorithm) {
			this.posts = []
			this.isLoading = true
			this.algorithm = a
			const p = await this.$axios.$get(`/content`)
			switch (a) {
				case `NEW`:
					// Get new posts from all following & category feeds and sort by time
					this.posts = p.data.reverse()
					this.isLoading = false
					break
				case `FOLLOWING`:
					// Get list of accounts being followed
					this.posts = p.data
					this.isLoading = false
					break
				case `TOP`:
					this.posts = p.data
					this.isLoading = false
					break
				default:
					this.posts = p.data
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
