<template>
	<div class="popup w-full p-5">
		<!-- Header and Close button -->
		<header v-if="$store.state.session.id === $route.params.id" class="mb-6 flex flex-row justify-between items-center">
			<h2 class="text-primary dark:text-secondary text-3xl font-semibold">Edit your profile</h2>
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1" @click="$emit(`close`)">
				<CloseIcon />
			</button>
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
		<div class="mb-4 flex flex-col lg:flex-row">
			<label for="newName" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Name</label>
			<input
				id="newName"
				v-model="newName"
				type="text"
				:placeholder="`Enter display name`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Bio -->
		<div class="mb-6 flex flex-col lg:flex-row">
			<label for="bio" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText"> Bio: </label>
			<div class="flex-grow">
				<textarea
					id="bio"
					:maxlength="maxCharBio"
					:value="bio"
					:placeholder="`Your Blogchain Bio`"
					class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none w-full rounded-lg px-2 py-1 text-black"
					@input="bio = $event.target.value"
					@keyup="checkBio()"
				></textarea>
				<p class="text-right text-xs text-gray5 dark:text-gray3">{{ checkBio() }} Characters Remaining</p>
			</div>
		</div>
		<!-- Location -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="location" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Location</label>
			<input
				id="location"
				v-model="location"
				type="text"
				:placeholder="`Display your location`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Website -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="website" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Website</label>
			<input
				id="website"
				v-model="website"
				type="text"
				:placeholder="`Display a website`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>
		<!-- Email -->
		<div v-if="$store.state.session.id === $route.params.id" class="mb-4 flex flex-col lg:flex-row">
			<label for="newEmail" class="mb-2 w-32 font-semibold lg:mb-0 dark:text-darkPrimaryText">Email</label>
			<input
				id="newEmail"
				v-model="newEmail"
				type="email"
				:placeholder="`Display a contact email`"
				class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-2 py-1 text-black"
			/>
		</div>

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
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'
import CloseIcon from '@/components/icons/X.vue'
import Avatar from '@/components/Avatar.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { getProfile, setProfile } from '@/backend/profile'
import { addPhotoToIPFS, preUploadPhoto } from '@/backend/photos'
import { URLRegex } from '@/plugins/quality'
import { getCompressedImage } from '@/backend/utilities/imageCompression'
import { getPhotoFromIPFS } from '@/backend/getPhoto'

interface IData {
	newName: string
	profilePic: null | string | ArrayBuffer
	newEmail: string
	location: string
	website: string
	bio: string
	maxCharBio: number
	newAvatarCID: string
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
			profilePic: null,
			newEmail: ``,
			location: ``,
			website: ``,
			bio: ``,
			maxCharBio: 256,
			newAvatarCID: ``,
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
	},
	errorCaptured(err: Error) {
		this.$toastError(`Error: ` + err.message)
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
				this.newAvatarCID.trim() !== this.$store.state.session.avatar ||
				this.newName.trim() !== this.$store.state.session.name ||
				this.newEmail.trim() !== this.$store.state.session.email ||
				this.location.trim() !== this.$store.state.session.location ||
				this.website.trim() !== this.$store.state.session.website ||
				this.bio.trim() !== this.$store.state.session.bio
			)
		},
		async handleImage(e: HTMLInputEvent) {
			if (!e.target.files) {
				this.$toastError(`No image selected`)
				return
			}
			const image = e.target.files[0]
			if (image) {
				try {
					const compressedImage = await getCompressedImage(image)
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
			try {
				const avatarCID = await addPhotoToIPFS(image)
				await preUploadPhoto(avatarCID, blobImage, filename, this.$store.state.session.id)
				this.profilePic = image
				this.newAvatarCID = avatarCID
			} catch (err) {
				this.$toastError(`Unsuccessful avatar upload!`)
			}
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

			const trimmedName = this.newName.trim()
			const trimmedBio = this.bio.trim()
			const trimmedEmail = this.newEmail.trim()
			const trimmedLocation = this.location.trim()
			const trimmedWebsite = this.website.trim()

			// Update name
			if (trimmedName.length !== 0 && (trimmedName.length < 2 || trimmedName.length > 32)) {
				this.$toastError(`Invalid name length`)
				return
			}
			this.changeName(trimmedName)

			// Update bio
			if (this.checkBio() < 0) {
				this.$toastError(`Bio too long`)
				return
			}
			this.changeBio(trimmedBio)

			// Update email
			if (trimmedEmail.length > 0) {
				const qualityEmail = this.$qualityEmail(trimmedEmail)
				if (this.$isError(qualityEmail)) {
					this.$toastError(qualityEmail.error)
					return
				}
			}
			this.changeEmail(trimmedEmail)

			// Update location
			this.changeLocation(trimmedLocation)

			// Update website
			if (trimmedWebsite.length > 0 && !URLRegex.test(trimmedWebsite)) {
				this.$toastError(`Invalid URL`)
				return
			}
			this.changeWebsite(trimmedWebsite)

			// Update Avatar
			if (this.newAvatarCID !== ``) {
				this.changeAvatar(this.newAvatarCID)
				getProfile(this.$store.state.session.id, true) // Update cached profile
			}

			try {
				const profileUpdated = await this.updateProfile()
				if (profileUpdated) {
					this.$emit(`close`)
					// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
					this.$toastSuccess(`Your profile has been successfully updated`)
				}
			} catch (err) {
				throw new Error(`${err}`)
			}
		},
	},
})
</script>
