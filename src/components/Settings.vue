<template>
	<div class="popup w-full p-5">
		<!-- Header and Close button -->
		<header class="flex flex-row justify-between mb-2">
			<h2 class="font-bold text-xl">Edit your profile</h2>
			<button class="rounded-full bg-gray1 p-1" @click="$emit(`close`)"><CloseIcon /></button>
		</header>
		<!-- Change avatar -->
		<div class="flex justify-center w-full mb-5">
			<button class="focus:outline-none" @click="handleImageClick">
				<span class="absolute inline-flex">
					<Avatar :authorID="$store.state.session.id" :avatar="profilePic" :noClick="true" :size="`w-24 h-24`" />
				</span>
				<span
					class="
						h-24
						w-24
						bg-lightOnSurfaceText
						text-lightOnPrimaryText
						relative
						inline-flex
						rounded-lg
						flex
						items-center
						justify-center
						bg-opacity-25
					"
				>
					<PencilIcon class="w-5 h-5 fill-current" />
				</span>
			</button>
			<input
				id="file-input"
				ref="uploadedPic"
				class="hidden"
				name="file"
				type="file"
				accept="image/*"
				@change="handleImage"
			/>
		</div>
		<!-- Name -->
		<div class="flex flex-row mb-2">
			<label for="newID" class="w-32">Name</label>
			<input
				id="newName"
				v-model="newName"
				type="text"
				:placeholder="$store.state.session.name"
				class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg flex-grow"
			/>
		</div>
		<!-- Bio -->
		<div class="flex flex-row mb-2">
			<label for="bio" class="w-32"> Bio: </label>
			<div class="flex-grow">
				<textarea
					id="bio"
					:maxlength="maxCharBio"
					:value="bio"
					class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg w-full"
					@input="bio = $event.target.value"
					@keyup="checkBio()"
				></textarea>
				<p
					class="text-xs text-right"
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				>
					{{ checkBio() }} Characters Remaining
				</p>
			</div>
		</div>
		<!-- Location -->
		<div class="flex flex-row mb-2">
			<label for="location" class="w-32">Location</label>
			<input
				id="location"
				v-model="location"
				type="text"
				:placeholder="$store.state.session.location === '' ? 'Enter Location' : $store.state.session.location"
				class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg flex-grow"
			/>
		</div>
		<!-- Website -->
		<div class="flex flex-row mb-2">
			<label for="website" class="w-32">Website</label>
			<input
				id="website"
				v-model="website"
				type="text"
				:placeholder="$store.state.session.website === '' ? 'https://capsule.social' : $store.state.session.website"
				class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg flex-grow"
			/>
		</div>
		<!-- Email -->
		<div class="flex flex-row mb-2">
			<label for="newEmail" class="w-32">Email</label>
			<input
				id="newEmail"
				v-model="newEmail"
				type="email"
				:placeholder="$store.state.session.email"
				class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg flex-grow"
			/>
		</div>
		<!-- Preferred Node -->
		<!-- <div class="flex flex-row mb-2">
			<label for="nodeURL" class="w-32">OrbitDB URL</label>
			<input
				id="nodeURL"
				v-model="nodeURL"
				type="text"
				:placeholder="$store.state.nodeURL"
				class="text-black placeholder-black px-2 py-1 bg-gray1 rounded-lg flex-grow"
			/>
		</div> -->
		<!-- Socials -->
		<!-- <div class="flex flex-row mb-2">
			<label class="w-32">Socials</label>
		</div> -->

		<!-- Submit button -->
		<div class="flex justify-end">
			<BrandedButton :class="hasChanged() ? '' : 'opacity-50'" :action="updateSettings" :text="`Save Changes`" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import imageCompression from 'browser-image-compression'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'
import CloseIcon from '@/components/icons/X.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
// import ColorMode from '@/components/ColorMode.vue'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { getProfile, setProfile } from '@/backend/profile'
import { addPhotoToIPFS, getPhotoFromIPFS, preUploadPhoto } from '@/backend/photos'

