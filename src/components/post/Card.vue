<template>
	<article
		class="shadow rounded-lg my-2 object-contain"
		style="width: 556px; margin-bottom: 22px; margin-top: 22px; padding: 16px"
		:class="
			this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'
		"
	>
		<!-- Post Preview Card -->
		<div class="flex flex-row h-32">
			<!-- Left side -->
			<div class="flex flex-col flex-grow">
				<!-- Top: Name, ID, avatar, timestamp -->
				<div class="w-full flex flex-row">
					<nuxt-link :to="'/' + this.post.authorID">
						<img v-if="this.avatar !== ``" :src="this.avatar" class="w-16 h-16 rounded-lg object-cover" />
						<ProfileIcon v-else class="w-16 h-16 border-2 rounded-full" />
					</nuxt-link>
					<div class="ml-4">
						<!-- Name, ID -->
						<div class="flex flex-row flex-no-wrap">
							<nuxt-link :to="'/' + this.post.authorID">
								<h4
									:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
									class="font-medium text-lg mr-4"
								>
									{{ this.authorName }}
								</h4>
							</nuxt-link>
							<FriendButton v-if="this.post.authorID !== this.$store.state.session.id" :small="true" />
						</div>
						<nuxt-link :to="'/' + this.post.authorID">
							<h5 :class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'">
								@{{ this.post.authorID }}
							</h5>
						</nuxt-link>
						<!-- Timestamp -->
						<h6
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="text-xs"
						>
							{{ this.$formatDate(this.post.timestamp) }}
						</h6>
					</div>
				</div>
				<!-- Bottom: Post Preview title -->
				<nuxt-link :to="'/post/' + this.post._id" class="flex flex-col mt-4" style="width: 350px">
					<h3
						:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="text-lg font-semibold capitalize truncate"
					>
						{{ this.post.title }}
					</h3>
					<h6 class="text-base text-lightSecondaryText truncate">
						This is placeholder text for the subtitle even if it is very long
					</h6>
				</nuxt-link>
			</div>
			<!-- Right side: Featured Photo -->
			<div class="flex flex-col w-32 h-32">
				<div v-if="this.post.authorID !== this.$store.state.session.id" class="h-10 flex flex-row-reverse">
					<XIcon />
				</div>
				<nuxt-link :to="'/post/' + this.post._id" class="flex">
					<img
						v-if="this.featuredPhoto !== ``"
						:src="this.featuredPhoto"
						class="w-full h-24 object-contain rounded-lg"
					/>
				</nuxt-link>
			</div>
		</div>
		<!-- Actions -->
		<div class="flex justify-between mt-2">
			<div class="flex items-end pt-4 mt-1">
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
