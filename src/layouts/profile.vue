<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="myAvatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row">
						<nuxt-child
							style="width: 750px; min-height: calc(100vh - 80px); height: calc(100vh - 80px)"
							class="
								fixed
								overflow-y-auto
								rounded-lg
								shadow-lg
								mr-5
								z-10
								bg-gradient-to-r
								from-lightBGStart
								to-lightBGStop
								backdrop-filter backdrop-blur-lg
							"
							:visitProfile="visitProfile"
							:visitAvatar="visitAvatar"
							:followers="followers"
							:following="following"
							:toggleFriend="toggleFriend"
							:updateFollowers="updateFollowers"
							:userIsFollowed="userIsFollowed"
						/>
						<!-- Widgets -->
						<aside
							class="fixed overflow-y-auto p-4 -mt-4"
							style="margin-left: 755px; width: 485px; min-height: calc(100vh - 70px); height: calc(100vh - 70px)"
						>
							<ProfileWidget :location="visitProfile.location" />
							<FollowersWidget v-if="followers.size > 0" :followers="followers" :updateFollowers="updateFollowers" />
							<Footer />
						</aside>
					</section>
					<section v-else class="w-full flex justify-center">
						<div class="loader m-5 p-10 rounded-lg"></div>
					</section>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import ProfileWidget from '@/components/widgets/Profile.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'
import Header from '@/components/Header.vue'
import Footer from '@/components/Footer.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	myProfile: Profile
	myAvatar: string | ArrayBuffer | null
	visitProfile: Profile
	visitAvatar: string | ArrayBuffer | null
	followers: Set<string>
	following: Set<string>
	userIsFollowed: boolean
}

export default Vue.extend({
	components: {
		ProfileWidget,
		FollowersWidget,
		Header,
		Footer,
	},
	data(): IData {
		return {
			myProfile: createDefaultProfile(this.$store.state.session.id),
			myAvatar: null,
			visitProfile: createDefaultProfile(this.$route.params.id),
			visitAvatar: null,
			followers: new Set(),
			following: new Set(),
			userIsFollowed: false,
		}
	},
	watch: {
		$route(n, o) {
			if (n.params.id !== o.params.id) {
				location.reload()
			}
		},
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}

		const [myProfile, visitProfile] = await Promise.all([
			getProfile(this.$store.state.session.id),
			getProfile(this.$route.params.id),
		])
		// get my profile and avatar
		this.myProfile = myProfile || createDefaultProfile(this.$store.state.session.id)
		if (this.myProfile.avatar.length > 1) {
			getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
				this.myAvatar = p
			})
		}
		// Get visiting profile and avatar
		this.visitProfile = visitProfile || createDefaultProfile(this.$route.params.id)
		if (this.visitProfile.avatar !== ``) {
			getPhotoFromIPFS(this.visitProfile.avatar).then((p) => {
				this.visitAvatar = p
			})
		}
		const { followers, following } = await getFollowersAndFollowing(this.$route.params.id)
		this.followers = followers
		this.following = following
		this.userIsFollowed = followers.has(this.$store.state.session.id)
	},
	methods: {
		async toggleFriend() {
			await followChange(
				this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`,
				this.$store.state.session.id,
				this.$route.params.id,
			)
			this.updateFollowers()
		},
		async updateFollowers() {
			const { followers, following } = await getFollowersAndFollowing(this.$route.params.id, true)
			this.followers = followers
			this.following = following
			this.userIsFollowed = followers.has(this.$store.state.session.id)
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
