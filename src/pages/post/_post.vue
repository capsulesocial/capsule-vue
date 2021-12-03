<template>
	<div v-if="post && author" id="post" class="w-full flex justify-center">
		<!-- Inner post area -->
		<div style="width: 760px; max-width: 760px; height: fit-content">
			<!-- Magic header that disappears on scroll down -->
			<header
				id="header"
				class="page-header flex items-center sticky top-0 z-10 py-2 px-4 rounded-b-lg bg-gradient-to-r from-lightBGStart to-lightBGStop"
				style="width: 760px; max-width: 760px; backdrop-filter: blur(10px)"
			>
				<div class="trigger-menu-wrapper flex justify-center w-full py-2 ease-in-out">
					<div class="md:min-w-max md:max-w-3xl w-full flex justify-between">
						<!-- Left side: name, avatar, date -->
						<div class="items-center flex">
							<Avatar :avatar="authorAvatar" :authorID="post.authorID" size="w-10 h-10" class="mr-4" />
							<div class="pr-8">
								<nuxt-link :to="`/` + post.authorID" class="font-semibold">{{ author.name }}</nuxt-link>
								<h6 class="font-sans text-sm text-gray6">{{ $formatDate(post.timestamp) }}</h6>
							</div>
							<FriendButton
								v-if="post.authorID !== $store.state.session.id"
								:toggleFriend="toggleFriend"
								:userIsFollowed="userIsFollowed"
							/>
						</div>
						<span class="flex items-center">
							<button class="bg-lightSecondary rounded-full p-1 focus:outline-none" @click="handleClose">
								<XIcon />
							</button>
						</span>
					</div>
				</div>
			</header>
			<section v-if="post !== null" class="pb-16 md:pb-5 mb-5 pt-2">
				<!-- Category and elipses -->
				<article class="w-full flex justify-between my-5">
					<nuxt-link :to="`/discover/` + post.category" class="text-primary capitalize">{{ post.category }}</nuxt-link>
					<div class="flex">
						<BookmarkButton
							:postID="$route.params.post"
							:hasBookmark="isBookmarked"
							class="pr-2"
							@clicked="getBookmarkStatus"
						/>
						<ShareButton :post="post" :cid="$route.params.post" :hasRepost="hasReposted" :repostCount="repostCount" />
					</div>
				</article>
				<article>
					<h1
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="text-h1 font-serif font-semibold mb-3 break-words"
					>
						{{ post.title }}
					</h1>
					<h2
						v-if="post.subtitle"
						:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="text-h2 font-serif font-medium mb-3 break-words"
					>
						{{ post.subtitle }}
					</h2>
				</article>
				<!-- Featured Photo -->
				<article v-if="featuredPhoto !== null" class="mb-5 flex flex-col justify-end relative mt-5 -mx-16">
					<div
						v-if="post.featuredPhotoCaption"
						class="h-16 w-full absolute rounded-b-lg"
						style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
					></div>
					<img :src="featuredPhoto" class="rounded-lg w-full shadow-lg object-cover" />
					<p v-if="post.featuredPhotoCaption" class="absolute text-lightOnPrimaryText px-4 pb-3 text-sm">
						{{ post.featuredPhotoCaption }}
					</p>
				</article>

				<!-- <hr v-if="this.$store.state.settings.darkMode" class="style-two my-5" />
				<hr v-else class="style-one my-5" /> -->

				<!-- Content -->
				<article class="mt-5">
					<div
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="editable prose max-w-none content break-words"
						v-html="content"
					></div>
				</article>

				<!-- Tags -->
				<article class="mt-5">
					<TagCard v-for="t in post.tags" :key="t.name" class="mr-2" :tag="t.name" />
				</article>
				<!-- IPFS CID -->
				<div class="mt-5">
					<a
						:href="`https://ipfs.io/api/v0/dag/get?arg=` + $route.params.post"
						target="_blank"
						class="flex justify-between bg-gray1 rounded-lg text-gray5 px-3 py-1"
					>
						<span>IPFS dag get </span>
						<span>{{ $route.params.post }}</span>
					</a>
				</div>
				<AuthorCard
					:authorAvatar="authorAvatar"
					:authorName="author.name"
					:authorID="author.id"
					:authorBio="author.bio"
					:isFollowed="userIsFollowed"
					:toggleFriend="toggleFriend"
				/>

				<!-- Comments -->
				<article class="pt-5">
					<!-- Choose reaction -->
					<div class="flex flex-row justify-between">
						<div class="flex items-center">
							<BookmarkButton :postID="$route.params.post" :hasBookmark="isBookmarked" @clicked="getBookmarkStatus" />
							<ShareButton
								:post="post"
								:cid="$route.params.post"
								class="z-20"
								:hasRepost="hasReposted"
								:repostCount="repostCount"
							/>
						</div>
					</div>
					<PostActions :postCID="$route.params.post" :initComments="comments" />
				</article>
			</section>
			<section v-else>Post not found 😵‍💫</section>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { marked } from 'marked'
import PostActions from '@/components/post/Actions.vue'
import AuthorCard from '@/components/AuthorCard.vue'
import TagCard from '@/components/Tag.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import ShareButton from '@/components/post/Share.vue'
import Avatar from '@/components/Avatar.vue'
import XIcon from '@/components/icons/X.vue'
import FriendButton from '@/components/FriendButton.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPost, getOnePost, Post } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getReposts } from '@/backend/reposts'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { ICommentData } from '@/backend/comment'

