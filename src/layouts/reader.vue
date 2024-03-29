<template>
	<main
		class="bg-img m-0 h-screen overflow-y-hidden p-0 bg-lightBG dark:bg-darkBG"
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
		<!-- Featured photo popup -->
		<div
			v-if="displayPhoto"
			class="bg-darkBG dark:bg-lightBG fixed z-40 h-screen w-full overflow-auto bg-opacity-50 dark:bg-opacity-50 pt-16 flex flex-col justify-center items-center"
			@click="displayPhoto = false"
		>
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="displayPhoto = false">
				<XIcon />
			</button>
			<img :src="featuredPhoto.photo" class="modal-content max-w-3/5 h-auto rounded-lg" />
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
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="flex w-full lg:w-11/12 xl:w-10/12 max-w-1220 flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<!-- Content -->
				<section class="flex flex-row">
					<nuxt-child
						class="min-h-61 h-61 lg:min-h-70 lg:h-70 border-lightBorder bg-lightBG dark:bg-darkBGStop w-full overflow-y-auto lg:rounded-lg border pt-0 shadow-lg xl:h-80 xl:pt-0"
						@showPhoto="showPhoto"
						@showWarning="toggleWarning"
					/>
				</section>
			</div>
		</div>
		<UnauthPopup />
		<WarningPopup v-if="showWarning" @close="toggleWarning" />
		<portal-target name="card-popup"></portal-target>
		<portal-target name="postPage"></portal-target>
		<portal-target name="bioPopup"></portal-target>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import UnauthPopup from '@/components/popups/UnauthPopup.vue'
import XIcon from '@/components/icons/X.vue'
import WarningPopup from '@/components/popups/WarningPopup.vue'

import { IBackground, backgrounds } from '@/config/backgrounds'
import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface FeaturedPhoto {
	photo: string | null
	caption: string | null
}

interface IData {
	profile: Profile | null
	avatar?: string | ArrayBuffer
	displayPhoto: boolean
	featuredPhoto: FeaturedPhoto
	bgImage: IBackground
	showWarning: boolean
}

export default Vue.extend({
	components: {
		Header,
		UnauthPopup,
		XIcon,
		WarningPopup,
	},
	middleware: `auth`,
	data(): IData {
		return {
			profile: null,
			avatar: undefined,
			displayPhoto: false,
			featuredPhoto: {
				photo: null,
				caption: null,
			},
			bgImage: backgrounds[0],
			showWarning: false,
		}
	},
	async created() {
		// Set color mode
		this.$setColorMode(this.$store.state.settings.mode)
		this.$setColor(this.$store.state.settings.color)
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
		this.bgImage = this.$getBGImage(this.profile?.background)
		// Get avatar
		if (this.profile && this.profile.avatar.length > 1) {
			getPhotoFromIPFS(this.profile.avatar).then((p) => {
				this.avatar = p
			})
		}
	},
	methods: {
		showPhoto(d: FeaturedPhoto): void {
			this.featuredPhoto = d
			this.displayPhoto = !this.displayPhoto
		},
		toggleWarning() {
			this.showWarning = !this.showWarning
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
