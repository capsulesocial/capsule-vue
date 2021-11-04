<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{ backgroundImage: `url(${require(`@/assets/images/brand/mainBG.png`)})` }"
	>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r">
					<div class="flex flex-row justify-between items-center">
						<!-- Left side: Links + write post button -->
						<nav class="flex flex-row items-center" style="font-size: 0.95rem">
							<nuxt-link to="/home" class="mr-5">
								<CapsuleIcon />
							</nuxt-link>
							<nuxt-link to="/home" class="mx-4" :class="getStyles(`home`)"> Home </nuxt-link>
							<nuxt-link to="/discover" class="mx-4" :class="getStyles(`discover`)"> Discover </nuxt-link>
							<nuxt-link to="/bookmarks" class="mx-4" :class="getStyles(`bookmarks`)"> Bookmarks </nuxt-link>
							<BrandedButton :text="`Write a Post`" :action="togglePostEditor" class="mx-4" />
						</nav>
						<!-- Right side: icons and avatar -->
						<div class="flex flex-row">
							<Avatar :avatar="avatar" :authorID="$store.state.session.id" />
						</div>
					</div>
				</header>
				<!-- Body -->
				<div>
					<!-- Title and peered nodes -->
					<div class="fixed w-full flex justify-between items-center" style="width: 1220px">
						<!-- Title -->
						<h1 class="font-semibold text-primary" style="font-size: 2.6rem">
							{{ getTitle() }}
						</h1>
						<!-- Peered nodes -->
						<div class="flex items-center bg-gray1 px-2 py-1 rounded-lg">
							<span class="text-sm">n peered nodes</span>
							<CapsuleIcon />
						</div>
					</div>
					<!-- Content -->
					<section class="flex flex-row mt-20">
						<nuxt-child
							style="
								width: 750px;
								min-height: calc(100vh - 160px);
								height: calc(100vh - 160px);
								backdrop-filter: blur(2px);
							"
							class="
								fixed
								overflow-y-auto
								rounded-lg
								shadow-lg
								mr-5
								p-6
								z-10
								bg-gradient-to-r
								from-lightBGStart
								to-lightBGStop
								backdrop-filter backdrop-blur-lg
							"
						/>
						<!-- Widgets -->
						<aside class="fixed" style="margin-left: 780px; width: 450px">
							<Widgets />
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
import Widgets from '@/components/Widgets.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		Avatar,
		BrandedButton,
		Widgets,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
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
	},
	methods: {
		togglePostEditor() {
			this.$router.push(`/post`)
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
		getStyles(tab: string): string {
			let res: string = ``
			// Check if current tab
			if (this.$route.name === tab) {
				res += `font-bold text-primary border-primary border-b`
			} else {
				res += `font-regular text-gray5`
			}
			return res
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