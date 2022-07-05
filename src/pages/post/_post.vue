<template>
	<div id="post" class="modal-animation card-animation flex w-full justify-center">
		<!-- loader -->
		<article
			v-if="!title || !authorID || !timestamp || !category"
			class="modal-animation fixed mt-20 flex w-full justify-center"
		>
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid` + $color.hex"
			></div>
		</article>
		<!-- Inner post area -->
		<div v-else class="lg:w-760 lg:max-w-760 h-fit w-full">
			<!-- Magic header that disappears on scroll down -->
			<header
				id="header"
				class="page-header xl:w-760 xl:max-w-760 bg-lightBG dark:bg-darkBGStop sticky top-0 z-10 flex w-full items-center rounded-b-lg py-2 px-5"
			>
				<div class="trigger-menu-wrapper flex w-full justify-center py-2 ease-in-out">
					<div class="flex w-full justify-between xl:min-w-max xl:max-w-3xl">
						<!-- Left side: name, avatar, date -->
						<div class="flex items-center">
							<Avatar :avatar="authorAvatar" :authorID="authorID" size="w-10 h-10" class="mr-4 flex-shrink-0" />
							<div class="pr-8 flex flex-col">
								<nuxt-link
									v-if="author && author.name !== ``"
									:to="`/id/` + authorID"
									class="font-semibold dark:text-darkPrimaryText"
									>{{ author.name }}</nuxt-link
								>
								<nuxt-link v-else :to="`/id/` + authorID" class="text-gray5 dark:text-gray3 font-semibold">{{
									authorID
								}}</nuxt-link>
								<nuxt-link :to="`/id/` + authorID" class="text-gray5 dark:text-gray3 text-xs">
									@{{ authorID }}</nuxt-link
								>
							</div>
							<FriendButton
								v-if="authorID !== $store.state.session.id"
								:toggleFriend="toggleFriend"
								:userIsFollowed="userIsFollowed"
								class="hidden lg:block"
							/>
							<!-- Timestamp and reading time -->
							<div class="flex flex-col lg:flex-row items-center lg:ml-8">
								<span class="text-sm text-gray5 dark:text-gray3">
									{{ $formatDate(timestamp) }}
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
			<section class="mb-5 p-5 lg:p-0 pb-16 pt-2 md:pb-5">
				<!-- Post content -->
				<article class="relative">
					<!-- Category and elipses -->
					<article class="my-5 flex w-full justify-between">
						<nuxt-link :to="`/discover/` + category" class="text-primary capitalize">{{
							category.replace(`-`, ` `)
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
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
								style="margin-top: 2px"
								@click="showShare = !showShare"
							>
								<ShareIcon :isActive="showShare" />
							</button>
						</div>
					</article>
					<article>
						<h1
							class="text-lightPrimaryText dark:text-darkPrimaryText text-h1 mb-3 break-words font-serif font-semibold"
						>
							{{ title }}
						</h1>
						<h2
							v-if="subtitle"
							class="text-lightSecondaryText dark:text-gray3 text-h2 mb-3 break-words font-serif font-medium"
						>
							{{ subtitle }}
						</h2>
					</article>
					<div v-if="!content && !showPaywall" class="lg:w-760 lg:max-w-760 h-fit w-full mt-6">
						<!-- Featured Photo loader -->
						<div v-if="featuredPhoto" class="h-72 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
						<!-- Content loader -->
						<div>
							<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
							<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
							<div class="h-3 w-4/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
							<div class="h-6 w-1/2 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
							<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
							<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
							<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
							<div class="h-3 w-3/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
							<div class="h-3 w-2/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
						</div>
					</div>
					<div class="relative">
						<!-- Featured Photo -->
						<article
							v-if="featuredPhoto !== null"
							class="relative mb-5 mt-5 flex cursor-pointer flex-col justify-end"
							@click="showPhoto"
						>
							<div
								v-if="post && post.featuredPhotoCaption && captionHeight !== undefined"
								class="absolute w-full rounded-b-lg"
								:class="
									captionHeight > 72 ? `h-48` : captionHeight > 52 ? `h-40` : captionHeight > 32 ? `h-32` : `h-24`
								"
								style="background: linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, rgba(0, 0, 0, 0.8) 100%)"
							></div>
							<img :src="featuredPhoto" class="w-full rounded-lg object-cover shadow-lg" />
							<p
								v-if="post && post.featuredPhotoCaption"
								id="photoCaption"
								class="text-lightOnPrimaryText absolute px-4 pb-3 text-sm drop-shadow-lg"
								style="text-shadow: 0 0 10px #000"
							>
								{{ post.featuredPhotoCaption }}
							</p>
						</article>
						<!-- Private sensitive content -->
						<div v-else-if="showPaywall" class="h-80 lg:h-72"></div>
						<!-- Post paywall -->
						<article
							v-if="showPaywall"
							class="from-lightBGStart to-transparent dark:from-darkBGStart dark:to-transparent bg-gradient-to-t z-20 absolute top-0 w-full h-full flex"
						>
							<div
								class="w-full shadow-lg flex flex-col items-center py-10 px-16 bg-lightBG dark:bg-darkBGStop rounded-lg h-min"
								:class="featuredPhoto !== null ? `sm:mt-36` : `mt-0`"
							>
								<!-- Not a subscriber -->
								<div v-if="subscriptionStatus === `NOT_SUBSCRIBED`">
									<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
										This post is for Paid subscribers
									</h4>
									<p class="my-4 text-center text-gray5 dark:text-gray3">
										Become a subscriber of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other subscriber-only content
									</p>
									<div class="flex items-center justify-center">
										<SubscribeButton
											:toggleSubscription="toggleSubscription"
											:userIsSubscribed="false"
											:enabledTiers="enabledTiers"
											class="header-profile my-4"
											style="transform: scale(1.2)"
										/>
									</div>
								</div>

								<!-- Subscribed, but to a different tier -->
								<div v-if="subscriptionStatus === `INSUFFICIENT_TIER`">
									<h4 class="text-2xl font-semibold text-neutral mb-4 text-center">
										Your subscription tier does not include this post
									</h4>
									<p class="my-4 text-center text-gray5 dark:text-gray3">
										Subscribe to the
										<span
											v-for="(tier, index) in enabledTierNames.slice(0, 1)"
											:key="index"
											class="text-neutral font-semibold"
											>{{ tier }}</span
										>
										tier of
										<span v-if="author && author.name !== ``" class="font-semibold text-primary">{{
											author.name
										}}</span>
										<span v-else class="font-semibold text-primary">@{{ authorID }}</span> to access
										<br class="hidden lg:block" />
										this post and other posts of this tier.
									</p>
									<!-- change tier -->
									<div class="flex items-center justify-center">
										<button
											class="flex flex-row items-center px-6 py-2 mt-4 bg-neutral text-center text-lightButtonText dark:from-darkBG dark:to-darkBG focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
											@click.prevent="switchTierPopup()"
										>
											<CheckCircleStaticIcon class="h-5 w-5 mr-2" />
											<p class="focus:outline-none">Change Tier</p>
										</button>
									</div>
									<!-- change tier popup -->
									<portal to="postPage">
										<ChangeTierPopup
											v-if="showChangeTier"
											:author="author"
											:authorAvatar="subscriptionProfileAvatar"
											:s="authorPaymentProfile"
											:toPreSelectTier="toPreSelectTiers[0]"
											:enabledTiers="enabledTiers"
											@close="showChangeTier = false"
										/>
									</portal>
								</div>

								<p class="text-sm mt-4 text-gray5 dark:text-gray3">
									Manage my <nuxt-link to="/subscriptions" class="text-neutral text">subscriptions</nuxt-link>
								</p>
							</div>
						</article>
						<div v-if="!content && !showPaywall && featuredPhoto" class="lg:w-760 lg:max-w-760 h-fit w-full mt-20">
							<!-- Featured Photo loader -->
							<div class="h-72 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
							<!-- Content loader -->
							<div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-4/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
								<div class="h-6 w-1/2 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-4"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-full rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-2"></div>
								<div class="h-3 w-3/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse mb-6"></div>
								<div class="h-3 w-2/5 rounded-xl bg-gray1 dark:bg-gray7 animate-pulse"></div>
							</div>
						</div>
						<!-- Content -->
						<article v-else-if="post !== null" class="mt-5">
							<div class="text-lightPrimaryText dark:text-darkSecondaryText editable content max-w-none break-words">
								<PostView
									:content="content"
									:postImages="post.postImages"
									:encrypted="post.encrypted"
									:postImageKeys="postImageKeys"
								/>
							</div>
						</article>
						<!-- Tags -->
						<article class="mt-5 text-lg">
							<TagCard v-for="t in tags" :key="t.name" class="mr-2 mb-2" :tag="t.name" />
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
					</div>
				</article>
				<AuthorCard
					:authorAvatar="authorAvatar"
					:authorName="author ? author.name : ``"
					:authorID="authorID"
					:authorBio="author ? author.bio : ``"
					:isFollowed="userIsFollowed"
					:toggleFriend="toggleFriend"
				/>

				<!-- Comments -->
				<article v-if="post !== null" class="pt-5">
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
								class="focus:outline-none text-gray5 dark:text-gray3 hover:text-primary mr-4 hover:fill-primary flex items-center"
								:class="showShare ? `text-primary` : ``"
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
						:postAuthor="authorID"
					/>
				</article>
			</section>
		</div>
		<!-- Show Post preview card on quote repost -->
		<div v-if="showQuoteRepost">
			<PostCard
				:post="post"
				:profile="author"
				:usersFollowing="following"
				:toggleFriend="toggleFriend"
				:bookmarked="isBookmarked"
				:repostCount="repostCount"
				:commentsCount="commentsCount"
				:bookmarksCount="bookmarksCount"
				:displayRepost="true"
				:isDeleted="deleted"
				@closePopup="closePopup"
			/>
		</div>
		<SharePopup
			v-if="showShare && authorID"
			:image="featuredPhoto ? featuredPhoto : undefined"
			:title="title ? title : ''"
			:subtitle="subtitle"
			:excerpt="excerpt"
			:authorID="authorID"
			:cid="$route.params.post"
			@close="showShare = false"
		/>
		<portal to="postPage">
			<SubscriptionsPopup
				v-if="showSubscriptions"
				:author="author"
				:authorAvatar="authorAvatar"
				:enabledTiers="enabledTiers"
				@close="showSubscriptions = false"
			/>
		</portal>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { AxiosError } from 'axios'

import PostView from '@/components/PostView.vue'
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
import SubscribeButton from '@/components/SubscribeButton.vue'
import SubscriptionsPopup from '@/components/popups/SubscriptionsPopup.vue'
import CheckCircleStaticIcon from '@/components/icons/CheckCircleStatic.vue'
import ChangeTierPopup from '@/components/popups/ChangeTierPopup.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import {
	getOnePost,
	Post,
	verifyPostAuthenticity,
	getPost,
	isEncryptedPost,
	getDecryptedContent,
	IPostImageKey,
	Tag,
} from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getReposts } from '@/backend/reposts'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { createShareableLink } from '@/backend/shareable_links'
import { calculateReadingTime } from '@/backend/utilities/helpers'
import { ActionType, namespace as paymentProfileNamespace, SubscriptionTier } from '@/store/paymentProfile'
import { getUserSubscriptions, ISubscriptionResponse } from '@/backend/subscription'
interface IData {
	post: Post | null
	title: string | null
	subtitle: string | null
	authorID: string | null
	timestamp: number | null
	excerpt: string | null
	category: string | null
	friendlyUrl: string | null
	encrypted: boolean
	deleted: boolean
	tags: Tag[]
	author: Profile | null
	authorAvatar?: string | ArrayBuffer
	content: string
	featuredPhoto: null | string
	showFilter: boolean
	userIsFollowed: boolean
	myReposts: Set<string>
	isBookmarked: boolean
	lastScroll: number
	showHeader: boolean
	repostCount: number
	commentsCount: number
	showQuoteRepost: boolean
	following: Set<string>
	bookmarksCount: number
	popImage: boolean
	captionHeight?: number
	showShare: boolean
	readingTime: number | null
	wordcount: number | null
	postImages: Array<string>
	realURL: string
	isLeaving: boolean
	showPaywall: boolean
	showSubscriptions: boolean
	enabledTiers: Array<string>
	subscriptionStatus: `INSUFFICIENT_TIER` | `NOT_SUBSCRIBED` | ``
	postImageKeys: Array<IPostImageKey>
	isContentLoading: boolean
	enabledTierNames: Array<string>
	toPreSelectTiers: Array<SubscriptionTier>
	showChangeTier: boolean
	authorPaymentProfile: ISubscriptionResponse | undefined
	subscriptionProfile: Profile
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
		PostView,
		SubscribeButton,
		SubscriptionsPopup,
		CheckCircleStaticIcon,
		ChangeTierPopup,
	},
	beforeRouteLeave(to, from, next) {
		if (this.realURL !== `` && to.path !== from.path) {
			history.replaceState(null, ``, this.realURL)
		}
		next()
	},
	layout: `reader`,
	data(): IData {
		return {
			title: null,
			subtitle: null,
			authorID: null,
			timestamp: null,
			excerpt: null,
			category: null,
			deleted: false,
			encrypted: false,
			friendlyUrl: null,
			postImages: [],
			wordcount: null,
			tags: [],
			post: null,
			author: null,
			authorAvatar: undefined,
			content: ``,
			featuredPhoto: null,
			showFilter: false,
			userIsFollowed: false,
			myReposts: new Set(),
			isBookmarked: false,
			lastScroll: 0,
			showHeader: true,
			repostCount: 0,
			commentsCount: 0,
			showQuoteRepost: false,
			following: new Set(),
			bookmarksCount: 0,
			popImage: false,
			captionHeight: 0,
			showShare: false,
			readingTime: null,
			realURL: ``,
			isLeaving: false,
			showPaywall: false,
			showSubscriptions: false,
			enabledTiers: [],
			subscriptionStatus: ``,
			postImageKeys: [],
			isContentLoading: true,
			enabledTierNames: [],
			toPreSelectTiers: [],
			showChangeTier: false,
			authorPaymentProfile: undefined,
			subscriptionProfile: createDefaultProfile(this.$store.state.session.id),
		}
	},
	head() {
		const canonicalLink = {
			rel: `canonical`,
			// @ts-ignore
			href: this.friendlyUrl,
		}
		return {
			// @ts-ignore
			title: this.title ?? `Loading...`,
			meta: [
				{
					hid: `description`,
					name: `description`,
					// @ts-ignore
					content: this.subtitle ?? this.excerpt,
				},
			],
			link: [
				// @ts-ignore
				...(this.friendlyUrl ? [canonicalLink] : []),
			],
		}
	},
	computed: {
		...mapGetters(paymentProfileNamespace, [`getPaymentProfile`]),
	},
	beforeDestroy() {
		this.isLeaving = true
	},
	async created() {
		const sessionID = this.$store.state.session.id
		const postCID = this.$route.params.post
		try {
			const postMetadata = await getOnePost(postCID, sessionID || `x`)
			if (postMetadata.hidden) {
				this.deleted = true
				this.$toastError(`This post has been hidden by the author`)
				this.$emit(`showWarning`)
			}

			this.bookmarksCount = postMetadata.bookmarksCount
			this.isBookmarked = postMetadata.bookmarked
			this.repostCount = postMetadata.repostCount
			this.commentsCount = postMetadata.commentsCount

			const postData = postMetadata.post

			this.updatePostMetadata(postData)
			this.excerpt = postData.excerpt
			// Get reading time
			this.calculateReadingTime()

			// Change URL to social-friendly link, preserve real for Vue router
			createShareableLink(this.$route.params.post)
				.then((friendlyUrl) => {
					this.friendlyUrl = friendlyUrl
					if (!this.isLeaving) {
						this.realURL = this.$route.fullPath
						history.replaceState(null, ``, friendlyUrl)
					}
				})
				.catch((err) => {
					// eslint-disable-next-line no-console
					console.log(`Cannot replace state to shareable link: ${err.message}`)
				})

			// Get author profile
			this.author = createDefaultProfile(postData.authorID)
			getProfile(postData.authorID).then((p) => {
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

			// Get featured photo
			if (postData.featuredPhotoCID) {
				getPhotoFromIPFS(postData.featuredPhotoCID).then((p) => {
					this.featuredPhoto = p
				})
			}

			// Unauthenticated
			if (sessionID === ``) {
				return
			}
		} catch (err: unknown) {
			if (!(err instanceof Error)) {
				throw err
			}
			if (err instanceof AxiosError && err.response?.status === 404) {
				return
			}

			this.$toastError(err.message)
		}

		// This is a new post
		if (this.$store.state.settings.recentlyPosted) {
			this.$toastSuccess(`Your post has been successfully published on Blogchain`)
			this.$store.commit(`settings/setRecentlyPosted`, false)
			// Trigger share popup
			setTimeout(() => {
				this.showShare = true
			}, 1500)
		}

		const profile = await getUserSubscriptions(this.$store.state.session.id)
		const foundProfile = profile.find((p) => p.authorID === this.authorID)
		if (foundProfile) {
			this.authorPaymentProfile = foundProfile
		}
	},
	async mounted() {
		const postCID = this.$route.params.post
		const sessionID = this.$store.state.session.id
		try {
			// Uncomment this to test the loading behaviour/what google sees
			// await new Promise((resolve) => setTimeout(resolve, 1000 * 1000))
			const post = await getPost(postCID)
			verifyPostAuthenticity(post.data, post.sig, post.public_key).then((verified) => {
				if (!verified) {
					this.$toastError(`Post not verified!`)
				}
			})

			const postData = post.data
			this.updatePostMetadata(postData)

			this.fetchPaymentProfile({ username: this.authorID }).catch((err) => {
				if (!(err instanceof AxiosError && err.response?.status === 404)) {
					this.$handleError(err)
				}
			})

			// Get featured photo
			if (postData.featuredPhotoCID && !this.featuredPhoto) {
				getPhotoFromIPFS(postData.featuredPhotoCID).then((p) => {
					this.featuredPhoto = p
				})
			}

			if (isEncryptedPost(postData)) {
				try {
					const decrypted = await getDecryptedContent(postCID, postData.content, sessionID)
					if (`content` in decrypted) {
						this.content = decrypted.content
						this.excerpt = decrypted.content.slice(0, 100) // TODO refine
						this.postImageKeys = decrypted.postImageKeys
					} else {
						// show proper error message according to retrieval status
						// decrypted.status is of type `INSUFFICIENT_TIER` | `NOT_SUBSCRIBED`
						this.enabledTiers = decrypted.enabledTiers
						this.subscriptionStatus = decrypted.status
						// Display premium post paywall
						this.showPaywall = true
					}
				} catch (err) {
					this.showPaywall = true
					if (err instanceof AxiosError && err.response && err.response.data.error) {
						this.$toastError(err.response.data.error)
					} else {
						throw err
					}
				}
			} else {
				this.content = postData.content
				this.excerpt = postData.content.slice(0, 100) // TODO refine
			}

			this.isContentLoading = false

			this.post = postData
		} catch (err: unknown) {
			if (!(err instanceof Error)) {
				throw err
			}
			this.$toastError(err.message)
			return
		}

		// Get reading time
		this.calculateReadingTime()

		// Get caption height
		const caption = document.getElementById(`photoCaption`)
		this.captionHeight = caption?.offsetHeight

		// Get featured photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}

		const container = document.getElementById(`post`)
		if (container) {
			container.addEventListener(`scroll`, this.handleScroll)
		}

		// Unauthenticated
		if (sessionID === ``) {
			return
		}
		// Get my followers
		getFollowersAndFollowing(this.$store.state.session.id).then((data) => {
			if (this.post !== null) {
				this.following = data.following
				this.userIsFollowed = data.following.has(this.post.authorID)
			}
		})
		// Get reposts
		getReposts({ authorID: this.$store.state.session.id }, {}).then((repostData) => {
			this.myReposts = new Set(repostData.map((p) => p.repost.postCID))
		})
		this.initializeProfile()
	},
	methods: {
		getReposts,
		isPostBookmarkedByUser,
		updatePostMetadata(postData: {
			subtitle: string | null
			title: string
			authorID: string
			timestamp: number
			category: string
			tags: Tag[]
			encrypted?: boolean
			wordCount?: number
			postImages?: Array<string>
		}) {
			this.title = postData.title
			if (postData.subtitle) {
				this.subtitle = postData.subtitle
			}
			this.authorID = postData.authorID
			this.timestamp = postData.timestamp
			this.category = postData.category
			if (postData.encrypted) {
				this.encrypted = postData.encrypted
			}
			if (postData.wordCount) {
				this.wordcount = postData.wordCount
			}
			if (postData.postImages) {
				this.postImages = postData.postImages
			}
			this.tags = postData.tags
		},
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
					this.$handleError(err)
				}
			}
		},
		openWindow(url: string) {
			if (process.client) {
				window.open(url, `_blank`)
			}
		},
		initializeProfile() {
			const { tiers } = this.getPaymentProfile(this.authorID)
			this.enabledTiers.forEach((tId) => {
				const foundTier = tiers.find((tier: SubscriptionTier) => tier._id === tId)
				if (foundTier) {
					this.enabledTierNames.push(foundTier.name)
					this.toPreSelectTiers.push(foundTier)
				}
			})
		},
		// switch tier popup
		switchTierPopup() {
			this.showChangeTier = !this.showChangeTier
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
			let wordcount = this.wordcount
			if (this.content) {
				wordcount = this.content.split(/\s+/).length
			}
			if (!wordcount) {
				return
			}
			if (wordcount <= 0) {
				throw new Error(`Word count can't be equal or less than zero`)
			}
			this.readingTime = calculateReadingTime(wordcount, this.postImages.length)
		},
		toggleSubscription() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			// Prevent self-subscribing
			if (this.author?.id !== this.$store.state.session.id) {
				// Send subscription
				this.showSubscriptions = !this.showSubscriptions
			}
		},
		...mapActions(paymentProfileNamespace, {
			fetchPaymentProfile: ActionType.FETCH_PROFILE,
		}),
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
