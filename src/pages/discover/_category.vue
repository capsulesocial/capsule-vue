<template>
	<section class="w-full border border-lightBorder">
		<!-- Header -->
		<div
			id="header"
			class="bg-primary rounded-lg flex flex-row items-center shadow-lg h-56 border-lightBorder w-full trigger-menu-wrapper"
			:style="{
				background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(${require(`@/assets/images/category/` +
					$route.params.category +
					`/` +
					`header.webp`)})`,
				backgroundSize: 'cover',
			}"
		>
			<div class="px-6 py-5 flex flex-col justify-between h-full">
				<button class="flex focus:outline-none relative" @click="$router.go(-1)">
					<div class="bg-gray1 rounded-full flex-shrink-0 z-10">
						<BackIcon />
					</div>
					<p id="buttontitle" class="pl-3 font-semibold trigger-menu-wrapper pr-4">All categories</p>
					<div
						id="button"
						class="bg-lightBG bg-opacity-25 h-full absolute rounded-full trigger-menu-wrapper"
						style="backdrop-filter: blur(10px); width: 155px; z-index: 0"
					></div>
				</button>
				<h2
					id="title"
					class="text-lightOnPrimaryText font-semibold capitalize trigger-menu-wrapper"
					style="font-size: 1.875rem; line-height: 38px"
				>
					{{ $route.params.category }}
				</h2>
			</div>
		</div>
		<!-- Posts loaded -->
		<div
			id="column"
			class="fixed overflow-y-auto pb-56"
			style="width: 748px"
			:style="`min-height: calc(100vh - ` + padding + `); height: calc(100vh - ` + padding + `)`"
		>
			<article v-for="p in posts" :key="generateKey(p)">
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
			<p v-if="noMorePosts" class="text-center text-primary pt-5">No more posts</p>
		</div>
		<!-- Not loaded yet -->
		<article v-show="isLoading" class="flex justify-center w-full modal-animation">
			<div class="loader m-5"></div>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import PostCard from '@/components/post/Card.vue'
import BackIcon from '@/components/icons/ChevronLeft.vue'
import { getPosts, Algorithm, IPostResponse, IRepostResponse } from '@/backend/post'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	posts: Array<IRepostResponse | IPostResponse>
	isLoading: boolean
	lastScroll: number
	following: Set<string>
	currentOffset: number
	limit: number
	algorithm: Algorithm
	padding: string
	noMorePosts: boolean
}

export default Vue.extend({
	components: {
		PostCard,
		BackIcon,
	},
	layout: `discover`,
	data(): IData {
		return {
			posts: [],
			isLoading: true,
			following: new Set(),
			currentOffset: 0,
			limit: 10,
			algorithm: `NEW`,
			lastScroll: 0,
			padding: `0px`,
			noMorePosts: false,
		}
	},
	async created() {
		// Fetch posts from Orbit DB by ID
		this.posts = await getPosts({ category: this.$route.params.category }, this.$store.state.session.id, {
			sort: this.algorithm,
			limit: this.limit,
			offset: 0,
		})
		this.currentOffset += this.limit
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
		this.isLoading = false
		const container = document.getElementById(`column`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScrollHeader)
		}
	},
	destroyed() {
		const container = document.getElementById(`column`)
		if (container) {
			container.removeEventListener(`scroll`, this.handleScrollHeader)
		}
	},
	methods: {
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
				const res = await getPosts({ category: this.$route.params.category }, this.$store.state.session.id, {
					sort: this.algorithm,
					limit: this.limit,
					offset: this.currentOffset,
					following: this.$store.state.session.id,
				})
				if (res.length === 0) {
					this.isLoading = false
					this.noMorePosts = true
				}
				this.posts = this.posts.concat(res)
			} catch (err) {
				this.$toastError(`error`)
			} finally {
				this.isLoading = false
			}
		},
		async handleScrollHeader() {
			const body = document.getElementById(`column`)
			const header = document.getElementById(`header`)
			const buttontitle = document.getElementById(`buttontitle`)
			const button = document.getElementById(`button`)
			const title = document.getElementById(`title`)
			this.padding = header?.clientHeight + `px`
			const scrollUp = `scrollup`
			const scrollDown = `scrolldown`
			const buttontitlecollapsed = `buttontitlecollapsed`
			const buttontitlenotcollapsed = `buttontitlenotcollapsed`
			const buttoncollapsed = `buttonbgcollapsed`
			const buttonnotcollapsed = `buttonbgnotcollapsed`
			const titlecollapsed = `titlecollapsed`
			const titlenotcollapsed = `titlenotcollapsed`
			if (!body) {
				return
			}
			if (!buttontitle) {
				return
			}
			if (!button) {
				return
			}
			if (!title) {
				return
			}
			if (!header) {
				return
			}
			const currentScroll = body.scrollTop
			if (body.scrollTop <= 0) {
				header.classList.remove(scrollUp)
				buttontitle.classList.remove(buttontitlecollapsed)
				button.classList.remove(buttoncollapsed)
				title.classList.remove(titlecollapsed)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				header.classList.remove(scrollUp)
				buttontitle.classList.remove(buttontitlenotcollapsed)
				button.classList.remove(buttonnotcollapsed)
				title.classList.remove(titlenotcollapsed)
				header.classList.add(scrollDown)
				buttontitle.classList.add(buttontitlecollapsed)
				button.classList.add(buttoncollapsed)
				title.classList.add(titlecollapsed)
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
				header.classList.remove(scrollDown)
				buttontitle.classList.remove(buttontitlecollapsed)
				button.classList.remove(buttoncollapsed)
				title.classList.remove(titlecollapsed)
				header.classList.add(scrollUp)
				buttontitle.classList.add(buttontitlenotcollapsed)
				title.classList.add(titlenotcollapsed)
			}
			this.lastScroll = currentScroll
			// Reached bottom, fetch more posts
			if (body.scrollTop + body.clientHeight === body.scrollHeight && !this.noMorePosts) {
				await this.loadPosts()
				this.currentOffset += this.limit
			}
		},
		generateKey(p: IPostResponse | IRepostResponse) {
			let key: string = p.post._id
			// @ts-ignore
			if (p.repost) {
				// @ts-ignore
				key += p.repost._id
			}
			return key
		},
	},
})
</script>

<style>
.trigger-menu-wrapper {
	transition: all 0.4s;
	z-index: 50;
}
.scrolldown {
	background: linear-gradient(180deg, rgba(46, 85, 106, 0.25) 0%, rgba(46, 85, 106, 0.25) 100%), none !important;
	height: 4rem;
	backdrop-filter: blur(10px);
}
.scrollup {
	opacity: 1;
	transform: none;
}
.buttonbgcollapsed {
	opacity: 0;
}
.buttonbgnotcollapsed {
	opacity: 1;
}
.buttontitlecollapsed {
	opacity: 0;
}
.buttontitlenotcollapsed {
	opacity: 1;
}
.titlecollapsed {
	transform: translate3d(35px, -31px, 0px);
	font-size: 1.5rem !important;
	color: #2e556a;
	line-height: 38px !important;
	margin-top: 2px;
	padding-top: 13px;
}
.titlenotcollapsed {
	transform: translate3d(0, 0, 0);
}
</style>
