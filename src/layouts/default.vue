<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-20">
					<Header :avatar="myAvatar" />
				</header>
				<div
					style="
						width: 1220px;
						min-height: calc(100vh - 80px);
						height: calc(100vh - 80px);
						bottom: -10px;
						backdrop-filter: blur(10px);
					"
					class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 z-10 bg-gradient-to-r from-lightBGStart to-lightBGStop backdrop-filter backdrop-blur-lg"
				>
					<div class="w-full p-5 flex flex-col items-ceter">
						<h1 class="font-bold text-negative text-6xl font-sans text-center mt-16">500</h1>
						<h2 class="text-center font-semibold text-2xl">Something went wrong</h2>
						<p class="text-center text-gray7 self-center mb-5 mt-2" style="width: 360px">
							We apologize for the issue, we suggest you to go back home
						</p>
						<div class="flex justify-center">
							<BrandedButton :action="handleReload" :text="`Back to home`" />
						</div>
						<img
							:src="require(`@/assets/images/brand/error.webp`)"
							alt="error image"
							class="self-center mt-10"
							style="width: 500px"
						/>
					</div>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { createDefaultProfile, getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'
import { getFollowersAndFollowing } from '@/backend/following'

interface IData {
	myProfile: Profile
	myAvatar: string | ArrayBuffer | null
	myFollowing: Set<string>
	followers: Set<string>
	following: Set<string>
}

export default Vue.extend({
	components: {
		Header,
		BrandedButton,
	},
	data(): IData {
		return {
			myProfile: createDefaultProfile(this.$store.state.session.id),
			myAvatar: null,
			myFollowing: new Set(),
			followers: new Set(),
			following: new Set(),
		}
	},
	async created() {
		const [{ profile: myProfile }] = await Promise.all([getProfile(this.$store.state.session.id)])
		// get my profile and avatar
		this.myProfile = myProfile || createDefaultProfile(this.$store.state.session.id)
		if (this.myProfile.avatar.length > 1) {
			getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
				this.myAvatar = p
			})
		}
		const myConnections = await getFollowersAndFollowing(this.$store.state.session.id)
		this.myFollowing = myConnections.following
	},
	methods: {
		handleReload(): void {
			if (this.$route.name !== `home`) {
				this.$router.push(`/home`)
			} else {
				location.reload()
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
