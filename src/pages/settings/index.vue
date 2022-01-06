<template>
	<main>
		<!-- Account Security -->
		<div v-show="tab === `account`">
			<h2 class="text-primary font-semibold mb-4 text-sm">Account Security</h2>
			<!-- ID -->
			<div class="flex flex-row items-center w-full mb-4">
				<label for="id" class="w-32 font-semibold">Identifier</label>
				<input
					id="id"
					type="text"
					:placeholder="$store.state.session.id"
					class="flex-grow bg-gray1 text-gray5 placeholder-gray5 rounded-lg px-2 py-1"
					disabled
				/>
				<button class="w-32" disabled></button>
			</div>
			<!-- Export Private Key -->
			<div class="flex flex-row items-center w-full mb-4">
				<label for="export" class="w-32 font-semibold">Private Key</label>
				<button id="export" class="text-primary" @click="downloadPrivateKey">Export Private Key</button>
			</div>
			<!-- Account Profile -->
			<h2 class="text-primary font-semibold text-sm py-4">Account Profile</h2>
			<div class="flex flex-row items-center w-full mb-4">
				<label for="editProfile" class="w-32 font-semibold">Public Profile</label>
				<nuxt-link
					:to="$store.state.session.id"
					class="bg-secondary text-white rounded-lg focus:outline-none"
					style="padding: 0.4rem 1.5rem"
				>
					Edit your Profile
				</nuxt-link>
			</div>
			<!-- Account Data -->
			<h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Data</h2>
			<div class="flex mb-4">
				<h3 class="w-56 font-semibold">Your Capsule data</h3>
				<button class="text-primary focus:outline-none">Request a download of your Capsule data</button>
			</div>
			<div class="flex mb-4">
				<h3 class="w-56 font-semibold">Deactivate My Account</h3>
				<button class="text-negative focus:outline-none">Deactivate my Capsule Account</button>
			</div>
		</div>

		<!-- Network Tab -->
		<div v-show="tab === `network`">
			<h2 class="text-primary font-semibold mb-4 text-sm">Capsule Node</h2>
			<div class="flex flex-row items-center w-full mb-4">
				<label for="node" class="w-48 font-semibold">Preferred Node:</label>
				<input
					id="node"
					v-model="nodeURL"
					type="text"
					:placeholder="``"
					class="flex-grow bg-gray1 text-gray5 placeholder-gray5 rounded-lg px-2 py-1 focus:outline-none"
				/>
				<button class="w-48 focus:outline-none"></button>
			</div>
		</div>
		<!-- Background image, styling tab -->
		<div v-show="tab === `styling`">
			<h2 class="text-primary font-semibold mb-4 text-sm">Upload a background image</h2>
			<div class="flex flex-row items-center w-full mb-4">
				<label for="backgroundImage" class="w-48 font-semibold">Choose a photo</label>
				<input
					id="backgroundImage"
					ref="backgroundImage"
					class="hidden"
					name="file"
					type="file"
					accept="image/*"
					@change="handleImage"
				/>
				<button @click="handleImageClick">Upload an Image</button>
			</div>
		</div>
		<!-- Submit button -->
		<div class="w-full flex justify-center">
			<button
				v-show="tab !== `account`"
				:class="hasChanged() ? '' : 'opacity-50'"
				class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2"
				@click="updateSettings"
			>
				Save Changes
			</button>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import imageCompression from 'browser-image-compression'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { getProfile, setProfile } from '@/backend/profile'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'
import { addPhotoToIPFS, preUploadPhoto } from '@/backend/photos'
import { getNearPrivateKey } from '@/backend/near'

interface IData {
	nodeURL: string
	backgroundImage: null | string | ArrayBuffer
}

export default Vue.extend({
	components: {},
	layout: `settings`,
	props: {
		tab: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			nodeURL: ``,
			backgroundImage: null,
		}
	},
	created() {
		const nodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
		if (nodeUrl) {
			this.nodeURL = nodeUrl
		}
		// Check for dark mode
		// const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches
		// if (prefersDarkMode) {
		// 	this.$store.commit(`settings/changeDarkMode`, this.$store.state.settings.darkMode)
		// }
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeID: MutationType.CHANGE_ID,
			changeName: MutationType.CHANGE_NAME,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		async downloadPrivateKey(): Promise<void> {
			const accountId = window.localStorage.getItem(`accountId`)
			if (!accountId) {
				this.$toastError(`Account not found, are you signed in?`)
				return
			}
			const privateKey = await getNearPrivateKey(accountId)
			const blob = new Blob([JSON.stringify({ accountId, privateKey })], { type: `application/json` })
			const link = document.createElement(`a`)
			link.href = URL.createObjectURL(blob)
			link.download = `capsule-priv-key-${this.$store.state.session.id}`
			link.click()
			URL.revokeObjectURL(link.href)
			this.$toastSuccess(`Downloaded private key`)
		},
		handleImageClick(): void {
			const b = this.$refs.backgroundImage as HTMLElement
			b.click()
		},
		async handleImage(e: HTMLInputEvent) {
			if (!e.target.files) {
				return
			}
			const image = e.target.files[0]
			if (image) {
				const options = {
					maxSizeMB: 5,
					maxWidthOrHeight: 1024,
					useWebWorker: true,
					initialQuality: 0.9,
				}
				try {
					const compressedImage = await imageCompression(image, options)
					const reader = new FileReader()
					reader.readAsDataURL(compressedImage)
					reader.onload = (i: Event) => {
						if (i.target !== null && reader.result !== null) {
							this.uploadImage(reader.result, compressedImage)
						}
					}
				} catch (err: any) {
					this.$toastError(err)
				}
			}
		},
		hasChanged() {
			return this.nodeURL !== ``
		},
		async uploadImage(image: string | ArrayBuffer, blobImage: Blob) {
			const avatarCID = await addPhotoToIPFS(image)
			await preUploadPhoto(avatarCID, blobImage)
			this.backgroundImage = image
			this.$store.commit(`changeBackgroundImage`, this.backgroundImage)
			await this.updateProfile()
			getProfile(this.$store.state.session.id, true) // Update cached profile
		},
		async updateProfile() {
			const backendProfile = getProfileFromSession(this.$store.state.session)
			const cid = await setProfile(backendProfile)
			this.changeCID(cid)
			return true
		},
		async updateSettings() {
			// if (!/((http|https?):\/\/)?(www\.)?[a-z0-9\-.]{3,}\.[a-z]{1-10}$/.test(this.nodeURL)) {
			// 	this.$toastError(`Invalid URL.`)
			// 	return
			// }
			if (this.nodeURL !== ``) {
				window.localStorage.setItem(`preferredNodeUrl`, this.nodeURL)
				window.location.href = `..`
			}
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				this.$toastSuccess(`Your settings has been successfully updated`)
			}
		},
	},
})
</script>
