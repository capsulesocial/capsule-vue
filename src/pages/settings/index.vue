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
					:to="`/id/` + $store.state.session.id"
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
			<!-- Account Invites -->
			<h2 v-if="generatedNumber < 1" class="text-primary font-semibold pt-4 mb-4 text-sm">Account Invites</h2>
			<div
				v-if="generatedNumber < 1"
				class="p-5 rounded-lg mt-4 overflow-hidden relative bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder shadow-lg"
			>
				<label for="id" class="font-semibold text-sm pb-1 block mb-2">Generate an invite code</label>
				<p class="text-gray5">
					Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
					release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to
					seed a vibrant community that will grow over time. As an already registered user, you can invite one member
					your social circle to participate to the Blogchain beta by sharing the following invite code:
				</p>
				<div class="flex items-center mt-5">
					<h3 class="font-semibold mr-4">Invite code</h3>
					<div class="relative w-2/5 mr-4 flex items-center">
						<input
							id="id"
							ref="code"
							v-model="generatedInviteCode"
							type="text"
							placeholder="No more code available"
							class="rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-primary font-sans bg-gray2 border border-dashed border-primary w-full"
							style="height: 3rem"
							@focus="$event.target.select()"
						/>
						<button class="text-primary focus:outline-none text-xs absolute right-0 mr-4" @click="copyURL">
							<CopyIcon class="w-5 h-5 fill-current" />
						</button>
					</div>
					<button class="text-primary focus:outline-none text-sm" @click="generateNewInviteCode">
						Generate a new code
					</button>
				</div>
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
					accept="image/jpeg, imag/png"
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
import CopyIcon from '@/components/icons/Copy.vue'

interface IData {
	nodeURL: string
	backgroundImage: null | string | ArrayBuffer
	generatedInviteCode: string
	generatedNumber: number
}

export default Vue.extend({
	components: {
		CopyIcon,
	},
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
			generatedInviteCode: ``,
			generatedNumber: 0,
		}
	},
	created() {
		const nodeUrl = window.localStorage.getItem(`preferredNodeUrl`)
		if (nodeUrl) {
			this.nodeURL = nodeUrl
		}
		this.generateNewInviteCode()
		// Check for dark mode
		// const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches
		// if (prefersDarkMode) {
		// 	this.$store.commit(`settings/changeDarkMode`, this.$store.state.settings.darkMode)
		// }
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
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
		generateNewInviteCode() {
			// generate a new invite code
			this.generatedInviteCode = `TEST`
		},
		copyURL(): void {
			const code = this.$refs.code as HTMLElement
			code.focus()
			document.execCommand(`copy`)
			this.$toastSuccess(`code copied to clipboard!`)
		},
	},
})
</script>
