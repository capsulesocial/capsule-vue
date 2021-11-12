<template>
	<article v-if="!postDeleted" class="py-5 mx-5 border-b object-contain z-auto">
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
				:class="showComments ? `shadow rounded-lg p-5 bg-white mt-10 max-h-screen overflow-y-auto` : ``"
				:style="showComments ? `width: 750px` : ``"
			>
				<div class="sticky top-0 z-10">
					<!-- IF reposted -->
					<div v-if="repostedBy !== `` && !hideRepostIcon" class="flex w-full -mt-2">
						<RepostIcon :shrink="true" />
						<p class="pl-2 italic text-sm">
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
							<button v-if="post.authorID === $store.state.session.id" @click="deletePost">
								<XIcon />
							</button>
						</div>
					</div>
					<!-- Content -->
					<div class="mt-4 flex justify-between">
						<!-- Left side: Title, subtitle / preview, tags -->
						<div>
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
								<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="mr-4" />
							</div>
							<!-- Comment and share -->
							<div class="flex mt-1">
								<button
									class="flex items-end focus:outline-none mr-2"
									:class="getStyles()"
									@click="showComments = !showComments"
								>
									<CommentIcon :isActive="showComments" />
									<span v-if="comments" class="ml-1">{{ comments.length }}</span>
								</button>
								<Share
									:post="post"
									:cid="post._id"
									class="fill-primary"
									:hasRepost="hasReposted"
									:repostCount="repostCount"
								/>
							</div>
						</div>
						<!-- Right side: Image -->
						<div class="flex-shrink-0">
							<nuxt-link :to="'/post/' + post._id">
								<img
									v-if="featuredPhoto !== ``"
									:src="featuredPhoto"
									class="flex-shrink-0 h-32 object-contain rounded-lg"
								/>
							</nuxt-link>
						</div>
					</div>
				</div>
				<PostActions v-if="showComments" :postCID="post._id" :initComments="comments" class="px-5" />
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
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleClose)
	},
	methods: {
		isPostBookmarkedByUser,
		async deletePost() {
			await sendPostDeletion(`HIDE`, this.post._id, this.$store.state.session.id)
			this.postDeleted = true
		},
		async getBookmarkStatus() {
			this.isBookmarked = await isPostBookmarkedByUser(this.post._id, this.$store.state.session.id)
		},
		hasReposted(): boolean {
			if (this.$store.state.session.id === this.$props.repostedBy) {
				return true
			} else {
				return false
			}
		},
		getStyles(): string {
			let res = ``
			if (this.showComments && this.$store.state.settings.darkMode) {
				res += `text-lightActive`
			} else if (this.showComments && !this.$store.state.settings.darkMode) {
				res += `text-darkActive`
			} else if (!this.showComments && this.$store.state.settings.darkMode) {
				res += `hover:text-lightActive`
			} else if (!this.showComments && !this.$store.state.settings.darkMode) {
				res += `hover:text-darkActive`
			}
			return res
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
	},
})
</script>
