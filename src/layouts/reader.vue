<template>
	<main
		class="h-screen p-0 m-0 bg-img"
		:style="{
			background:
				`linear-gradient(180deg, rgba(46, 85, 106, 0.02) 0%, rgba(46, 85, 106, 0) 50%), url(` +
				$store.state.backgroundImage +
				`)`,
			backgroundSize: `contain`,
		}"
	>
		<!-- Featured photo popup -->
		<div
			v-if="displayPhoto"
			class="fixed w-full h-screen bg-primary bg-opacity-75 z-40 pt-24 overflow-auto"
			@click="displayPhoto = false"
		>
			<img :src="featuredPhoto.photo" class="modal-content rounded-lg" />
			<p v-if="featuredPhoto.caption" id="caption">{{ featuredPhoto.caption }}</p>
		</div>
		<!-- Wrapper -->
		<div class="w-full flex justify-center">
			<div class="flex flex-col w-full xl:w-1220">
				<!-- Header -->
				<header class="sticky hidden xl:block xl:min-w-1220 top-0 py-5 bg-gradient-to-r xl:z-10">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<!-- Content -->
				<section class="flex flex-row">
					<nuxt-child
						class="fixed w-full h-full xl:w-1220 xl:h-80 xl:min-h-80 overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-0 border border-lightBorder bg-gradient-to-r from-lightBGStart to-lightBGStop"
						@showPhoto="showPhoto"
					/>
				</section>
			</div>
		</div>
		<UnauthPopup />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'
import UnauthPopup from '@/components/UnauthPopup.vue'

import { getProfile, Profile } from '@/backend/profile'
import { getPhotoFromIPFS } from '@/backend/photos'

interface FeaturedPhoto {
	photo: string | null
	caption: string | null
}

interface IData {
	profile: Profile | null
	avatar: string | ArrayBuffer | null
	displayPhoto: boolean
	featuredPhoto: FeaturedPhoto
}

export default Vue.extend({
	components: {
		Header,
		UnauthPopup,
	},
	data(): IData {
		return {
			profile: null,
			avatar: null,
			displayPhoto: false,
			featuredPhoto: {
				photo: null,
				caption: null,
			},
		}
	},
	async created() {
		// Check if logged in user
		if (this.$store.state.session.id === ``) {
			return
		}
		// get logged in profile
		const { profile } = await getProfile(this.$store.state.session.id)
		this.profile = profile
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
	},
})
</script>

<style>
.modal-content {
	margin: auto;
	display: block;
	width: auto;
	max-width: 100%;
	height: auto;
	max-height: 88%;
}

/* Caption of Modal Image */
#caption {
	margin: auto;
	display: block;
	width: 80%;
	text-align: center;
	color: #ccc;
	padding: 10px 0;
	height: 150px;
}

/* Add Animation */
.modal-content,
#caption {
	animation-name: zoom;
	animation-duration: 0.6s;
}

@keyframes zoom {
	from {
		transform: scale(0.1);
	}
	to {
		transform: scale(1);
	}
}
</style>
