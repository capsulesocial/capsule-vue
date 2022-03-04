<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightMainBG dark:bg-darkBG"
		:style="
			dark
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
			<div class="flex w-full lg:w-11/12 xl:w-10/12 flex-col">
				<!-- Header -->
				<Header :avatar="myAvatar" />
				<div
					style="min-height: calc(100vh - 70px); height: calc(100vh - 70px); backdrop-filter: blur(10px)"
					class="from-lightBGStart to-lightBGStop z-10 overflow-y-auto rounded-lg bg-gradient-to-r shadow-lg"
				>
					<div class="items-center flex w-full flex-col p-5">
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
import { IBackground, backgrounds } from '@/config'

interface IData {
	myProfile: Profile
	myAvatar: string | ArrayBuffer | null
	myFollowing: Set<string>
	followers: Set<string>
	following: Set<string>
	bgImage: IBackground
	dark: boolean
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
			bgImage: backgrounds[0],
			dark: false,
		}
	},
	async created() {
		if (this.$store.state.session.id === ``) {
			return
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.darkMode)
		// get logged  in profile
		const [{ profile: myProfile }] = await Promise.all([getProfile(this.$store.state.session.id)])
		// get my profile and avatar
		this.myProfile = myProfile || createDefaultProfile(this.$store.state.session.id)
		if (this.myProfile.avatar.length > 1) {
			getPhotoFromIPFS(this.myProfile.avatar).then((p) => {
				this.myAvatar = p
			})
		}
		this.bgImage = this.$getBGImage(this.myProfile?.background, `local`)
		const myConnections = await getFollowersAndFollowing(this.$store.state.session.id)
		this.myFollowing = myConnections.following
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
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
