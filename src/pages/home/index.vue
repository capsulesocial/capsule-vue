<template>
	<div id="index" class="w-full border-l border-r">
		<section
			:class="$store.state.settings.darkMode ? 'text-lightPrimaryText bg-lightBG' : 'text-darkPrimaryText bg-darkBG'"
		>
			<nav class="fixed flex flex-row bg-white h-12 pt-5 -mt-5 z-10" style="width: 700px">
				<div class="flex items-center">
					<button
						:class="
							algorithm === `NEW` ? `bg-white text-primary border-b-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('NEW')"
					>
						New Posts
					</button>
				</div>
				<div class="flex items-center px-12">
					<button
						:class="
							algorithm === `TOP` ? `bg-white text-primary border-b-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('TOP')"
					>
						Top
					</button>
				</div>
				<div class="flex items-center">
					<button
						:class="
							algorithm === `FOLLOWING` ? `bg-white text-primary border-b-2 border-primary font-semibold` : `text-gray7`
						"
						class="h-full focus:outline-none text-lg w-full"
						@click="sortFeed('FOLLOWING')"
					>
						Following
					</button>
				</div>
			</nav>
			<div v-if="posts" class="pt-5">
				<!-- content -->
				<article v-for="post in posts" :key="post.post._id">
					<PostCard
						:post="post.post"
						:cid="post.post._id"
						:comments="post.comments"
						:toggleFriend="toggleFriend"
						:usersFollowing="following"
						:repostedBy="myReposts.includes(post.post._id) ? $store.state.session.id : ``"
						:bookmarked="post.bookmarked"
						:hideRepostIcon="algorithm === `NEW` || algorithm === `TOP` ? true : false"
					/>
				</article>

				<!-- Not loaded yet -->
				<article v-show="isLoading" class="flex justify-center h-screen pt-12" style="width: 660px">
					<div class="loader m-5"></div>
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getReposts } from '@/backend/reposts'

interface IData {
	posts: IPostResponse[]
	isLoading: boolean
	algorithm: Algorithm
	following: Set<string>
	currentOffset: number
	limit: number
	myReposts: string[]
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
			myReposts: [],
		}
	},
	async created() {
		this.posts = await getPosts(
			{},
			this.$store.state.session.id,
			this.algorithm,
			this.currentOffset,
			this.limit,
			this.$store.state.session.id,
		)
		this.currentOffset += this.limit
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
		// Fetch my reposts
		const repostData = await getReposts(this.$store.state.session.id)
		repostData.forEach((p) => {
			this.myReposts.push(p.repost.postCID)
		})
		this.isLoading = false
		document.getElementById(`index`)?.addEventListener(`scroll`, this.handleScroll)
	},
	destroyed() {
		window.removeEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		getReposts,
		async sortFeed(a: Algorithm) {
			document.getElementById(`index`)?.addEventListener(`scroll`, this.handleScroll)
			this.posts = []
			this.currentOffset = 0
			this.isLoading = true
			this.algorithm = a
			this.posts = await getPosts(
				{},
				this.$store.state.session.id,
				a,
				this.currentOffset,
				this.limit,
				this.$store.state.session.id,
			)
			this.currentOffset += this.limit
			this.isLoading = false
			return this.posts
		},
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async loadPosts() {
			this.isLoading = true
			try {
				const res = await getPosts(
					{},
					this.$store.state.session.id,
					this.algorithm,
					this.currentOffset,
					this.limit,
					this.algorithm === `FOLLOWING` ? this.$store.state.session.id : ``,
				)
				if (res.length === 0) {
					this.isLoading = false
					document.getElementById(`index`)?.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
			} catch (err) {
				alert(err)
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll() {
			const { scrollTop, scrollHeight, clientHeight } = document.getElementById(`index`) as Element
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				await this.loadPosts()
				this.currentOffset += this.limit
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
