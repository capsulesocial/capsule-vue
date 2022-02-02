<template>
	<div class="popup w-full p-5">
		<!-- Header and Close button -->
		<header v-if="$store.state.session.id === $route.params.id" class="mb-2 flex flex-row justify-between">
			<h2 class="text-xl font-bold">Edit your profile</h2>
			<button class="bg-gray1 focus:outline-none rounded-full p-1" @click="$emit(`close`)"><CloseIcon /></button>
		</header>
		<!-- Change avatar -->
		<div class="mb-5 flex w-full justify-center">
			<button class="focus:outline-none" @click="handleImageClick">
				<span class="absolute inline-flex">
					<Avatar :authorID="$store.state.session.id" :avatar="profilePic" :noClick="true" :size="`w-24 h-24`" />
				</span>
				<span
					class="bg-lightOnSurfaceText text-lightOnPrimaryText relative inline-flex h-24 w-24 items-center justify-center rounded-lg bg-opacity-25"
				>
					<PencilIcon class="h-5 w-5 fill-current" />
				</span>
			</button>
			<input
				id="file-input"
				ref="uploadedPic"
				class="hidden"
				name="file"
				type="file"
				accept="image/jpeg, image/png"
				@change="handleImage"
			/>
		</div>
		<!-- Name -->
		<div class="mb-4 flex flex-col xl:flex-row">
			<label for="newName" class="mb-2 w-32 font-semibold xl:mb-0">Name</label>
			<input
				id="newName"
				v-model="newName"
				type="text"
				:placeholder="`Enter display name`"
				class="placeholder-gray5 bg-gray1 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Bio -->
		<div class="mb-6 flex flex-col xl:flex-row">
			<label for="bio" class="mb-2 w-32 font-semibold xl:mb-0"> Bio: </label>
			<div class="flex-grow">
				<textarea
					id="bio"
					:maxlength="maxCharBio"
					:value="bio"
					:placeholder="`Your Capsule Bio`"
					class="placeholder-gray5 bg-gray1 focus:outline-none w-full rounded-lg px-2 py-1 text-black"
					@input="bio = $event.target.value"
					@keyup="checkBio()"
				></textarea>
				<p
					class="text-right text-xs"
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
				>
					{{ checkBio() }} Characters Remaining
				</p>
			</div>
		</div>
		<!-- Location -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col xl:flex-row">
			<label for="location" class="mb-2 w-32 font-semibold xl:mb-0">Location</label>
			<input
				id="location"
				v-model="location"
				type="text"
				:placeholder="`Display your location`"
				class="placeholder-gray5 bg-gray1 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Website -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col xl:flex-row">
			<label for="website" class="mb-2 w-32 font-semibold xl:mb-0">Website</label>
			<input
				id="website"
				v-model="website"
				type="text"
				:placeholder="`Display a website`"
				class="placeholder-gray5 bg-gray1 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Email -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col xl:flex-row">
			<label for="newEmail" class="mb-2 w-32 font-semibold xl:mb-0">Email</label>
			<input
				id="newEmail"
				v-model="newEmail"
				type="email"
				:placeholder="`Display a contact email`"
				class="placeholder-gray5 bg-gray1 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
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
		<div v-if="$store.state.session.id === $route.params.id" class="flex justify-end">
			<BrandedButton :class="hasChanged() ? '' : 'opacity-50'" :action="updateSettings" :text="`Save changes`" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
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
	props: {
		updateProfileMethod: { type: Function as PropType<(update: boolean) => void>, required: true },
	},
	data(): IData {
		return {
			newName: ``,
			nodeURL: ``,
			profilePic: null,
			newEmail: ``,
			location: ``,
			website: ``,
			bio: ``,
			maxCharBio: 256,
		}
	},

	created() {
		if (this.$store.state.session.avatar !== ``) {
			getPhotoFromIPFS(this.$store.state.session.avatar).then((p) => {
				this.profilePic = p
			})
		}
		if (this.$store.state.session.name !== ``) {
			this.newName = this.$store.state.session.name
		}
		if (this.$store.state.session.bio !== ``) {
			this.bio = this.$store.state.session.bio
		}
		if (this.$store.state.session.location !== ``) {
			this.location = this.$store.state.session.location
		}
		if (this.$store.state.session.website !== ``) {
			this.website = this.$store.state.session.website
		}
		if (this.$store.state.session.email !== ``) {
			this.newEmail = this.$store.state.session.email
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
			changeName: MutationType.CHANGE_NAME,
			changeEmail: MutationType.CHANGE_EMAIL,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
			changeWebsite: MutationType.CHANGE_WEBSITE,
		}),
		hasChanged() {
			return (
				this.newName !== `` ||
				this.newEmail !== `` ||
				this.location !== `` ||
				this.website !== `` ||
				this.bio !== `` ||
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
							this.uploadImage(reader.result, compressedImage, image.name)
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
			this.updateProfileMethod(true)
			return true
		},
		async uploadImage(image: string | ArrayBuffer, blobImage: Blob, filename: string) {
			const avatarCID = await addPhotoToIPFS(image)
			await preUploadPhoto(avatarCID, blobImage, filename)
			this.profilePic = image
			this.changeAvatar(avatarCID)
			await this.updateProfile()
			getProfile(this.$store.state.session.id, true) // Update cached profile
			this.updateSettings()
		},
		async downloadImage(cid: string) {
			this.profilePic = await addPhotoToIPFS(cid)
		},
		checkBio() {
			const charCount = this.bio.trim().length
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
				}
				this.changeName(this.newName.trim())
			}
			if (this.bio !== this.$store.state.session.bio && this.checkBio() > 0) {
				this.changeBio(this.bio.trim())
			}

			const qualityEmail = this.$qualityEmail(this.newEmail)
			if (this.newEmail.length > 0 && this.$isError(qualityEmail)) {
				this.$toastError(qualityEmail.error)
				return
			}
			this.changeEmail(this.newEmail.trim())

			if (this.location !== this.$store.state.session.location) {
				this.changeLocation(this.location.trim())
			}
			if (this.website !== this.$store.state.session.website && this.website && this.website !== ``) {
				if (
					/^(http:\/\/www\.|https:\/\/www\.|http:\/\/|https:\/\/)?[a-z0-9]+([-.]{1}[a-z0-9]+)*\.[a-z]{2,5}(:[0-9]{1,5})?(\/.*)?$/.test(
						this.website,
					)
				) {
					this.changeWebsite(this.website)
				} else {
					this.$toastError(`Invalid URL`)
					return
				}
			}
			if (this.nodeURL && this.nodeURL !== this.$store.state.session.nodeURL) {
				if (!/((http|https?):\/\/)?(www\.)?[a-z0-9\-.]{3,}\.[a-z]{3}$/.test(this.nodeURL)) {
					// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
					this.$toastError(`Invalid URL`)
					return
				}

				this.$store.commit(`changeNodeURL`, this.nodeURL)
			}
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				this.$emit(`close`)
				// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
				this.$toastSuccess(`Your profile has been successfully updated`)
				// this.$router.go(0)
			}
		},
	},
})
</script>
