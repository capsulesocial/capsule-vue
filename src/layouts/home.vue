<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10 pb-4">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div
						class="fixed w-full flex justify-between items-center modal-animation"
						style="width: 1220px; height: 62px"
					>
						<!-- Title -->
						<h1 v-if="profile" class="font-semibold text-primary" style="font-size: 2.6rem">
							Hello, {{ profile.name }}
						</h1>
						<h1 v-else class="font-semibold text-primary" style="font-size: 2.6rem">Hello,</h1>
						<Nodes />
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20 relative">
						<PostEditor
							v-if="$store.state.widgets.primary === `editor` && $route.name === `home`"
							ref="editor"
							style="
								width: 750px;
								min-height: calc(100vh - 150px);
								height: calc(100vh - 150px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-lg shadow-lg p-6 bg-gradient-to-r from-lightBGStart to-lightBGStop modal-animation"
						/>
						<nuxt-child
							v-else
							style="width: 750px; min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 bg-gradient-to-r from-lightBGStart to-lightBGStop modal-animation"
							:class="showWidgets ? `` : `z-10`"
							:toggleFriend="toggleFriend"
							:following="following"
							:followers="followers"
							:userIsFollowed="userIsFollowed"
							@updateBookmarks="fetchBookmarks"
						/>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4 modal-animation"
							:class="showWidgets ? `z-10` : ``"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
						>
							<Widgets
								:followers="followers"
								:updateFollowers="updateFollowers"
								@overlay="toggleZIndex"
								@saveDraft="saveDraftState"
							/>
							<Footer />
						</aside>
					</section>
				</div>
			</div>
		</div>
		<!-- Onboarding Wizard -->
		<OnboardingWizard v-if="$store.state.recentlyJoined" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Widgets from '@/components/Widgets.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PostEditor from '@/components/post/Editor.vue'
import OnboardingWizard from '@/components/OnboardingWizard.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IPostResponse, getPosts } from '@/backend/post'

interface PostPreview {
	title: string
	authorID: string
	featuredPhoto: string | null
	postCID: string
}

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showWidgets: boolean
	following: Set<string>
	followers: Set<string>
	userIsFollowed: boolean
}

export default Vue.extend({
	components: {
		Widgets,
		Header,
		Footer,
		PostEditor,
		Nodes,
		OnboardingWizard,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
			following: new Set(),
			followers: new Set(),
			userIsFollowed: false,
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Get followers and following
		const { followers, following } = await getFollowersAndFollowing(this.$store.state.session.id)
		this.following = following
		this.followers = followers
		this.userIsFollowed = followers.has(this.$store.state.session.id)
		// Get recent bookmarks
		this.fetchBookmarks()
	},
	methods: {
		async fetchBookmarks() {
			const bookmarkPreviews = new Set<PostPreview>()
			let bookmarks = await getPosts({ bookmarkedBy: this.$store.state.session.id }, this.$store.state.session.id, {})
			bookmarks = bookmarks.reverse().slice(0, 2)
			bookmarks.forEach((p: IPostResponse) => {
				if (p.post.featuredPhotoCID) {
					getPhotoFromIPFS(p.post.featuredPhotoCID).then((res) => {
						const post = { title: p.post.title, authorID: p.post.authorID, featuredPhoto: res, postCID: p.post._id }
						bookmarkPreviews.add(post)
					})
				} else {
					const post = { title: p.post.title, authorID: p.post.authorID, featuredPhoto: null, postCID: p.post._id }
					bookmarkPreviews.add(post)
				}
			})
			this.$store.commit(`setRecentBookmarks`, bookmarkPreviews)
		},
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
			this.followers = followers
			this.following = following
		},
		toggleZIndex() {
			this.showWidgets = !this.showWidgets
		},
		saveDraftState(): void {
			if (this.$refs.editor) {
				// @ts-ignore
				this.$refs.editor.saveContent()
			}
		},
	},
})
</script>

<style>
.bg-img {
	background-attachment: fixed;
	background-size: cover;
}
</style>
