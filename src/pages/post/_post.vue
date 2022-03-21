<template>
	<div
		id="post"
		class="modal-animation card-animation flex w-full justify-center"
		:style="showQuoteRepost || showShare ? `background-color: #fff` : `backdrop-filter: blur(10px)`"
	>
		<!-- Inner post area -->
		<div v-if="post && author" class="lg:w-760 lg:max-w-760 h-fit w-full">
			<!-- Magic header that disappears on scroll down -->
			<header
				id="header"
				class="page-header xl:w-760 xl:max-w-760 from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG sticky top-0 z-10 flex w-full items-center rounded-b-lg bg-gradient-to-r py-2 px-5"
				style="backdrop-filter: blur(10px)"
			>
				<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
					<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
						<!-- Left side: name, avatar, date -->
						<div class="flex items-center">
							<Avatar :avatar="authorAvatar" :authorID="post.authorID" size="w-10 h-10" class="mr-4 flex-shrink-0" />
							<div class="pr-8 flex flex-col">
								<nuxt-link
									v-if="author.name != ``"
									:to="`/id/` + post.authorID"
									class="font-semibold dark:text-darkPrimaryText"
									>{{ author.name }}</nuxt-link
								>
								<nuxt-link v-else :to="`/id/` + post.authorID" class="text-gray5 dark:text-gray3 font-semibold">{{
									post.authorID
								}}</nuxt-link>
								<nuxt-link :to="`/id/` + post.authorID" class="text-primary dark:text-secondary text-xs">
									@{{ post.authorID }}</nuxt-link
								>
							</div>
							<FriendButton
								v-if="post.authorID !== $store.state.session.id"
								:toggleFriend="toggleFriend"
								:userIsFollowed="userIsFollowed"
								class="hidden lg:block"
							/>
							<!-- Timestamp and reading time -->
							<div class="flex flex-col lg:flex-row items-center lg:ml-8">
								<span class="text-sm text-gray5 dark:text-gray3">
									{{ $formatDate(post.timestamp) }}
								</span>
								<div v-if="readingTime" class="hidden lg:block h-1 w-1 rounded bg-gray5 dark:bg-gray3 mx-2"></div>
								<span v-if="readingTime" class="text-xs lg:text-sm text-gray5 dark:text-gray3">
									{{ readingTime }} min read
								</span>
							</div>
						</div>
						<span class="flex items-center">
							<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="handleClose">
								<XIcon />
							</button>
						</span>
					</div>
				</div>
			</header>
			<section v-if="post !== null" class="mb-5 p-5 lg:p-0 pb-16 pt-2 md:pb-5">
				<!-- Category and elipses -->
				<article class="my-5 flex w-full justify-between">
					<nuxt-link :to="`/discover/` + post.category" class="text-primary dark:text-secondary capitalize">{{
						post.category.replace(`-`, ` `)
					}}</nuxt-link>
					<div class="flex">
						<BookmarkButton
							:postID="$route.params.post"
							:hasBookmark="isBookmarked"
							class="pr-2"
							@clicked="getBookmarkStatus"
						/>
						<!-- Share popup button -->
						<button
							class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary hover:fill-primary flex items-center"
							:class="showShare ? `text-primary dark:text-secondary` : ``"
							style="margin-top: 2px"
							@click="showShare = !showShare"
						>
							<ShareIcon :isActive="showShare" />
						</button>
					</div>
				</article>
				<article>
					<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-h1 mb-3 break-words font-serif font-semibold">
						{{ post.title }}
					</h1>
					<h2
						v-if="post.subtitle"
						class="text-lightSecondaryText dark:text-gray3 text-h2 mb-3 break-words font-serif font-medium"
					>
						{{ post.subtitle }}
					</h2>
				</article>
				<!-- Featured Photo -->
				<article
					v-if="featuredPhoto !== null"
					class="relative mb-5 mt-5 flex cursor-pointer flex-col justify-end"
					@click="showPhoto"
				>
					<div
						v-if="post.featuredPhotoCaption"
						class="absolute w-full rounded-b-lg"
						:class="
							this.captionHeight > 72
								? `h-48`
								: this.captionHeight > 52
								? `h-40`
								: this.captionHeight > 32
								? `h-32`
								: `h-24`
						"
						style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
					></div>
					<img :src="featuredPhoto" class="w-full rounded-lg object-cover shadow-lg" />
					<p
						v-if="post.featuredPhotoCaption"
						id="photoCaption"
						class="text-lightOnPrimaryText absolute px-4 pb-3 text-sm drop-shadow-lg"
						style="text-shadow: 0 0 10px #000"
					>
						{{ post.featuredPhotoCaption }}
					</p>
				</article>
				<!-- Content -->
				<article class="mt-5">
					<div class="text-lightPrimaryText dark:text-darkSecondaryText editable content max-w-none break-words">
						<component :is="readerViewElement" v-if="readerViewElement"></component>
					</div>
				</article>

				<!-- Tags -->
				<article class="mt-5 text-lg">
					<TagCard v-for="t in post.tags" :key="t.name" class="mr-2 mb-2" :tag="t.name" />
				</article>
				<!-- IPFS CID -->
				<div class="mt-3">
					<a
						:href="`https://ipfs.io/api/v0/dag/get?arg=` + $route.params.post"
						target="_blank"
						class="bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray1 flex flex-row justify-between rounded-lg px-3 py-1"
					>
						<span class="mr-4" style="flex-shrink: 0">IPFS address </span>
						<span class="overflow-hidden" style="text-overflow: ellipsis">{{ $route.params.post }}</span>
						<span class="block"><LinkIcon class="py-1" /></span>
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
							<RepostButton
								:post="post"
								:cid="$route.params.post"
								:hasRepost="hasReposted"
								:repostCount="repostCount"
								class="ml-2 mr-3"
								@toggleRepost="handleRepost"
							/>
							<!-- Share popup button -->
							<button
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-secondary mr-4 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary dark:text-secondary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :isActive="showShare" />
								<p class="ml-1 text-sm">Share</p>
							</button>
						</div>
					</div>
					<PostActions
						:postCID="$route.params.post"
						:bookmarksCount="bookmarksCount"
						:repostsCount="repostCount"
						:postAuthor="author.id"
					/>
				</article>
			</section>
			<section v-else>Post not found</section>
		</div>
		<article v-show="isLoading" class="modal-animation fixed mt-20 flex w-full justify-center">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
			></div>
		</article>
		<!-- Show Post preview card on quote repost -->
		<div v-if="showQuoteRepost">
			<PostCard
				:post="post"
				:comments="comments"
				:profile="author"
				:usersFollowing="following"
				:toggleFriend="toggleFriend"
				:bookmarked="isBookmarked"
				:repostCount="repostCount"
				:bookmarksCount="bookmarksCount"
				:displayRepost="true"
				:isDeleted="post.deleted"
				@closePopup="closePopup"
			/>
		</div>
		<SharePopup
			v-if="showShare"
			:image="featuredPhoto"
			:title="post.title"
			:subtitle="post.subtitle"
			:excerpt="post.excerpt"
			:authorID="post.authorID"
			:cid="$route.params.post"
			@close="showShare = false"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import readerViewFactory from './readerView'

