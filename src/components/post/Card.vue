<template>
	<article v-if="!postDeleted" class="object-contain z-auto">
		<!-- popup backdrop -->
		<div
			:class="
				showComments
					? `fixed w-full h-screen bg-primary top-0 bottom-0 left-0 right-0 z-30 flex justify-center items-center bg-opacity-50`
					: ``
			"
		>
			<div
				class="card"
				:class="
					showComments
						? `shadow-lg rounded-lg bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg mt-10 overflow-y-auto`
						: ``
				"
				:style="showComments ? `width: 750px; backdrop-filter: blur(10px); max-height: 90vh` : ``"
				style="backdrop-filter: blur(10px)"
			>
				<div
					class="sticky top-0 z-10 pb-5 border-b bg-gradient-to-r from-lightBGStart to-lightBGStop px-6 pt-5"
					style="backdrop-filter: blur(10px)"
				>
					<!-- IF reposted -->
					<div v-if="repostedBy !== `` && !hideRepostIcon" class="flex w-full -mt-2 mb-2 text-gray5">
						<RepostIcon :shrink="true" />
						<p class="pl-2 text-sm text-gray5">
							<nuxt-link :to="`/` + repostedBy">{{ repostedBy }} </nuxt-link>
							reposted
						</p>
					</div>
					<!-- Top: avatar, name, id, close -->
					<div class="flex w-full">
						<Avatar :avatar="avatar" :authorID="post.authorID" size="w-12 h-12" />
						<div class="flex flex-col flex-grow ml-4">
							<div class="flex" @mouseover="showFriendButton = true" @mouseleave="showFriendButton = false">
								<nuxt-link :to="'/' + post.authorID" class="flex mr-4">
									<span class="font-medium text-base">
										{{ authorName }}
									</span>
									<span class="ml-2 text-primary"> @{{ post.authorID }} </span>
								</nuxt-link>
								<span v-show="showFriendButton">
									<FriendButton
										v-if="post.authorID !== $store.state.session.id && $route.name !== `id`"
										:small="true"
										:userIsFollowed="usersFollowing.has(post.authorID)"
										:toggleFriend="() => toggleFriend(post.authorID)"
									/>
								</span>
							</div>
							<!-- Timestamp -->
							<div class="text-xs ml-14">
								{{ $formatDate(post.timestamp) }}
							</div>
						</div>
						<div class="flex items-center" :class="repostedBy !== `` ? `-mt-4` : ``">
							<BookmarkButton :postID="post._id" :hasBookmark="isBookmarked" @clicked="getBookmarkStatus" />
							<button
								v-if="post.authorID === $store.state.session.id"
								class="focus:outline-none ml-2"
								@click.stop="toggleDropdownDelete"
							>
								<More />
							</button>
							<div
								v-show="showDelete"
								:class="
									$store.state.settings.darkMode
										? 'bg-lightBG text-lightPrimaryText border-lightBorder'
										: 'bg-darkBG text-darkPrimaryText border-darkBorder'
								"
								class="absolute flex flex-col rounded-lg w-40 shadow-lg z-10 p-1"
								style="top: 70px; right: 10px"
							>
								<!-- Delete -->
								<button class="flex focus:outline-none text-negative" @click="deletePost">
									<XIcon class="p-1" />
									<span class="text-xs self-center text-negative">Delete this post</span>
								</button>
							</div>
						</div>
					</div>
					<!-- Content -->
					<div class="mt-4 flex justify-between">
						<!-- Left side: Title, subtitle / preview, tags -->
						<div class="mr-4">
							<nuxt-link :to="'/post/' + post._id">
								<div class="flex flex-col pr-4 max-w-full overflow-hidden">
									<h3 class="text-lg font-semibold pb-2 break-words">
										{{ post.title }}
									</h3>
									<h6
										v-if="post.subtitle || post.excerpt"
										:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
										class="break-words"
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
							<div class="flex mt-1 text-gray5">
								<button
									class="flex items-end focus:outline-none mr-2 text-gray5 hover:text-primary hover:fill-primary"
									:class="showComments ? `text-primary` : ``"
									@click="showComments = !showComments"
								>
									<CommentIcon :isActive="showComments" />
									<span v-if="comments" class="ml-1">{{ comments.length }}</span>
								</button>
								<Share
									:repost="repost"
									:post="post"
									:cid="post._id"
									class="fill-primary"
									:hasRepost="hasReposted"
									:repostCount="repostCount"
								/>
							</div>
						</div>
						<!-- Right side: Image -->
						<div class="flex-shrink-0 w-56">
							<nuxt-link :to="'/post/' + post._id">
								<img
									v-if="featuredPhoto !== ``"
									:src="featuredPhoto"
									class="flex-shrink-0 h-32 object-cover rounded-lg w-full"
								/>
							</nuxt-link>
						</div>
					</div>
				</div>
				<PostActions v-if="showComments" :postCID="post._id" :initComments="comments" class="px-6 pb-6" />
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

import { RetrievedPost } from '@/backend/post'
import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'
import { isPostBookmarkedByUser } from '@/backend/bookmarks'
import { sendPostDeletion } from '@/backend/postDeletion'
import { IRepost } from '@/backend/reposts'
import { ICommentData } from '@/backend/comment'

interface IData {
	showComments: boolean
	showDelete: boolean
	authorName: string
	avatar: string
	featuredPhoto: string
	isBookmarked: boolean
	postDeleted: boolean
	showFriendButton: boolean
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
		FriendButton,
		RepostIcon,
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
		repostCount: {
			type: Number,
			default: 0,
		},
		bookmarksCount: {
			type: Number,
			default: 0,
		},
	},
	data(): IData {
		return {
			showComments: false,
			showDelete: false,
			authorName: ``,
			avatar: ``,
			featuredPhoto: ``,
			isBookmarked: false,
			postDeleted: false,
			showFriendButton: false,
		}
	},
	async created() {
		let profile = this.profile
		if (!profile) {
			if (this.$store.state.session.id === this.post.authorID) {
				// Viewing own post
				profile = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				profile = createDefaultProfile(this.post.authorID)
				const fetchedProfile = await getProfile(this.post.authorID)
				if (fetchedProfile) {
					profile = fetchedProfile
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
		this.isBookmarked = this.$props.bookmarked
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
		async deletePost() {
			await sendPostDeletion(`HIDE`, this.post._id, this.$store.state.session.id)
			this.postDeleted = true
			this.$toastSuccess(`Post successfully deleted`)
		},
		async getBookmarkStatus() {
			this.isBookmarked = await isPostBookmarkedByUser(this.post._id, this.$store.state.session.id)
		},
		hasReposted(): boolean {
			if (this.$store.state.session.id === this.$props.repostedBy || this.$store.getters.checkReposts(this.post._id)) {
				return true
			}
			return false
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
			}
		},
		toggleDropdownDelete() {
			this.showDelete = !this.showDelete
		},
	},
})
</script>
