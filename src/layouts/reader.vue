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
		<!-- Featured photo popup -->
		<div
			v-if="displayPhoto"
			class="bg-primary fixed z-40 h-screen w-full overflow-auto bg-opacity-75 pt-24"
			@click="displayPhoto = false"
		>
			<img :src="featuredPhoto.photo" class="modal-content rounded-lg" />
			<p v-if="featuredPhoto.caption" id="caption">{{ featuredPhoto.caption }}</p>
		</div>
		<!-- Wrapper -->
		<div class="flex w-full justify-center">
			<div class="xl:w-1220 flex w-full flex-col">
				<!-- Header -->
				<Header :avatar="avatar" />
				<!-- Body -->
				<!-- Content -->
				<section class="flex flex-row">
					<nuxt-child
						class="xl:w-1220 xl:min-h-80 border-lightBorder from-lightBGStart to-lightBGStop fixed mr-5 h-full w-full overflow-y-auto rounded-lg border bg-gradient-to-r p-5 pt-0 shadow-lg xl:h-80 xl:p-6 xl:pt-0"
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
