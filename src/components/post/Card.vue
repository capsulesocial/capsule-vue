<template>
	<article
		class="shadow rounded-lg my-2 object-contain"
		style="width: 556px; margin-bottom: 22px; margin-top: 22px; padding: 16px"
		:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'"
	>
		<!-- Top: avatar, name, id, close -->
		<div class="flex w-full">
			<nuxt-link :to="'/' + post.authorID" class="flex">
				<img v-if="avatar !== ``" :src="avatar" class="w-12 h-12 rounded-lg object-cover" />
				<ProfileIcon v-else class="w-12 h-12 border-2 rounded-full" />
			</nuxt-link>
			<div class="flex flex-col flex-grow ml-4">
				<div class="flex">
					<nuxt-link :to="'/' + post.authorID" class="flex mr-4">
						<span
							:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							class="font-medium text-base"
						>
							{{ authorName }}
						</span>
						<span
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="ml-2"
						>
							@{{ post.authorID }}
						</span>
					</nuxt-link>
					<FriendButton
						v-if="post.authorID !== $store.state.session.id && $route.name !== `id`"
						:small="true"
						:following="usersFollowing.has(post.authorID)"
						:toggleFriend="() => toggleFriend(post.authorID)"
					/>
				</div>
				<!-- Timestamp -->
				<div class="text-xs ml-14">
					{{ $formatDate(post.timestamp) }}
				</div>
			</div>
			<span v-if="post.authorID !== $store.state.session.id" class="h-10 flex flex-row-reverse">
				<XIcon />
			</span>
		</div>
		<!-- Content -->
		<div class="my-4">
			<!-- Content -->
			<nuxt-link :to="'/post/' + post._id" class="flex justify-between">
				<div class="flex flex-col pr-4">
					<h3 class="text-lg font-semibold capitalize pb-2">
						{{ post.title }}
					</h3>
					<h6
						v-if="post.subtitle"
						:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					>
						{{ post.subtitle }}
					</h6>
				</div>
				<img v-if="featuredPhoto !== ``" :src="featuredPhoto" class="flex-shrink-0 h-24 object-contain rounded-lg" />
			</nuxt-link>
		</div>
		<!-- Actions -->
		<div class="flex justify-between">
			<div class="flex items-end mt-1">
				<button
					class="flex items-end focus:outline-none mr-2"
					:class="getStyles()"
					@click="showComments = !showComments"
				>
					<CommentIcon :isActive="showComments" />
				</button>
				<Share
					:post="post"
					:cid="post._id"
					:class="$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="fill-primary"
				/>
				<BookmarkButton
					:postID="post._id"
					:class="$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
				/>
			</div>
			<!-- Display tags -->
			<div class="flex flex-row-reverse overflow-x-auto items-end">
				<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="ml-4 my-1" />
			</div>
		</div>
		<PostActions v-if="showComments" :postCID="post._id" :initComments="comments" />
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import PostActions from '@/components/post/Actions.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import Share from '@/components/post/Share.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import TagPill from '@/components/Tag.vue'
import XIcon from '@/components/icons/X.vue'
import FriendButton from '@/components/FriendButton.vue'

import { RetrievedPost } from '@/backend/post'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getProfileFromSession } from '@/store/session'

interface IData {
	showComments: boolean
	authorName: string
	avatar: string
	featuredPhoto: string
}

export default Vue.extend({
	name: `PostCard`,
	components: {
		PostActions,
		ProfileIcon,
		BookmarkButton,
		Share,
		CommentIcon,
		TagPill,
		XIcon,
		FriendButton,
	},
	props: {
		post: {
			type: Object as PropType<RetrievedPost>,
			required: true,
		},
		comments: {
			type: Array as PropType<Comment[] | null>,
			default: null,
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
	},
	data(): IData {
		return {
			showComments: false,
			authorName: ``,
			avatar: ``,
			featuredPhoto: ``,
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
				profile = await getProfile(this.post.authorID)
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
	},
	methods: {
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
	},
})
</script>
