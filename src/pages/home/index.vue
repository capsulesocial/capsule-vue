<template>
	<div class="w-full border-l border-r">
		<section
			:class="$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'"
		>
			<nav class="flex flex-row justify-around bg-secondary bg-opacity-25 h-12 border-b">
				<div class="flex items-center w-full">
					<button
						:class="
							algorithm === `NEW` ? `bg-white text-primary border-t-2 border-primary font-semibold` : `text-gray7`
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
							algorithm === `TOP`
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
							algorithm === `FOLLOWING` ? `bg-white text-primary border-t-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('FOLLOWING')"
					>
						Following
					</button>
				</div>
			</nav>

			<!-- Not loaded yet -->
			<article v-show="isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>

			<article v-for="post in this.posts" :key="post.post._id" style="padding-left: 22px">
				<PostCard
					:post="post.post"
					:cid="post.post._id"
					:comments="post.comments"
					:toggleFriend="toggleFriend"
					:usersFollowing="following"
				/>
			</article>

			<!-- Not loaded yet -->
			<article v-show="this.isLoading" class="flex justify-center" style="width: 600px">
				<div class="loader m-5"></div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: IPostResponse[]
	isLoading: boolean
	algorithm: Algorithm
	following: Set<string>
	currentOffset: number
	limit: number
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
			following: new Set(),
			currentOffset: 0,
			limit: 10,
		}
	},
	async created() {
		window.addEventListener(`scroll`, this.handleScroll)
		this.posts = await getPosts({}, `NEW`, 0, this.limit)
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
		this.isLoading = false
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async sortFeed(a: Algorithm) {
			this.posts = []
			this.currentOffset = 0
			this.isLoading = true
			this.algorithm = a
			this.posts = await getPosts({}, a, 0, this.limit, this.$store.state.session.id)
			this.isLoading = false
			window.addEventListener(`scroll`, this.handleScroll)
			return this.posts
		},
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async loadPosts(offset: number, limit: number) {
			this.isLoading = true
			try {
				const res = await getPosts({}, this.algorithm, this.currentOffset, this.limit, this.$store.state.session.id)
				// eslint-disable-next-line
				console.log(this.algorithm, offset, limit)
				if (res.length === 0) {
					this.isLoading = false
					window.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
			} catch (err) {
				alert(err)
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll() {
			const { scrollTop, scrollHeight, clientHeight } = document.documentElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				window.removeEventListener(`scroll`, this.handleScroll)
				await this.loadPosts(this.currentOffset, this.limit)
				this.currentOffset += this.limit
				window.addEventListener(`scroll`, this.handleScroll)
			}
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
