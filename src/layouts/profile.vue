<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/paper4.svg`)})` }"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-white">
					<div class="flex flex-row justify-between items-center">
						<!-- Left side: Links + write post button -->
						<nav class="flex flex-row items-center">
							<nuxt-link to="/home" class="mr-5">
								<CapsuleIcon />
							</nuxt-link>
							<nuxt-link to="/home" class="mx-5" :class="getStyles(`home`)"> Home </nuxt-link>
							<nuxt-link to="/discover" class="mx-5" :class="getStyles(`discover`)"> Discover </nuxt-link>
							<nuxt-link to="/bookmarks" class="mx-5" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
							<BrandedButton :text="`Write a Post`" :action="togglePostEditor" />
						</nav>
						<!-- Right side: icons and avatar -->
						<div class="flex flex-row">
							<Avatar :avatar="myAvatar" :authorID="$store.state.session.id" />
						</div>
					</div>
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section v-if="visitProfile" class="flex flex-row mt-12 z-10">
						<nuxt-child
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 bg-white p-5"
							style="width: 750px; min-height: calc(100vh - 184px); height: calc(100vh - 184px)"
							:visitProfile="visitProfile"
							:visitAvatar="visitAvatar"
							:followers="followers"
							:following="following"
							:toggleFriend="toggleFriend"
							:updateFollowers="updateFollowers"
							:userIsFollowed="userIsFollowed"
						/>
						<!-- Widgets -->
						<aside class="fixed" style="margin-left: 780px; width: 450px">
							<ProfileWidget :location="visitProfile.location" />
							<FollowersWidget v-if="followers.size > 0" :followers="followers" :updateFollowers="updateFollowers" />
							<footer class="text-gray5">
								<div class="flex">
									<nuxt-link to="/help" class="pr-4">Help</nuxt-link>
									<nuxt-link to="/writers" class="pr-4">Writers</nuxt-link>
									<nuxt-link to="/blog" class="pr-4">Blog</nuxt-link>
									<nuxt-link to="/careers" class="pr-4">Careers</nuxt-link>
									<nuxt-link to="/terms" class="pr-4">Terms</nuxt-link>
									<nuxt-link to="/about" class="pr-4">About</nuxt-link>
								</div>
								© 2021 Capsule.Social, Inc.
							</footer>
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
import CapsuleIcon from '@/components/icons/Capsule.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import ProfileWidget from '@/components/widgets/Profile.vue'
import FollowersWidget from '@/components/widgets/Followers.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	myProfile: Profile | null
	myAvatar: string | ArrayBuffer | null
	visitProfile: Profile | null
	visitAvatar: string | ArrayBuffer | null
	followers: Set<string>
	following: Set<string>
	userIsFollowed: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		Avatar,
		BrandedButton,
		ProfileWidget,
		FollowersWidget,
	},
	data(): IData {
		return {
			myProfile: null,
			myAvatar: null,
			visitProfile: null,
			visitAvatar: null,
			followers: new Set(),
			following: new Set(),
			userIsFollowed: false,
		}
	},
	watch: {
		$route() {
			location.reload()
		},
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			this.$router.push(`/`)
		}
		// get my profile and avatar
		this.myProfile = await getProfile(this.$store.state.session.id)
		if (this.myProfile && this.myProfile.avatar.length > 1) {
			getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
				this.myAvatar = p
			})
		}
		// Get visiting profile and avatar
		this.visitProfile = await getProfile(this.$route.params.id)
		if (this.visitProfile && this.visitProfile.avatar !== ``) {
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
		togglePostEditor() {
			this.$router.push(`/post`)
		},
		getStyles(tab: string): string {
			let res: string = ``
			// Check if current tab
			if (this.$route.name === tab) {
				res += `font-semibold text-lightPrimaryTextunderline border-primary border-b`
			}
			return res
		},
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