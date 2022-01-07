<template>
	<article v-if="!postDeleted" class="object-contain z-auto">
		<!-- popup backdrop -->
		<div
			:class="
				showPopup
					? `fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center bg-opacity-50 modal-animation`
					: ``
			"
		>
			<div
				class="card"
				:class="
					showPopup
						? `shadow-lg rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg mt-10 overflow-y-auto card-animation`
						: ``
				"
				:style="showPopup ? `width: 750px; backdrop-filter: blur(10px); max-height: 90vh` : ``"
				style="backdrop-filter: blur(10px)"
			>
				<div
					class="sticky top-0 z-20 pb-5 border-b bg-gradient-to-r from-lightBGStart to-lightBGStop px-6 pt-5"
					style="backdrop-filter: blur(10px)"
				>
					<!-- Show Quote Repost input -->
					<div v-if="showRepostEditor" class="flex flex-row pb-4">
						<Avatar :authorID="$store.state.session.id" :avatar="myAvatar" class="flex-shrink-0" />
						<textarea
							ref="repostText"
							v-model="quoteContent"
							class="w-full ml-4 resize-none focus:outline-none"
							placeholder="What's your response?"
						></textarea>
						<button
							class="absolute right-0 top-0 rounded-full bg-gray1 p-1 m-6 focus:outline-none"
							@click="handleCloseButton"
						>
							<XIcon />
						</button>
					</div>
					<!-- Quote repost -->
					<div v-if="quote && !showRepostEditor">
						<div class="flex w-full">
							<Avatar :avatar="quote.avatar" :authorID="quote.authorID" size="w-12 h-12" />
							<div class="flex flex-col flex-grow ml-4">
								<nuxt-link :to="`/id/` + quote.authorID" class="flex mr-4">
									<span class="font-medium text-base">{{ this.quote.name }}</span>
									<span class="ml-2 text-primary">@{{ this.quote.authorID }}</span>
								</nuxt-link>
								<span class="text-xs ml-14">{{ $formatDate(this.quote.timestamp) }}</span>
							</div>
							<!-- Delete quote repost button -->
							<div v-if="quote.authorID === $store.state.session.id" class="relative">
								<button class="focus:outline-none ml-2 text-gray5" @click.stop="toggleDropdownQuoteDelete">
									<More />
								</button>
								<div
									v-show="showQuoteDelete"
									class="absolute flex flex-col rounded-lg w-32 shadow-lg z-10 p-1 modal-animation"
									style="top: 25px; right: 0px"
								>
									<!-- Delete -->
									<button class="flex focus:outline-none text-negative" @click="deleteQuote">
										<BinIcon class="p-1" />
										<span class="text-xs self-center text-negative">Delete Quote</span>
									</button>
								</div>
							</div>
						</div>
						<p class="break-words my-2">{{ this.quote.content }}</p>
					</div>
					<!-- Wrapper for rounded outline on quote repost -->
					<div :class="showRepostEditor || quote ? `rounded-lg bg-lightBorder p-4` : ``">
						<!-- Simple repost -->
						<div
							v-if="repostedBy !== `` && !hideRepostIcon && quote === null"
							class="flex w-full -mt-2 mb-2 text-gray5 items-center pt-2"
						>
							<RepostIcon />
							<p class="pl-2 text-sm text-gray5">
								<nuxt-link :to="`/id/` + repostedBy">{{ repostedBy }} </nuxt-link>
								reposted
							</p>
						</div>
						<!-- Top: avatar, name, id, close -->
						<div class="flex w-full">
							<Avatar :avatar="avatar" :authorID="post.authorID" size="w-12 h-12" />
							<div class="flex flex-col flex-grow ml-4">
								<div class="flex" @mouseover="showFriendButton = true" @mouseleave="showFriendButton = false">
									<nuxt-link :to="'/id/' + post.authorID" class="flex mr-4">
										<span class="font-medium text-base">
											{{ authorName }}
										</span>
										<span class="ml-2 text-primary"> @{{ post.authorID }} </span>
									</nuxt-link>
									<span v-show="showFriendButton" class="modal-animation">
										<FriendButton
											v-if="post.authorID !== $store.state.session.id && $route.name !== `id`"
											:small="true"
											:userIsFollowed="usersFollowing.has(post.authorID)"
											:toggleFriend="() => toggleFriend(post.authorID)"
										/>
									</span>
								</div>
								<!-- Timestamp -->
								<span class="text-xs ml-14">
									{{ $formatDate(post.timestamp) }}
								</span>
							</div>
							<div class="flex items-center relative" :class="repostedBy !== `` ? `-mt-4` : ``">
								<!-- Bookmarks button -->
								<BookmarkButton :postID="postCID" :hasBookmark="isBookmarked" @clicked="getBookmarkStatus" />
								<button
									v-if="post.authorID === $store.state.session.id"
									class="focus:outline-none ml-2 text-gray5"
									@click.stop="toggleDropdownDelete"
								>
									<More />
								</button>
								<button
									v-show="showPopup && !showRepostEditor"
									class="right-0 top-0 rounded-full bg-gray1 p-1 focus:outline-none ml-4"
									@click="handleCloseButton"
								>
									<XIcon />
								</button>
								<div
									v-show="showDelete"
									class="absolute flex flex-col rounded-lg w-32 shadow-lg z-10 p-1 modal-animation"
									:style="
										quote && quote.authorID === $store.state.session.id
											? `top: 45px; right: 10px`
											: `top: 35px; right: 0px`
									"
								>
									<!-- Delete -->
									<button class="flex focus:outline-none text-negative" @click="deletePost">
										<BinIcon class="p-1" />
										<span class="text-xs self-center text-negative">Delete this post</span>
									</button>
								</div>
							</div>
						</div>
						<!-- Content -->
						<div class="mt-4 flex justify-between">
							<!-- Left side: Title, subtitle / preview, tags -->
							<div class="mr-4">
								<nuxt-link :to="'/post/' + postCID">
									<div class="flex flex-col pr-4 max-w-full overflow-hidden">
										<h3 class="text-lg font-semibold pb-2 break-words">
											{{ post.title }}
										</h3>
										<h6
											v-if="(post.subtitle || post.excerpt) && featuredPhoto"
											:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
											class="break-words"
											style="max-width: 420px"
										>
											{{ post.subtitle ? post.subtitle : postExcerpt() }}
										</h6>
										<h6
											v-if="(post.subtitle || post.excerpt) && !featuredPhoto"
											:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
											class="break-words"
											style="max-width: 700px"
										>
											{{ post.subtitle ? post.subtitle : postExcerpt() }}
										</h6>
									</div>
								</nuxt-link>
								<!-- Display tags -->
								<div class="flex overflow-x-auto my-2">
									<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="mr-4 my-2" />
								</div>
								<!-- Comment and share -->
								<div v-show="!showPopup" class="flex mt-1 text-gray5">
									<button
										class="flex items-end focus:outline-none mr-2 text-gray5 hover:text-primary hover:fill-primary"
										:class="showComments ? `text-primary` : ``"
										@click="toggleComments"
									>
										<CommentIcon :isActive="showComments" />
										<span v-if="comments" class="ml-1">{{ comments.length }}</span>
									</button>
									<Share
										:repost="repost"
										:post="post"
										:cid="postCID"
										class="fill-primary"
										:hasRepost="hasReposted"
										:repostCount="repostCount"
										@toggleRepost="toggleQuoteRepost"
									/>
									<button class="focus:outline-none ml-4" @click="toggleStatsCard"><StatsIcon /></button>
								</div>
							</div>
							<!-- Right side: Image -->
							<div v-if="featuredPhoto !== ``" class="flex-shrink-0 w-56">
								<nuxt-link :to="'/post/' + postCID">
									<img :src="featuredPhoto" class="flex-shrink-0 h-32 object-cover rounded-lg w-full" />
								</nuxt-link>
							</div>
						</div>
					</div>
					<!-- Repost POST button -->
					<div
						v-if="showRepostEditor"
						class="pt-4 flex flex-row-reverse"
						:class="quoteContent !== `` ? '' : 'opacity-50'"
						style="transition: all 0.4s"
					>
						<BrandedButton :action="handleSendRepost" :text="`Post`" />
					</div>
				</div>
				<PostActions
					v-if="showComments || showStats"
					:postCID="postCID"
					:bookmarksCount="$props.bookmarksCount"
					:repostsCount="$props.repostCount"
					:openStats="showStats"
					class="px-6 pb-6"
				/>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostActions from '@/components/post/Actions.vue'