interface IData {
	newName: string
	nodeURL: string
	profilePic: null | string | ArrayBuffer
	newID: string
	newEmail: string
	location: string
	website: string
	bio: string
	maxCharBio: number
}

export default Vue.extend({
	components: {
		CloseIcon,
		Avatar,
		BrandedButton,
		PencilIcon,
		// ColorMode,
	},
	data(): IData {
		return {
			newName: ``,
			nodeURL: ``,
			profilePic: null,
			newID: ``,
			newEmail: ``,
			location: ``,
			website: ``,
			bio: this.$store.state.session.bio,
			maxCharBio: 256,
		}
	},
	created() {
		if (this.$store.state.session.avatar !== ``) {
			getPhotoFromIPFS(this.$store.state.session.avatar).then((p) => {
				this.profilePic = p
			})
		}
		// Check for dark mode
		// const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches
		// if (prefersDarkMode) {
		// 	this.$store.commit(`settings/changeDarkMode`, this.$store.state.settings.darkMode)
		// }
	},
	methods: {
		handleImageClick(): void {
			const b = this.$refs.uploadedPic as HTMLElement
			b.click()
		},
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeID: MutationType.CHANGE_ID,
			changeName: MutationType.CHANGE_NAME,
			changeEmail: MutationType.CHANGE_EMAIL,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		hasChanged() {
			return (
				this.newName !== `` ||
				this.newID !== `` ||
				this.newEmail !== `` ||
				this.location !== `` ||
				this.bio !== this.$store.state.session.bio ||
				this.nodeURL !== ``
			)
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
				} catch (err) {
					this.$toastError(`Please try again`)
				}
			}
		},
		async updateProfile() {
			const backendProfile = getProfileFromSession(this.$store.state.session)
			const cid = await setProfile(backendProfile)
			this.changeCID(cid)
			return true
		},
		async uploadImage(image: string | ArrayBuffer, blobImage: Blob) {
			const avatarCID = await addPhotoToIPFS(image)
			await preUploadPhoto(avatarCID, blobImage)
			this.profilePic = image
			this.changeAvatar(avatarCID)
			await this.updateProfile()
			getProfile(this.$store.state.session.id, true) // Update cached profile
		},
		async downloadImage(cid: string) {
			this.profilePic = await addPhotoToIPFS(cid)
		},
		checkBio() {
			const charCount = this.bio.length
			return this.maxCharBio - charCount
		},
		async updateSettings() {
			if (this.hasChanged() === false) {
				this.$toastWarning(`nothing to update`)
				return
			}
			// Run quality rules before saving
			if (this.newName !== ``) {
				if (this.newName.length < 2 || this.newName.length > 32) {
					this.$toastError(`Invalid name length`)
					return
				} else {
					this.changeName(this.newName.trim())
				}
			}
			if (this.newID !== `` && this.$qualityID(this.newID)) {
				if (this.newID.length < 2 || this.newID.length > 18) {
					this.$toastError(`Invalid ID length`)
					return
				} else {
					this.changeID(this.newID.trim())
				}
			}
			if (this.bio !== this.$store.state.session.bio && this.checkBio() > 0) {
				this.changeBio(this.bio.trim())
			}
			if (this.newEmail !== `` && this.$qualityEmail(this.newEmail)) {
				this.changeEmail(this.newEmail.trim())
			}
			if (this.location !== this.$store.state.session.location && this.$qualityText(this.location)) {
				this.changeLocation(this.location.trim())
			}
			if (this.nodeURL && this.nodeURL !== this.$store.state.session.nodeURL) {
				if (!/((http|https?):\/\/)?(www\.)?[a-z0-9\-.]{3,}\.[a-z]{3}$/.test(this.nodeURL)) {
					// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
					this.$toastError(`Invalid URL`)
					return
				} else {
					this.$store.commit(`changeNodeURL`, this.nodeURL)
				}
			}
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				this.$emit(`close`)
				// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
				this.$toastSuccess(`Settings updated`)
				this.$router.go(0)
			}
		},
	},
})
</script>
