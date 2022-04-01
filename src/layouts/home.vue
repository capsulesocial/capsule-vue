<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG overscroll-none"
		:style="
			$colorMode.dark
				? {
						backgroundImage: `url(` + bgImage.dark + `)`,
				  }
				: {
						backgroundImage: `url(` + bgImage.light + `)`,
				  }
		"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex w-full lg:w-11/12 xl:w-10/12 flex-col max-w-1220">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<!-- Title and peered nodes -->
				<div
					class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0"
					style="height: 62px"
				>
					<!-- Title -->
					<h1 v-if="profile" class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">
						Hello, {{ profile.name }}
					</h1>
					<h1 v-else class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">Hello!</h1>
					<Nodes />
				</div>
				<!-- Content -->
				<section class="relative flex flex-row lg:mt-2 xl:mt-5 overscroll-none">
					<PostEditor
						v-if="$store.state.widgets.primary === `editor` && $route.name === `home`"
						ref="editor"
						style="min-height: calc(100vh - 150px); height: calc(100vh - 150px); backdrop-filter: blur(10px)"
						class="lg:w-7.5 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop modal-animation overflow-y-auto overflow-x-hidden rounded-lg bg-gradient-to-r p-6 shadow-lg"
					/>
					<nuxt-child
						v-else
						class="lg:w-7.5 min-h-61 h-61 xl:min-h-120 xl:h-120 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder border modal-animation box-border w-full overflow-y-auto rounded-lg bg-gradient-to-r shadow-lg"
						:class="showWidgets ? `` : `z-10`"
						:toggleFriend="toggleFriend"
						:following="following"
						:followers="followers"
						@updateBookmarks="fetchBookmarks"
					/>
					<!-- Widgets -->
					<aside
						class="w-5/12 -mr-5 modal-animation -mt-4 hidden overflow-y-auto p-4 lg:block"
						:class="showWidgets ? `z-10` : ``"
						style="min-height: calc(100vh - 150px); height: calc(100vh - 150px)"
					>
						<Widgets
							:followers="followers"
							:updateFollowers="updateFollowers"
							@overlay="toggleZIndex"
							@saveDraft="saveDraftState"
							@openFollowers="showFollowers = true"
						/>
						<Footer />
					</aside>
				</section>
			</div>
		</div>
		<FollowersPopup
			v-if="showFollowers"
			:profile="profile"
			:followers="followers"
			:updateFollowers="updateFollowers"
			@close="showFollowers = false"
		/>
		<!-- Onboarding Wizard -->
		<OnboardingWizard v-if="$store.state.recentlyJoined" />
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Widgets from '@/components/Widgets.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import FollowersPopup from '@/components/popups/FollowersPopup.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'

import { IBackground, backgrounds } from '@/config'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { IPostResponse } from '@/backend/post'
import { getBookmarksOfUser } from '@/backend/bookmarks'

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
	bgImage: IBackground
	showFollowers: boolean
}

export default Vue.extend({
	components: {
		Widgets,
		Header,
		Footer,
		PostEditor: () => import(`@/components/post/Editor.vue`),
		Nodes,
		OnboardingWizard: () => import(`@/components/popups/OnboardingWizard.vue`),
		UnauthPopup,
		FollowersPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
			following: new Set(),
			followers: new Set(),
			bgImage: backgrounds[0],
			showFollowers: false,
		}
	},
	created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
	},
	async mounted() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background, `local`)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
		// Get followers and following
		this.fetchConnections()
		// Get recent bookmarks
		this.fetchBookmarks()
	},
	methods: {
		async fetchConnections() {
			const { followers, following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
			this.following = following
			this.followers = followers
		},
		async fetchBookmarks() {
			let bookmarks = await getBookmarksOfUser(this.$store.state.session.id)
			bookmarks = bookmarks.reverse().slice(0, 2)
			const bookmarkPreviews = bookmarks.map(async (p: IPostResponse) => {
				const post: PostPreview = {
					title: p.post.title,
					authorID: p.post.authorID,
					featuredPhoto: null,
					postCID: p.post._id,
				}
				if (p.post.featuredPhotoCID) {
					post.featuredPhoto = await getPhotoFromIPFS(p.post.featuredPhotoCID)
				}
				return post
			})
			this.$store.commit(`setRecentBookmarks`, await Promise.all(bookmarkPreviews))
		},
		async toggleFriend(authorID: string) {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			if (authorID !== this.$store.state.session.id) {
				try {
					await followChange(
						this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`,
						this.$store.state.session.id,
						authorID,
					)
					const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
					this.following = data.following
					this.fetchConnections()
					this.updateFollowers()
					this.$toastSuccess(this.following.has(authorID) ? `Followed ${authorID}` : `Unfollowed ${authorID}`)
				} catch (err: unknown) {
					this.$handleError(err)
				}
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
				const editor = this.$refs.editor as any
				editor.saveContent()
			}
		},
	},
})
</script>
