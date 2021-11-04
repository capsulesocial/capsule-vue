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
							<Avatar :avatar="avatar" :authorID="$store.state.session.id" />
						</div>
					</div>
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row mt-12">
						<nuxt-child
							style="width: 1220px; min-height: calc(100vh - 184px); height: calc(100vh - 184px)"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 bg-white p-5 z-10"
						/>
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
		getStyles(tab: string): string {
			let res: string = ``
			// Check if current tab
			if (this.$route.name === tab) {
				res += `font-semibold text-lightPrimaryTextunderline border-primary border-b`
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