import PostActions from '@/components/post/Actions.vue'
import AuthorCard from '@/components/AuthorCard.vue'
import TagCard from '@/components/Tag.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import RepostButton from '@/components/post/Repost.vue'
import ShareIcon from '@/components/icons/Share.vue'
import Avatar from '@/components/Avatar.vue'
import XIcon from '@/components/icons/X.vue'
import LinkIcon from '@/components/icons/Link.vue'
import FriendButton from '@/components/FriendButton.vue'
import PostCard from '@/components/post/Card.vue'
import SharePopup from '@/components/popups/SharePopup.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getRegularPost, getOnePost, Post } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getReposts } from '@/backend/reposts'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { ICommentData } from '@/backend/comment'
import ogImage from '@/assets/images/util/ogImage.png'
import { domain } from '@/backend/utilities/config'
import { createShareableLink } from '@/backend/shareable_links'

interface IData {
	post: Post | null
	author: Profile | null
	authorAvatar: string | ArrayBuffer | null
	content: string
	featuredPhoto: null | string
	showFilter: boolean
	userIsFollowed: boolean
	myReposts: Set<string>
	isBookmarked: boolean
	lastScroll: number
	showHeader: boolean
	repostCount: number
	comments: ICommentData[]
	isLoading: boolean
	showQuoteRepost: boolean
	following: Set<string>
	bookmarksCount: number
	popImage: boolean
	readerViewElement: any | null
	dark: boolean
	captionHeight: number | undefined
	showShare: boolean
	readingTime: number | null
}

