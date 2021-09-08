<template>
	<div class="w-full border-l border-r">
		<section
			:class="
				this.$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'
			"
		>
			<nav class="flex flex-row justify-around bg-secondary bg-opacity-25 h-12 border-b">
				<div class="flex items-center w-full">
					<button
						:class="
							this.algorithm === `NEW` ? `bg-white text-primary border-t-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('NEW')"
					>
						New
					</button>
				</div>
				<div class="flex items-center w-full">
					<button
						:class="
							this.algorithm === `TOP` ? `bg-white text-primary border-t-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('TOP')"
					>
						Top
					</button>
				</div>
				<div class="flex items-center w-full">
					<button
						:class="
							this.algorithm === `FOLLOWING`
								? `bg-white text-primary border-t-2 border-primary font-semibold`
								: `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
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
import { getPosts, Post } from '@/backend/post'

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
		const p = await getPosts({})
		this.posts = p.reverse()
		this.isLoading = false
	},
	methods: {
		async sortFeed(a: Algorithm) {
			this.posts = []
			this.isLoading = true
			this.algorithm = a
			this.posts = await getPosts({})
			switch (a) {
				case `NEW`:
					// Get new posts from all following & category feeds and sort by time
					this.posts = this.posts.reverse()
					this.isLoading = false
					break
				case `FOLLOWING`:
					// Get list of accounts being followed
					this.isLoading = false
					break
				case `TOP`:
					this.isLoading = false
					break
				default:
					throw new Error(`Unexpected algorithm ${a}!`)
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