import Avatar from '@/components/Avatar.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import Share from '@/components/post/Share.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import TagPill from '@/components/Tag.vue'
import More from '@/components/icons/More.vue'
import XIcon from '@/components/icons/X.vue'
import FriendButton from '@/components/FriendButton.vue'
import RepostIcon from '@/components/icons/Repost.vue'
import StatsIcon from '@/components/icons/Stats.vue'
import BinIcon from '@/components/icons/Bin.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { RetrievedPost, getRegularPost } from '@/backend/post'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { sendPostDeletion } from '@/backend/postDeletion'
import { IRepost, sendRepost } from '@/backend/reposts'
import { ICommentData } from '@/backend/comment'

interface IData {
	showComments: boolean
	showStats: boolean
	showDelete: boolean
	showQuoteDelete: boolean
	authorName: string
	avatar: string
	myAvatar: string
	featuredPhoto: string
	isBookmarked: boolean
	postDeleted: boolean
	showFriendButton: boolean
	showRepostEditor: boolean
	showPopup: boolean
	quoteContent: string
	quote: {
		authorID: string
		timestamp: number
		content: string
		avatar: string
		name: string
	} | null
	postCID: string
}

export default Vue.extend({
	name: `PostCard`,
	components: {
		PostActions,
		Avatar,
		BookmarkButton,
		Share,
		CommentIcon,
		TagPill,
		More,
		XIcon,
		BinIcon,
		StatsIcon,
		FriendButton,
		RepostIcon,
		BrandedButton,
	},
	props: {
		repost: {
			type: Object as PropType<IRepost>,
			default: null,
		},
		post: {
			type: Object as PropType<RetrievedPost>,
			required: true,
		},
		repostedBy: {
			type: String,
			default: ``,
		},
		comments: {
			type: Array as PropType<ICommentData[] | undefined>,
			default: undefined,
		},
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
		usersFollowing: {
			type: Set as PropType<Set<string>>,
			default: () => new Set(),
		},
		toggleFriend: {
			type: Function as PropType<(id: string) => void>,
			default: () => null,
		},
		hideRepostIcon: {
			type: Boolean,
			default: false,
		},
		bookmarked: {
			type: Boolean,
			default: false,
		},
		bookmarksCount: {
			type: Number,
			default: 0,
		},
		repostCount: {
			type: Number,
			default: 0,
		},
		displayRepost: {
			type: Boolean,
			default: false,
		},
	},
	data(): IData {
		return {
			showComments: false,
			showStats: false,
			showDelete: false,
			showQuoteDelete: false,
			authorName: ``,
			avatar: ``,
			myAvatar: ``,
			featuredPhoto: ``,
			isBookmarked: false,
			postDeleted: false,
			showFriendButton: false,
			showRepostEditor: false,
			showPopup: false,
			quote: null,
			postCID: ``,
			quoteContent: ``,
		}
	},
	async created() {
		// Get post CID if on full post page
		if (this.post._id === undefined) {
			this.postCID = this.$route.params.post
		} else {
			this.postCID = this.post._id
		}
		// Populate author profile
		let profile = this.profile
		if (!profile) {
			if (this.$store.state.session.id === this.post.authorID) {
				// Viewing own post
				profile = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				profile = createDefaultProfile(this.post.authorID)
				const fetchedProfile = await getProfile(this.post.authorID)
				if (fetchedProfile.profile) {
					profile = fetchedProfile.profile
				}
			}
		}
		// Populate Avatar
		this.authorName = profile.name
		if (profile.avatar && profile.avatar !== ``) {
			getPhotoFromIPFS(profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Populate Featured Photo
		if (this.post.featuredPhotoCID) {
			getPhotoFromIPFS(this.post.featuredPhotoCID).then((p) => {
				this.featuredPhoto = p
			})
		}
		// Get bookmark status
		this.isBookmarked = this.bookmarked

		// Check if this is a repost
		if (this.repost && this.repost.type === `quote`) {
			this.getQuoteRepost(this.repost._id)
		}

		// Handle quote repost on full post page
		if (this.displayRepost) {
			// this.showPopup = true
			// this.showRepostEditor = true
			this.toggleQuoteRepost()
		}

		// Close pop-up event listener
		window.addEventListener(`click`, this.handleClose, false)
		window.addEventListener(
			`click`,
			(e: any): void => {
				if (!e.target) {
					return
				}
				if (
					e.target.parentNode === null ||
					e.target.parentNode.classList === undefined ||
					!e.target.parentNode.classList.contains(`toggle`)
				) {
					this.showQuoteDelete = false
					this.showDelete = false
				}
			},
			false,
		)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
	},
	methods: {
		isPostBookmarkedByUser,
		getRegularPost,
		sendRepost,
		getProfile,
		async deletePost() {
			await sendPostDeletion(`HIDE`, this.postCID, this.$store.state.session.id)
			this.postDeleted = true
			this.$toastSuccess(`This post has been successfully deleted`)
		},
		async deleteQuote() {
			await sendPostDeletion(`HIDE`, this.repost._id, this.$store.state.session.id)
			this.postDeleted = true
			this.$toastSuccess(`This quote has been successfully deleted`)
		},
		async getBookmarkStatus() {
			this.isBookmarked = await isPostBookmarkedByUser(this.postCID, this.$store.state.session.id)
			this.$emit(`updateBookmarks`)
		},
		hasReposted(): boolean {
			return this.$store.state.session.id === this.$props.repostedBy || this.$store.getters.checkReposts(this.postCID)
		},
		postExcerpt(): string {
			const excerpt = this.post.excerpt.slice(0, 177).trim()
			if (excerpt.endsWith(`...`)) {
				return excerpt
			}
			if (excerpt.endsWith(`..`)) {
				return excerpt + `.`
			}
			if (excerpt.endsWith(`.`)) {
				return excerpt + `..`
			}
			return excerpt + `...`
		},
		handleClose(e: any): void {
			if (!e.target || e.target.firstChild === null || e.target.firstChild.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `card`) {
				this.showComments = false
				this.showStats = false
				this.showRepostEditor = false
				this.showPopup = false
				this.$emit(`closePopup`)
			}
		},
		handleCloseButton(): void {
			this.showComments = false
			this.showStats = false
			this.showRepostEditor = false
			this.showPopup = false
			this.$emit(`closePopup`)
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
		toggleDropdownQuoteDelete() {
			this.showQuoteDelete = !this.showQuoteDelete
		},
		async toggleQuoteRepost() {
			if (this.$store.state.session.avatar) {
				this.myAvatar = await getPhotoFromIPFS(this.$store.state.session.avatar)
			}
			this.showPopup = true
			if (this.showRepostEditor) {
				this.showPopup = false
			}
			this.showRepostEditor = !this.showRepostEditor
		},
		toggleComments() {
			this.showComments = !this.showComments
			this.showPopup = true
		},
		toggleStatsCard() {
			this.showStats = !this.showStats
			this.showPopup = true
		},
		handleSendRepost() {
			const c = this.$refs.repostText as HTMLInputElement
			this.sendRepost(this.$store.state.session.id, this.postCID, c.value, `quote`)
			this.showComments = false
			this.showStats = false
			this.showRepostEditor = false
			this.showPopup = false
			this.$emit(`closePopup`)
			this.$toastSuccess(`Successfully quoted this post`)
		},
		async getQuoteRepost(postCID: string) {
			const content = await this.getRegularPost(postCID)
			const { profile } = await this.getProfile(content.authorID)
			const q = {
				content: content.content,
				timestamp: content.timestamp,
				authorID: content.authorID,
				name: ``,
				avatar: ``,
			}
			if (profile) {
				q.name = profile.name
				if (profile.avatar && profile.avatar !== ``) {
					getPhotoFromIPFS(profile.avatar).then((p) => {
						q.avatar = p
					})
				}
			}
			this.quote = q
		},
	},
})
</script>