export default Vue.extend({
	name: `PostReader`,
	components: {
		PostActions,
		AuthorCard,
		TagCard,
		BookmarkButton,
		ShareIcon,
		Avatar,
		LinkIcon,
		XIcon,
		FriendButton,
		PostCard,
		RepostButton,
		SharePopup,
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
			myReposts: new Set(),
			isBookmarked: false,
			lastScroll: 0,
			showHeader: true,
			repostCount: 0,
			comments: [],
			isLoading: true,
			showQuoteRepost: false,
			following: new Set(),
			bookmarksCount: 0,
			popImage: false,
			readerViewElement: null,
			dark: false,
			captionHeight: 0,
			showShare: false,
			readingTime: null,
		}
	},
	head() {
		return {
			// @ts-ignore
			title: this.post ? `${this.post.title} by ${this.post.authorID} on Blogchain` : `Loading...`,
			meta: [
				{
					hid: `post - ${this.$route.params.post}`,
					name: `Post`,
					// @ts-ignore
					content: `${this.post?.title} by ${this.post?.authorID} on Blogchain`,
				},
				{
					hid: `og:title`,
					property: `og:title`,
					// @ts-ignore
					content: `${this.post?.title}`,
				},
				{
					hid: `og:description`,
					property: `og:description`,
					// @ts-ignore
					content: `${this.post?.subtitle}`,
				},
				{
					hid: `og:type`,
					property: `og:type`,
					content: `article`,
				},
				{ hid: `og:image`, property: `og:image`, content: `${domain}` + ogImage },
			],
		}
	},
	async created() {
		// Fetch post from IPFS
		this.post = await getRegularPost(this.$route.params.post)
		if (!this.post) {
			this.$toastError(`This post has not been found`)
			throw new Error(`Post is null!`)
		}

		// Get featured photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
		// Create the ReaderView element from Markdown. This is a dynamic vue element.
		this.readerViewElement = readerViewFactory(this.post.content, this.post.postImages)
		// Get author profile
		this.author = createDefaultProfile(this.post.authorID)
		getProfile(this.post.authorID).then((p) => {
			const { profile } = p
			if (profile) {
				this.author = profile
			}
			if (profile && profile.avatar.length > 1) {
				getPhotoFromIPFS(profile.avatar).then((photo) => {
					this.authorAvatar = photo
				})
			}
		})

		// Get reading time
		this.calculateReadingTime()
		// Change URL to social-friendly link
		createShareableLink(this.$route.params.post)
			.then((friendlyUrl) => {
				history.replaceState(null, ``, friendlyUrl)
			})
			.catch((err) => {
				// eslint-disable-next-line no-console
				console.log(`Cannot replace state to shareable link: ${err.message}`)
			})

		// Get caption height
		const caption = document.getElementById(`photoCaption`)
		this.captionHeight = caption?.offsetHeight

		// unauthenticated
		if (this.$store.state.session.id === ``) {
			const postMetadata = await getOnePost(this.$route.params.post, `x`)
			this.bookmarksCount = postMetadata.bookmarksCount
			this.isBookmarked = postMetadata.bookmarked
			this.repostCount = postMetadata.repostCount
			this.comments = postMetadata.comments
			this.isLoading = false
			return
		}
		// Authenticated
		const postMetadata = await getOnePost(this.$route.params.post, this.$store.state.session.id)
		this.bookmarksCount = postMetadata.bookmarksCount
		this.isBookmarked = postMetadata.bookmarked
		this.repostCount = postMetadata.repostCount
		this.comments = postMetadata.comments
		this.isLoading = false
		// Get my followers
		getFollowersAndFollowing(this.$store.state.session.id).then((data) => {
			if (this.post !== null) {
				this.following = data.following
				this.userIsFollowed = data.following.has(this.post.authorID)
			}
		})
		// Get reposts
		const repostData = await getReposts({ authorID: this.$store.state.session.id }, {})
		this.myReposts = new Set(repostData.map((p) => p.repost.postCID))
	},
	mounted() {
		const container = document.getElementById(`post`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScroll)
		}
		if (this.$store.state.settings.recentlyPosted) {
			this.$toastSuccess(`Your post has been successfully published on Blogchain`)
		}
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
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
			return this.myReposts.has(this.$route.params.post)
		},
		async toggleFriend() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (this.post) {
				try {
					await followChange(
						this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						this.post.authorID,
					)
					this.$toastSuccess(
						this.userIsFollowed ? `Unfollowed ${this.post.authorID}` : `Followed ${this.post.authorID}`,
					)
					const { following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
					this.userIsFollowed = following.has(this.post.authorID)
				} catch (err: unknown) {
					if (axios.isAxiosError(err)) {
						if (!err.response) {
							this.$toastError(`Network error, please try again`)
							return
						}
						if (err.response.status === 429) {
							this.$toastError(`Too many requests, please try again in a minute`)
							return
						}
						this.$toastError(err.response.data.error)
						return
					}
					if (err instanceof Error) {
						this.$toastError(err.message)
						return
					}
					throw err
				}
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
			if (this.$router.history._startLocation === this.$route.path) {
				// IF they started on this page:
				this.$router.push(`/home`)
				return
			}
			if (this.$store.state.settings.recentlyPosted) {
				// IF coming from after recently posting:
				this.$router.push(`/id/` + this.$store.state.session.id)
				this.$store.commit(`settings/setRecentlyPosted`, false)
				return
			}
			this.$router.go(-1)
		},
		handleRepost() {
			this.showQuoteRepost = true
		},
		closePopup() {
			this.showQuoteRepost = false
		},
		showPhoto() {
			this.$emit(`showPhoto`, {
				photo: this.featuredPhoto,
				caption: this.post?.featuredPhotoCaption,
			})
		},
		calculateReadingTime() {
			if (!this.post) {
				throw new Error(`Post can't be null`)
			}
			const wordcount = this.post.content.split(/\s+/).length - 1
			if (wordcount <= 0) {
				throw new Error(`Word count can't be equal or less than zero`)
			}
			const textReadingTime = wordcount / 275
			let photoReadingTime = 0
			if (this.post.postImages) {
				photoReadingTime = (this.post.postImages.length * ((12 * 100) / 60)) / 100
			}
			const readingTime = Math.round(((textReadingTime + photoReadingTime) * 60) / 100)
			this.readingTime = readingTime < 1 ? 1 : readingTime
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
ol {
	margin-left: 0;
}
ol ol {
	margin-left: 8em;
}
ol li {
	list-style-type: none;
	counter-reset: list-1 list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
	counter-increment: list-0;
}
ol li::before {
	content: counter(list-0, decimal) '. ';
}
ol li.ql-indent-1 {
	counter-increment: list-1;
}
ol li.ql-indent-1::before {
	content: counter(list-1, lower-alpha) '. ';
}
ol li.ql-indent-1 {
	counter-reset: list-2 list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-2 {
	counter-increment: list-2;
}
ol li.ql-indent-2::before {
	content: counter(list-2, lower-roman) '. ';
}
ol li.ql-indent-2 {
	counter-reset: list-3 list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-3 {
	counter-increment: list-3;
}
ol li.ql-indent-3::before {
	content: counter(list-3, decimal) '. ';
}
ol li.ql-indent-3 {
	counter-reset: list-4 list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-4 {
	counter-increment: list-4;
}
ol li.ql-indent-4::before {
	content: counter(list-4, lower-alpha) '. ';
}
ol li.ql-indent-4 {
	counter-reset: list-5 list-6 list-7 list-8 list-9;
}
ol li.ql-indent-5 {
	counter-increment: list-5;
}
ol li.ql-indent-5::before {
	content: counter(list-5, lower-roman) '. ';
}
ol li.ql-indent-5 {
	counter-reset: list-6 list-7 list-8 list-9;
}
ol li.ql-indent-6 {
	counter-increment: list-6;
}
ol li.ql-indent-6::before {
	content: counter(list-6, decimal) '. ';
}
ol li.ql-indent-6 {
	counter-reset: list-7 list-8 list-9;
}
ol li.ql-indent-7 {
	counter-increment: list-7;
}
ol li.ql-indent-7::before {
	content: counter(list-7, lower-alpha) '. ';
}
ol li.ql-indent-7 {
	counter-reset: list-8 list-9;
}
ol li.ql-indent-8 {
	counter-increment: list-8;
}
ol li.ql-indent-8::before {
	content: counter(list-8, lower-roman) '. ';
}
ol li.ql-indent-8 {
	counter-reset: list-9;
}
ol li.ql-indent-9 {
	counter-increment: list-9;
}
ol li.ql-indent-9::before {
	content: counter(list-9, decimal) '. ';
}
.ql-indent-1 {
	padding-left: 2em;
}
li.ql-indent-1 {
	padding-left: 2em;
	list-style-position: inside;
}
.ql-indent-2 {
	padding-left: 4em;
}
li.ql-indent-2 {
	padding-left: 4em;
	list-style-position: inside;
}
.ql-indent-3 {
	padding-left: 6em;
}
li.ql-indent-3 {
	padding-left: 6em;
	list-style-position: inside;
}
.ql-indent-4 {
	padding-left: 8em;
}
li.ql-indent-4 {
	padding-left: 8em;
	list-style-position: inside;
}
.ql-indent-5 {
	padding-left: 10em;
}
li.ql-indent-5 {
	padding-left: 10em;
	list-style-position: inside;
}
.ql-indent-6 {
	padding-left: 12em;
}
li.ql-indent-6 {
	padding-left: 12em;
	list-style-position: inside;
}
.ql-indent-7 {
	padding-left: 14em;
}
li.ql-indent-7 {
	padding-left: 14em;
	list-style-position: inside;
}
.ql-indent-8 {
	padding-left: 16em;
}
li.ql-indent-8 {
	padding-left: 16em;
	list-style-position: inside;
}
.ql-indent-9 {
	padding-left: 18em;
}
li.ql-indent-9 {
	padding-left: 18em;
	list-style-position: inside;
}
</style>
