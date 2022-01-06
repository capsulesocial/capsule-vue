<template>
	<main class="h-screen p-0 m-0 bg-img" :style="{ backgroundImage: `url(` + $store.state.backgroundImage + `)` }">
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
			<div class="flex flex-col" style="width: 1220px">
				<!-- Header -->
				<header class="w-full sticky top-0 py-5 bg-gradient-to-r z-10">
					<Header :avatar="avatar" />
				</header>
				<!-- Body -->
				<div>
					<!-- Content -->
					<section class="flex flex-row">
						<nuxt-child
							style="
								width: 1220px;
								min-height: calc(100vh - 80px);
								height: calc(100vh - 80px);
								backdrop-filter: blur(10px);
							"
							class="fixed overflow-y-auto rounded-lg shadow-lg mr-5 p-6 pt-0 border border-lightBorder bg-gradient-to-r from-lightBGStart to-lightBGStop"
							@showPhoto="showPhoto"
						/>
					</section>
				</div>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import Header from '@/components/Header.vue'

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
.bg-img {
	background-attachment: fixed;
	background-size: cover;
}
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