interface IData {
	post: Post | null
	author: Profile | null
	authorAvatar: string | ArrayBuffer | null
	content: string
	featuredPhoto: null | string
	showFilter: boolean
	userIsFollowed: boolean
	myReposts: string[]
	isBookmarked: boolean
	lastScroll: number
	showHeader: boolean
	repostCount: number
	comments: ICommentData[]
}

export default Vue.extend({
	name: `PostReader`,
	components: {
		PostActions,
		AuthorCard,
		TagCard,
		BookmarkButton,
		ShareButton,
		Avatar,
		XIcon,
		FriendButton,
	},
	layout: `reader`,
	// mixins: [markdown],
	data(): IData {
		return {
			post: null,
			author: null,
			authorAvatar: null,
			content: ``,
			featuredPhoto: null,
			showFilter: false,
			userIsFollowed: false,
			myReposts: [],
			isBookmarked: false,
			lastScroll: 0,
			showHeader: true,
			repostCount: -1,
			comments: [],
		}
	},
	async created() {
		// Fetch post from IPFS,
		this.post = await getPost(this.$route.params.post)
		if (this.post === null) {
			throw new Error(`Post is null!`)
		}
		const postMetadata = await getOnePost(this.$route.params.post, this.$store.state.session.id)
		this.isBookmarked = postMetadata.bookmarked
		this.repostCount = postMetadata.repostCount
		this.comments = postMetadata.comments

		// Get author profile
		this.author = createDefaultProfile(this.post.authorID)
		getProfile(this.post.authorID).then((p) => {
			if (p) {
				this.author = p
			}
			if (p && p.avatar.length > 1) {
				getPhotoFromIPFS(p.avatar).then((photo) => {
					this.authorAvatar = photo
				})
			}
		})
		getFollowersAndFollowing(this.$store.state.session.id).then((data) => {
			if (this.post !== null) {
				this.userIsFollowed = data.following.has(this.post.authorID)
			}
		})
		// Get featured photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
		// Convert markdown to HTML
		this.content = marked.parse(this.post.content)

		// Get reposts
		const repostData = await getReposts(this.$store.state.session.id)
		repostData.forEach((p) => {
			// @ts-ignore
			this.myReposts.push(p.repost.postCID)
		})
		const container = document.getElementById(`post`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScroll)
		}
	},
	mounted() {
		if (this.$store.state.settings.recentlyPosted) {
			this.$toastSuccess(`This post has been successfully published`)
		}
	},
	beforeDestroy() {
		if (this.$store.state.settings.recentlyPosted) {
			this.$store.commit(`settings/setRecentlyPosted`, false)
		}
	},
	methods: {
		getReposts,
		isPostBookmarkedByUser,
		async getBookmarkStatus() {
			this.isBookmarked = await isPostBookmarkedByUser(this.$route.params.post, this.$store.state.session.id)
		},
		hasReposted(): boolean {
			if (this.myReposts.includes(this.$route.params.post)) {
				return true
			}
			return false
		},
		async toggleFriend() {
			if (this.post) {
				await followChange(
					this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
					this.$store.state.session.id,
					this.post.authorID,
				)
				const { following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.userIsFollowed = following.has(this.post.authorID)
			}
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
		// Hide header on scroll down
		handleScroll() {
			const body = document.getElementById(`post`)
			const header = document.getElementById(`header`)
			const scrollUp = `scroll-up`
			const scrollDown = `scroll-down`
			if (!body) {
				return
			}
			const currentScroll = body.scrollTop
			if (!header) {
				return
			}
			if (body.scrollTop <= 0) {
				header.classList.remove(scrollUp)
				return
			}
			if (currentScroll > this.lastScroll && !header.classList.contains(scrollDown)) {
				// down
				header.classList.remove(scrollUp)
				header.classList.add(scrollDown)
			} else if (currentScroll < this.lastScroll && header.classList.contains(scrollDown)) {
				// up
				header.classList.remove(scrollDown)
				header.classList.add(scrollUp)
			}
			this.lastScroll = currentScroll
		},
		handleClose() {
			// @ts-ignore
			if (this.$router.history._startLocation === this.$route.path) {
				// IF they started on this page:
				this.$router.push(`/home`)
			} else if (this.$store.state.settings.recentlyPosted) {
				// IF coming from after recently posting:
				this.$router.push(`/` + this.$store.state.session.id)
				this.$store.commit(`settings/setRecentlyPosted`, false)
			} else {
				this.$router.go(-1)
			}
		},
	},
})
</script>

<style>
hr.style-two {
	border: 0;
	height: 1px;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(0, 0, 0, 0.75), rgba(0, 0, 0, 0));
}
hr.style-one {
	border: 0;
	height: 1px;
	background-image: linear-gradient(to right, rgba(0, 0, 0, 0), rgba(255, 255, 255, 0.75), rgba(0, 0, 0, 0));
}
.content {
	text-align: justify;
	text-justify: inter-word;
}
.trigger-menu-wrapper {
	transition: all 0.4s;
	z-index: 50;
}
.page-header {
	transition: all 0.3s ease-in-out;
}
.trigger-menu-wrapper {
	transition: all 0.4s;
}
.scroll-down {
	opacity: 0;
	transform: translate3d(0, -20%, 0);
}
.scroll-up {
	opacity: 1;
	transform: none;
}
</style>
