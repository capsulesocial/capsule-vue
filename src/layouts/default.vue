<template>
	<main
		class="bg-img m-0 h-screen p-0"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<div
					style="
						width: 1220px;
						min-height: calc(100vh - 80px);
						height: calc(100vh - 80px);
						bottom: -10px;
						backdrop-filter: blur(10px);
					"
					class="from-lightBGStart to-lightBGStop fixed z-10 mr-5 overflow-y-auto rounded-lg bg-gradient-to-r shadow-lg backdrop-blur-lg backdrop-filter"
				>
					<div class="items-ceter flex w-full flex-col p-5">
						<h1 class="text-negative mt-16 text-center font-sans text-6xl font-bold">500</h1>
						<h2 class="text-center text-2xl font-semibold">Something went wrong</h2>
						<p class="text-gray7 mb-5 mt-2 self-center text-center" style="width: 360px">
							We apologize for the issue, we suggest you to go back home
						</p>
						<div class="flex justify-center">
							<BrandedButton :action="handleReload" :text="`Back to home`" />
						</div>
						<img
							:src="require(`@/assets/images/brand/error.webp`)"
							alt="error image"
							class="mt-10 self-center"
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
		if (this.$store.state.session.id === ``) {
			return
		}
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
