<template>
	<article
		class="shadow rounded-lg my-2 object-contain"
		style="width: 556px; margin-bottom: 22px; margin-top: 22px; padding: 16px"
		:class="
			this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'
		"
	>
		<!-- Top: avatar, name, id, close -->
		<div class="flex w-full">
			<nuxt-link :to="'/' + this.post.authorID" class="flex">
				<img v-if="this.avatar !== ``" :src="this.avatar" class="w-12 h-12 rounded-lg object-cover" />
				<ProfileIcon v-else class="w-12 h-12 border-2 rounded-full" />
			</nuxt-link>
			<div class="flex flex-col flex-grow ml-4">
				<div class="flex">
					<nuxt-link :to="'/' + this.post.authorID" class="flex mr-4">
						<span
							:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							class="font-medium text-base"
						>
							{{ this.authorName }}
						</span>
						<span
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="ml-2"
						>
							@{{ this.post.authorID }}
						</span>
					</nuxt-link>
					<FriendButton
						v-if="this.post.authorID !== this.$store.state.session.id"
						:small="true"
						:authorID="this.post.authorID"
					/>
				</div>
				<!-- Timestamp -->
				<div class="text-xs ml-14">
					{{ this.$formatDate(this.post.timestamp) }}
				</div>
			</div>
			<span v-if="this.post.authorID !== this.$store.state.session.id" class="h-10 flex flex-row-reverse">
				<XIcon />
			</span>
		</div>
		<!-- Content -->
		<div class="my-4">
			<!-- Content -->
			<nuxt-link :to="'/post/' + this.post._id" class="flex justify-between">
				<div class="flex flex-col pr-4">
					<h3 class="text-lg font-semibold capitalize pb-2">
						{{ this.post.title }}
					</h3>
					<h6
						v-if="this.post.subtitle"
						:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					>
						{{ this.post.subtitle }}
					</h6>
				</div>
				<img
					v-if="this.featuredPhoto !== ``"
					:src="this.featuredPhoto"
					class="flex-shrink-0 h-24 object-contain rounded-lg"
				/>
			</nuxt-link>
		</div>
		<!-- Actions -->
		<div class="flex justify-between">
			<div class="flex items-end mt-1">
				<button
					class="flex items-end focus:outline-none mr-2"
					:class="this.getStyles()"
					@click="showComments = !showComments"
				>
					<CommentIcon :isActive="this.showComments" />
				</button>
				<Share
					:post="post"
					:cid="$props.post._id"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="fill-primary"
				/>
				<BookmarkButton
					:postID="$props.post._id"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
				/>
			</div>
			<!-- Display tags -->
			<div class="flex flex-row-reverse overflow-x-auto items-end">
				<TagPill v-for="t in post.tags" :key="t.name" :tag="t.name" class="ml-4 my-1" />
			</div>
		</div>
		<PostActions v-if="showComments" :postCID="$props.post._id" :initComments="$props.comments" />
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
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
			type: Object as () => RetrievedPost,
			default: null,
		},
		comments: {
			type: Array as () => Comment[] | null,
			default: null,
		},
		profile: {
			type: Object as () => Profile,
			default: null,
		},
	},
	data() {
		return {
			showComments: false,
			authorName: ``,
			authorID: ``,
			avatar: ``,
			featuredPhoto: ``,
		}
	},
	async created() {
		let profile = this.$props.profile
		if (!profile) {
			if (this.$store.state.session.id === this.$props.post.authorID) {
				// Viewing own post
				profile = getProfileFromSession(this.$store.state.session)
			} else {
				// Viewing someone else's post
				profile = await getProfile(this.$props.post.authorID)
			}
		}

		// Populate Avatar
		this.authorName = profile.name
		this.authorID = profile.id
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
