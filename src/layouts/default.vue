<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/settings.jpg`)})` }"
	>
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
					<div class="fixed w-full flex justify-between items-center" style="width: 1220px; height: 62px">
						<!-- Title -->
						<h1 v-if="profile" class="font-semibold text-primary" style="font-size: 2.6rem">
							Hello, {{ profile.name }}
						</h1>
						<Nodes />
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20">
						<PostEditor
							v-if="$store.state.widgets.primary === `editor` && $route.name === `home`"
							ref="editor"
							style="
								width: 750px;
								min-height: calc(100vh - 160px);
								height: calc(100vh - 160px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-lg shadow-lg p-6 bg-gradient-to-r from-lightBGStart to-lightBGStop"
						/>
						<nuxt-child
							v-else
							style="
								width: 750px;
								min-height: calc(100vh - 160px);
								height: calc(100vh - 160px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 bg-gradient-to-r from-lightBGStart to-lightBGStop"
							:class="showWidgets ? `` : `z-10`"
							:toggleFriend="toggleFriend"
							:following="following"
							:followers="followers"
							:updateFollowers="updateFollowers"
							:userIsFollowed="userIsFollowed"
						/>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4"
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
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Nodes from '@/components/Nodes.vue'
import Widgets from '@/components/Widgets.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PostEditor from '@/components/post/Editor.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

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
		this.profile = await getProfile(this.$store.state.session.id)
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
	},
	methods: {
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id, true)
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