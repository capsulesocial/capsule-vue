<template>
	<main
		class="w-full flex flex-col items-center bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
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
		<Header :avatar="avatar" class="lg:w-11/12 xl:w-10/12 max-w-1220 my-5 fixed top-0" />
		<div class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 mt-20 relative">
			<div
				class="w-full lg:w-760 absolute min-h-70 h-70 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
			></div>
		</div>

		<!-- Main content scroll -->
		<div ref="container" class="flex w-full overflow-y-auto overflow-x-hidden justify-center">
			<!-- Content container -->
			<div class="flex w-full lg:w-11/12 xl:w-10/12 relative flex-row justify-between max-w-1220">
				<!-- Title and peered nodes -->
				<!-- <div
					class="modal-animation hidden lg:flex w-full items-center justify-between px-3 lg:px-0"
					style="height: 62px"
				>
					<h1 v-if="profile" class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">
						Hello, {{ profile.name }}
					</h1>
					<h1 v-else class="text-lightSecondaryText dark:text-gray1 text-3xl font-semibold xl:text-4xl">Hello!</h1>
					<Nodes />
				</div> -->
				<!-- Content container -->
				<section class="w-full lg:w-11/12 xl:w-10/12 max-w-1220 relative h-full flex flex-row justify-between">
					<PostEditor
						v-if="$store.state.widgets.primary === `editor` && $route.name === `home`"
						ref="editor"
						class="w-full lg:w-760 lg:flex-shrink-0 p-6"
					/>
					<nuxt-child
						v-else
						ref="childPage"
						class="w-full lg:w-760 lg:flex-shrink-0 p-6"
						:class="showWidgets ? `` : `z-10`"
						:toggleFriend="toggleFriend"
						:following="following"
						:followers="followers"
						@updateBookmarks="fetchBookmarks"
						@scrollToTop="scrollToTop"
					/>
				</section>
			</div>
			<!-- Widgets -->
			<aside class="fixed w-full flex justify-center top-20" :class="showWidgets ? `z-10` : ``">
				<div class="w-full hidden lg:flex flex-row-reverse justify-between lg:w-11/12 xl:w-10/12 max-w-1220 relative">
					<div
						style="left: 760px; right: 0px"
						class="shrink ml-5 absolute max-w-500 h-screen overflow-y-auto p-5 pb-24"
					>
						<Widgets
							:followers="followers"
							:updateFollowers="updateFollowers"
							@overlay="toggleZIndex"
							@saveDraft="saveDraftState"
							@openFollowers="showFollowers = true"
						/>
						<Footer />
					</div>
				</div>
			</aside>
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
// import Nodes from '@/components/Nodes.vue'
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
		// Nodes,
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
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
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
		// scroll event listener
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
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
		handleScroll(e: Event) {
			const { scrollTop, scrollHeight, clientHeight } = e.srcElement as HTMLElement
			if (scrollTop + clientHeight >= scrollHeight - 5) {
				// @ts-ignore
				this.$refs.childPage.loadPosts()
			}
		},
		scrollToTop(): void {
			const container = this.$refs.container as HTMLElement
			container.scrollTo({ top: 0, behavior: `smooth` })
		},
	},
})
</script>

<style scoped>
/* Hide scrollbar for Chrome, Safari and Opera */
aside::-webkit-scrollbar {
	display: none;
}

/* Hide scrollbar for IE, Edge and Firefox */
aside {
	-ms-overflow-style: none; /* IE and Edge */
	scrollbar-width: none; /* Firefox */
}
</style>
