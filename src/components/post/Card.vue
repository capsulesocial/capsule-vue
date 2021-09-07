<template>
	<article
		class="shadow rounded-lg my-2 p-5 object-contain"
		style="width: 512px; margin-bottom: 22px; margin-top: 22px"
		:class="
			this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText border border-darkBorder'
		"
	>
		<!-- Post Preview Header: Avatar, name -->
		<div class="flex justify-between">
			<nuxt-link :to="'/' + this.post.authorID" class="flex items-center">
				<img v-if="this.avatar !== ``" :src="this.avatar" class="w-12 h-12 rounded-lg object-cover" />
				<ProfileIcon v-else class="w-12 h-12 border-2 rounded-full" />
				<div class="ml-4">
					<!-- Name, ID -->
					<div class="flex items-center">
						<h4
							:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
							class="text-bold mr-2 text-lg"
						>
							{{ this.authorName }}
						</h4>
						<h5
							:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="mr-2"
						>
							@{{ this.post.authorID }}
						</h5>
					</div>
					<!-- Timestamp -->
					<h6
						:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="text-xs mb-2"
					>
						{{ this.$formatDate(this.post.timestamp) }}
					</h6>
				</div>
			</nuxt-link>
			<button
				:class="
					this.$store.state.settings.darkMode
						? 'text-lightPrimaryText hover:text-lightActive '
						: 'text-darkPrimaryText hover:text-darkActive'
				"
				class="focus:outline-none self-start"
			>
				<XIcon />
			</button>
		</div>

		<!-- Preview Content -->
		<div class="my-2">
			<nuxt-link :to="'/post/' + this.post._id" class="flex justify-between">
				<div class="h-24">
					<h3
						:class="this.$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="text-base font-bold capitalize"
					>
						{{ this.post.title }}
					</h3>
				</div>
				<div class="ml-2">
					<img
						v-if="this.featuredPhoto !== ``"
						:src="this.featuredPhoto"
						class="w-32 h-24 rounded object-cover object-top"
					/>
				</div>
			</nuxt-link>
		</div>

		<!-- Actions -->
		<div class="pt-2 flex justify-between">
			<div class="flex">
				<button
					class="flex focus:outline-none self-center mr-2"
					:class="this.getStyles()"
					@click="showComments = !showComments"
				>
					<CommentIcon class="fill-primary" />
				</button>
				<Share
					:post="this.post"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="fill-primary self-center z-10"
				/>
				<BookmarkButton
					:postID="this.post.cid"
					:class="this.$store.state.settings.darkMode ? 'fill-lightActive' : 'fill-darkActive'"
					class="self-center"
				/>
			</div>
			<!-- Display tags -->
			<div class="flex flex-row-reverse overflow-x-auto">
				<TagPill v-for="t in this.post.tags" :key="t.name" :tag="t.name" />
			</div>
		</div>
		<PostActions v-show="this.showComments" :post="this.post" />
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PostActions from '@/components/post/Actions.vue'
import XIcon from '@/components/icons/X.vue'
import ProfileIcon from '@/components/icons/Person.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import Share from '@/components/post/Share.vue'
import CommentIcon from '@/components/icons/Comment.vue'
import TagPill from '@/components/Tag.vue'
import { Post } from '@/interfaces/Post'

export default Vue.extend({
	name: `PostCard`,
	components: {
		PostActions,
		XIcon,
		ProfileIcon,
		BookmarkButton,
		Share,
		CommentIcon,
		TagPill,
	},
	props: {
		post: {
			type: Object as () => Post,
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
		let authorCID = ``
		if (this.$store.state.session.id === this.$props.post.authorID) {
			// Viewing own post
			this.authorName = this.$store.state.session.name
			authorCID = this.$store.state.session.cid
		} else {
			// Viewing someone else's post
			const nearProfile = await this.$getProfileNEAR(this.$props.post.authorID)
			if (!nearProfile.success) {
				throw new Error(`Could not get profile from near ${this.$props.post.authorID}`)
			}
			authorCID = nearProfile.profileCID
		}
		const profile = await this.$getProfile(authorCID)
		// Populate Avatar
		this.authorName = profile.name
		this.authorID = profile.id
		if (profile.avatar !== ``) {
			this.avatar = await this.$getPhoto(profile.avatar)
		}
		// Populate Featured Photo
		if (this.post.featuredPhotoCID) {
			this.featuredPhoto = await this.$getPhoto(this.post.featuredPhotoCID)
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
