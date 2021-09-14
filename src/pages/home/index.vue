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
							this.algorithm === `TOP`
								? `bg-white text-primary border-t-2 border-primary font-semibold`
								: `border-l border-r text-gray7`
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

			<article v-for="post in this.posts" :key="post.post._id" style="padding-left: 22px">
				<PostCard :post="post.post" :cid="post.post._id" :comments="post.comments" />
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'

interface IData {
	posts: IPostResponse[]
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
		this.posts = await getPosts({}, `NEW`)
		this.isLoading = false
	},
	methods: {
		async sortFeed(a: Algorithm) {
			this.posts = []
			this.isLoading = true
			this.algorithm = a
			this.posts = await getPosts({}, a, this.$store.state.session.id)
			this.isLoading = false
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
