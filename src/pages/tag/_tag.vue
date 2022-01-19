<template>
	<section class="w-full border border-lightBorder">
		<!-- Tag page header -->
		<div
			class="rounded-lg flex flex-row items-center shadow-lg p-2 border-lightBorder bg-primary bg-opacity-25"
			style="backdrop-filter: blur(10px)"
		>
			<button class="bg-gray1 rounded-full flex-shrink-0 m-3 focus:outline-none" @click="$router.go(-1)">
				<BackIcon />
			</button>
			<h2 class="text-2xl text-primary font-semibold">{{ $route.params.tag }}</h2>
		</div>
		<!-- Posts loaded -->
		<div ref="container" class="fixed overflow-y-auto w-full xl:w-750 min-h-130 h-130 xl:min-h-150 xl:h-150">
			<article v-for="p in posts" :key="p.post._id">
				<PostCard
					:repost="p.repost"
					:post="p.post"
					:cid="p.post._id"
					:comments="p.comments"
					:toggleFriend="toggleFriend"
					:usersFollowing="following"
					:repostedBy="p.repost ? p.repost.authorID : undefined"
					:bookmarked="p.bookmarked"
					:hideRepostIcon="algorithm === `NEW` || algorithm === `TOP`"
					:bookmarksCount="p.bookmarksCount"
					:repostCount="p.repostCount"
				/>
			</article>
		</div>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="flex justify-center w-full">
			<div class="loader m-6 modal-animation"></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import BackIcon from '@/components/icons/ChevronLeft.vue'
import { getPosts, Algorithm, IPostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: IPostResponse[]
	tag: string
	isLoading: boolean
	following: Set<string>
	currentOffset: number
	limit: number
	algorithm: Algorithm
}

export default Vue.extend({
	name: `TagPage`,
	components: {
		PostCard,
		BackIcon,
	},
	layout: `discover`,
	data(): IData {
		return {
			posts: [],
			tag: this.$route.params.tag,
			isLoading: true,
			following: new Set(),
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
		}
	},
	async created() {
		// Fetch posts with tag (unauthenticated)
		if (this.$store.state.session.id === ``) {
			this.posts = await getPosts({ tag: this.$route.params.tag }, `x`, {
				sort: this.algorithm,
				limit: this.limit,
				offset: this.currentOffset,
			})
			this.currentOffset += this.limit
			this.isLoading = false
			return
		}
		// Fetch posts with tag (authenticated)
		this.posts = await getPosts({ tag: this.$route.params.tag }, this.$store.state.session.id, {
			sort: this.algorithm,
			limit: this.limit,
			offset: this.currentOffset,
		})
		this.currentOffset += this.limit
		this.isLoading = false
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async loadPosts() {
			this.isLoading = true
			// Unauthenticated
			if (this.$store.state.session.id === ``) {
				try {
					const res = await getPosts({ tag: this.$route.params.tag }, `x`, {
						sort: this.algorithm,
						offset: this.currentOffset,
						limit: this.limit,
					})
					if (res.length === 0) {
						this.isLoading = false
						const container = this.$refs.container as HTMLElement
						container.removeEventListener(`scroll`, this.handleScroll)
						return
					}
					this.posts = this.posts.concat(res)
					this.currentOffset += this.limit
				} catch (err) {
					this.$toastError(`An error has occured`)
				} finally {
					this.isLoading = false
				}
				return
			}
			// Authenticated
			try {
				const res = await getPosts({ tag: this.$route.params.tag }, this.$store.state.session.id, {
					sort: this.algorithm,
					offset: this.currentOffset,
					limit: this.limit,
				})
				if (res.length === 0) {
					this.isLoading = false
					const container = this.$refs.container as HTMLElement
					container.removeEventListener(`scroll`, this.handleScroll)
				}
				this.posts = this.posts.concat(res)
				this.currentOffset += this.limit
			} catch (err) {
				this.$toastError(`An error has occured`)
			} finally {
				this.isLoading = false
			}
		},
		async handleScroll(e: Event) {
			if (this.isLoading) {
				return
			}
			const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				await this.loadPosts()
			}
		},
	},
})
</script>
