<template>
	<div v-if="post && author" class="w-full">
		<HeaderMagic
			:authorID="post.authorID"
			:avatar="authorAvatar"
			:toggleFriend="toggleFriend"
			:userIsFollowed="userIsFollowed"
		/>
		<section v-if="post !== null" class="pb-16 md:pb-5 md:pl-5 my-5 pt-4">
			<!-- Category and elipses -->
			<article class="w-full flex justify-between my-2">
				<div class="text-lg">
					Category |
					<span v-if="!post.category" class="text-lightSecondaryText"> None</span>
					<nuxt-link :to="`/discover/` + post.category" class="text-primary capitalize">{{ post.category }}</nuxt-link>
				</div>
				<MoreIcon />
			</article>
			<article>
				<h1
					:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
					class="text-h1 font-serif font-semibold mt-5 mb-3 capitalize break-words"
				>
					{{ post.title }}
				</h1>
				<h2
					v-if="post.subtitle"
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="text-h2 font-serif font-medium mt-5 mb-3 capitalize break-words"
				>
					{{ post.subtitle }}
				</h2>
			</article>

			<!-- Author Intro -->
			<article class="flex justify-between mt-5">
				<div class="flex">
					<Avatar :avatar="authorAvatar" :authorID="author.id" :size="`w-10 h-10`" class="mr-4" />
					<p
						:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						class="font-sans capitalize"
					>
						<nuxt-link
							:to="'/' + author.id"
							:class="$store.state.settings.darkMode ? 'text-lightActive' : 'text-darkActive'"
							class="underline"
						>
							{{ author.name }}
						</nuxt-link>
						<span
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="font-sans text-sm block"
						>
							{{ $formatDate(post.timestamp) }}
						</span>
					</p>
				</div>
			</article>

			<!-- Featured Photo -->
			<article v-if="featuredPhoto !== null" class="my-5 flex justify-center">
				<img
					v-if="featuredPhoto !== null"
					:src="featuredPhoto"
					class="border-neutralLightest border-2 rounded h-64 shadow"
				/>
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
						<BookmarkButton :hasBookmark="hasBookmarked" :postID="$route.params.post" />
						<ShareButton :post="post" :cid="$route.params.post" :class="'z-20'" :hasRepost="hasReposted" />
					</div>
				</div>
				<PostActions :postCID="$route.params.post" :authorID="author.id" :isCommenting="true" :tags="post.tags" />
			</article>
		</section>
		<section v-else>Post not found 😵‍💫</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
// import markdown from '@/mixins/markdown.ts'
// @ts-ignore
import marked from 'marked'
import PostActions from '@/components/post/Actions.vue'
import AuthorCard from '@/components/AuthorCard.vue'
import TagCard from '@/components/Tag.vue'
import BookmarkButton from '@/components/post/BookmarkButton.vue'
import ShareButton from '@/components/post/Share.vue'
import HeaderMagic from '@/components/HeaderMagic.vue'
import MoreIcon from '@/components/icons/More.vue'
import Avatar from '@/components/Avatar.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPost, Post } from '@/backend/post'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { getReposts } from '@/backend/reposts'
import { getBookmarks } from '@/backend/bookmarks'

interface IData {
	post: Post | null
	author: Profile | null
	authorAvatar: string | ArrayBuffer | null
	content: string
	featuredPhoto: null | string
	showFilter: boolean
	userIsFollowed: boolean
	myReposts: string[]
	myBookmarks: string[]
}

export default Vue.extend({
	components: {
		PostActions,
		AuthorCard,
		TagCard,
		BookmarkButton,
		ShareButton,
		HeaderMagic,
		MoreIcon,
		Avatar,
	},
	layout: `Reader`,
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
			myBookmarks: [],
		}
	},
	async created() {
		// Fetch post from IPFS,
		this.post = await getPost(this.$route.params.post)
		if (this.post === null) {
			throw new Error(`Post is null!`)
		}
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
		this.content = marked(this.post.content)
		// Get author profile
		this.author = await getProfile(this.post.authorID)
		if (this.author && this.author.avatar.length > 1) {
			getPhotoFromIPFS(this.author.avatar).then((p) => {
				this.authorAvatar = p
			})
		}
		// Get reposts
		const repostData = await getReposts(this.$store.state.session.id)
		repostData.forEach((p) => {
			// @ts-ignore
			this.myReposts.push(p.repost.postCID)
		})

		// Get bookmarks
		const bList = await getBookmarks({ authorID: this.$store.state.session.id })
		bList.forEach((b: { authorID: string; postCID: string; timestamp: Date }) => {
			this.myBookmarks.push(b.postCID)
		})
		// Set filter dropdown event handler
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
					this.showFilter = false
				}
			},
			false,
		)
	},
	methods: {
		getReposts,
		getBookmarks,
		hasReposted(): boolean {
			if (this.myReposts.includes(this.$route.params.post)) {
				return true
			}
			return false
		},
		hasBookmarked(): boolean {
			if (this.myBookmarks.includes(this.$route.params.post)) {
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
</style>
