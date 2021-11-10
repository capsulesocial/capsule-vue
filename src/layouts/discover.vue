<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/mainBG.png`)})` }"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div class="fixed w-full flex justify-between items-center" style="width: 1220px; height: 62px">
						<!-- Title -->
						<h1 class="font-semibold text-primary" style="font-size: 2.6rem">
							{{ getTitle() }}
						</h1>
						<!-- Peered nodes -->
						<div class="flex items-center bg-gray1 px-3 rounded-lg">
							<span class="text-sm mr-1 text-gray5">n peered nodes</span>
							<CapsuleIcon />
							<span class="bg-connectGreen rounded-xl w-3 h-3"></span>
						</div>
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20">
						<PostEditor
							v-if="$store.state.widgets.primary === `editor` && $route.name === `home`"
							style="width: 750px"
							class="
								fixed
								overflow-y-auto
								rounded-lg
								shadow-lg
								p-6
								bg-gradient-to-r
								from-lightBGStart
								to-lightBGStop
								backdrop-filter backdrop-blur-lg
							"
						/>
						<nuxt-child
							v-else
							style="width: 750px; min-height: calc(100vh - 160px); height: calc(100vh - 160px)"
							class="
								fixed
								overflow-y-auto
								rounded-lg
								shadow-lg
								mr-5
								p-6
								bg-gradient-to-r
								from-lightBGStart
								to-lightBGStop
								backdrop-filter backdrop-blur-lg
							"
							:class="showWidgets ? `` : `z-10`"
							:toggleFriend="toggleFriend"
							:following="following"
						/>
						<!-- Widgets -->
						<aside class="fixed" :class="showWidgets ? `z-10` : ``" style="margin-left: 770px; width: 450px">
							<TagsWidget
								class="
									rounded-lg
									shadow-lg
									bg-gradient-to-r
									from-lightBGStart
									to-lightBGStop
									backdrop-filter backdrop-blur-lg
									border border-lightBorder
									overflow-hidden
									mb-5
								"
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
import CapsuleIcon from '@/components/icons/Capsule.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'
import PostEditor from '@/components/post/Editor.vue'
import TagsWidget from '@/components/widgets/Tags.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	showWidgets: boolean
	following: Set<string>
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		TagsWidget,
		Header,
		Footer,
		PostEditor,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			showWidgets: false,
			following: new Set(),
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
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.following = following
		})
	},
	methods: {
		async toggleFriend(authorID: string) {
			if (authorID !== this.$store.state.session.id) {
				await followChange(this.following.has(authorID) ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, authorID)
				const data = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.following = data.following
			}
		},
		getTitle(): string {
			switch (this.$route.name) {
				case `home`:
					return `Hi ` + this.profile?.name + `,`
				case `discover`:
					return `Browse Capsule`
				default:
					return ``
			}
		},
		toggleZIndex() {
			this.showWidgets = !this.showWidgets
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