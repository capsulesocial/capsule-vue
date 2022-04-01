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
				class="w-full lg:w-1220 absolute min-h-70 h-70 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder overflow-y-auto rounded-t-lg bg-gradient-to-r shadow-lg"
			></div>
		</div>

		<!-- Main content scroll -->
		<div ref="container" class="flex w-full overflow-y-auto overflow-x-hidden justify-center">
			<!-- Content container -->
			<div class="flex w-full h-full lg:w-11/12 xl:w-10/12 relative max-w-1220 flex-row justify-between">
				<nuxt-child ref="childPage" class="w-full" @showPhoto="showPhoto" />
			</div>
		</div>
		<!-- Featured photo popup -->
		<div
			v-if="displayPhoto"
			class="bg-darkBG dark:bg-lightBG fixed z-40 h-screen w-full overflow-auto bg-opacity-50 dark:bg-opacity-50 pt-16 flex flex-col justify-center items-center"
			@click="displayPhoto = false"
		>
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="displayPhoto = false">
				<XIcon />
			</button>
			<img :src="featuredPhoto.photo" class="modal-content rounded-lg w-3/5" />
			<div class="flex justify-center mt-5">
				<p
					v-if="featuredPhoto.caption"
					id="caption"
					class="text-lightPrimaryText dark:text-darkPrimaryText py-2 px-3 text-center bg-lightBG dark:bg-darkBG rounded-lg shadow-lg"
				>
					{{ featuredPhoto.caption }}
				</p>
			</div>
		</div>
		<UnauthPopup />
		<portal-target name="card-popup"></portal-target>
		<portal-target name="postPage"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import XIcon from '@/components/icons/X.vue'

import { IBackground, backgrounds } from '@/config'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface FeaturedPhoto {
	photo: string | null
	caption: string | null
}

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	displayPhoto: boolean
	featuredPhoto: FeaturedPhoto
	bgImage: IBackground
	lastScroll: number
	scrollingDown: boolean
	lastScrollingDown: boolean
}

export default Vue.extend({
	components: {
		Header,
		UnauthPopup,
		XIcon,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: null,
			displayPhoto: false,
			featuredPhoto: {
				photo: null,
				caption: null,
			},
			bgImage: backgrounds[0],
			lastScroll: 0,
			scrollingDown: false,
			lastScrollingDown: false,
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
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
	},
	mounted() {
		const container = this.$refs.container as HTMLElement
		container.addEventListener(`scroll`, this.handleScroll)
	},
	methods: {
		showPhoto(d: FeaturedPhoto): void {
			this.featuredPhoto = d
			this.displayPhoto = !this.displayPhoto
		},
		handleScroll() {
			const container = this.$refs.container as HTMLElement
			this.lastScrollingDown = this.scrollingDown
			if (container.scrollTop > this.lastScroll && container.scrollTop !== 0) {
				// scrolling down
				this.scrollingDown = true
			} else {
				// scrolling up
				this.scrollingDown = false
			}
			this.lastScroll = container.scrollTop
			if (this.lastScrollingDown !== this.scrollingDown) {
				// @ts-ignore
				this.$refs.childPage.showHeader(true)
			}
		},
	},
})
</script>

<style>
.modal-content {
	display: block;
	max-width: 100%;
	height: auto;
	max-height: 88%;
}

/* Add Animation */
.modal-content,
#caption {
	animation-name: zoom;
	animation-duration: 0.6s;
}

@keyframes zoom {
	from {
		transform: scale(0.7);
	}
	to {
		transform: scale(1);
	}
}
</style>
