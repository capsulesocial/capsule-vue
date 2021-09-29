<template>
	<main class="w-full border-l z-10">
		<section class="flex" style="width: 750px; height: calc(100vh - 95px)">
			<!-- Left column: Select tab -->
			<article
				style="width: 240px"
				:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
				class="flex flex-col w-full"
			>
				<h2 class="border-b-2 text-xl bold font-bold" style="padding: 12px 0px 10px 16px">Settings</h2>
				<button
					class="flex flex-row justify-between p-4 focus:outline-none border-r-4 border-transparent"
					:class="getStyles('account')"
					@click="changeTab('account')"
				>
					<span class="text-lg">Account Info</span>
					<ChevronRight class="text-gray4" />
				</button>
				<button
					class="flex flex-row justify-between p-4 focus:outline-none border-r-4 border-transparent"
					:class="getStyles('password')"
					@click="changeTab('password')"
				>
					<span class="text-lg">Password Update</span>
					<ChevronRight class="text-gray4" />
				</button>
				<button
					class="flex flex-row justify-between p-4 focus:outline-none border-r-4 border-transparent"
					:class="getStyles('social')"
					@click="changeTab('social')"
				>
					<span class="text-lg">Social Accounts</span>
					<ChevronRight class="text-gray4" />
				</button>
				<button
					class="flex flex-row justify-between p-4 focus:outline-none border-r-4 border-transparent"
					:class="getStyles('advanced')"
					@click="changeTab('advanced')"
				>
					<span class="text-lg">Advanced</span>
					<ChevronRight class="text-gray4" />
				</button>
				<!-- <button
					class="flex flex-row justify-between p-4 focus:outline-none border-r-4 border-transparent"
					:class="getStyles('display')"
					@click="changeTab('display')"
				>
					<span class="text-lg">Display Themes</span>
					<ChevronRight class="text-gray4" />
				</button> -->
			</article>

			<!-- Right column: Show details -->
			<div style="width: 510px">
				<!-- Account -->
				<article v-if="tab === 'account'" class="col-span-2 border-r border-l h-full">
					<!-- General Settings (Username, ID, Email) -->
					<h2
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="border-b-2 text-xl bold font-bold"
						style="padding: 12px 0px 10px 16px"
					>
						Account Information
					</h2>
					<div class="p-5 flex flex-col">
						<p style="color: #424242" class="mb-5">Edit your profile:</p>
						<button class="self-center mb-2 text-xs text-gray4" @click="$refs.uploadedPic.click()">
							<img
								v-if="$store.state.session.avatar !== ''"
								:src="profilePic"
								class="w-32 h-32 rounded-lg object-cover"
							/>
							<UploadAvatar v-else class="w-32 h-32 rounded-lg" />
							<span :class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'">
								Change Avatar
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
						<div class="flex flex-col">
							<!-- Enter name: -->
							<div class="my-5">
								<label for="newID" class="hidden">Change Name</label>
								<input
									id="newName"
									v-model="newName"
									type="text"
									:placeholder="$store.state.session.name"
									:class="
										$store.state.settings.darkMode
											? 'bg-lightBG text-lightSecondaryText focus:border-lightActive'
											: 'bg-darkBG text-darkSecondaryText focus:border-darkActive'
									"
									class="focus:outline-none border-b-2 w-full"
								/>
							</div>
							<!-- Enter ID -->
							<div class="mb-5">
								<label for="newID" class="hidden">Change ID</label>
								<input
									id="newID"
									v-model.trim="newID"
									type="text"
									:placeholder="$store.state.session.id"
									:class="
										$store.state.settings.darkMode
											? 'bg-lightBG text-lightSecondaryText focus:border-lightActive'
											: 'bg-darkBG text-darkSecondaryText focus:border-darkActive'
									"
									class="focus:outline-none border-b-2 w-full"
								/>
							</div>
							<!-- Enter email -->
							<div class="mb-5">
								<label for="newEmail" class="hidden">Change Email</label>
								<input
									id="newEmail"
									v-model="newEmail"
									type="email"
									:placeholder="$store.state.session.email"
									:class="
										$store.state.settings.darkMode
											? 'bg-lightBG text-lightSecondaryText focus:border-lightActive'
											: 'bg-darkBG text-darkSecondaryText focus:border-darkActive'
									"
									class="focus:outline-none border-b-2 w-full"
								/>
							</div>
							<!-- Enter Location -->
							<div class="mb-5">
								<label for="location" class="hidden">Location:</label>
								<input
									id="location"
									v-model="location"
									type="text"
									:placeholder="$store.state.session.location === '' ? 'Enter Location' : $store.state.session.location"
									:class="
										$store.state.settings.darkMode
											? 'bg-lightBG text-lightSecondaryText focus:border-lightActive'
											: 'bg-darkBG text-darkSecondaryText focus:border-darkActive'
									"
									class="focus:outline-none border-b-2 w-full"
								/>
							</div>
						</div>
						<!-- Enter bio -->
						<div class="flex flex-col">
							<label
								for="bio"
								class=""
								:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							>
								Bio:
							</label>
							<textarea
								id="bio"
								:maxlength="maxCharBio"
								:value="bio"
								rows="5"
								:class="
									$store.state.settings.darkMode
										? 'bg-lightBG text-lightSecondaryText focus:text-lightPrimaryText focus:border-lightActive'
										: 'bg-darkBG text-darkSecondaryText focus:text-darkPrimaryText focus:border-darkActive'
								"
								class="border-b-2 focus:outline-none resize-none"
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
						<!-- Submit button -->
						<button
							:class="hasChanged() ? '' : 'opacity-50'"
							class="bg-primary text-white rounded-lg focus:outline-none"
							style="width: 128px; height: 40px; margin-left: 340px; margin-top: 25px"
							@click="updateSettings"
						>
							Save Changes
						</button>
					</div>
				</article>
				<!-- Password -->
				<article v-if="tab === 'password'" class="col-span-2 border-r border-l h-full">
					<h2
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="border-b-2 text-xl bold font-bold"
						style="padding: 12px 0px 10px 16px"
					>
						Change Password
					</h2>
					<div class="flex flex-col p-5">
						<p
							class="mb-5"
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						>
							Choose a strong password to protect your account:
						</p>

						<label for="password" class="hidden">Current Password</label>
						<input
							id="password"
							type="password"
							class="w-full border rounded-lg focus:outline-none px-5 py-2 focus:border-primary"
							placeholder="Current Password"
						/>

						<nuxt-link to="/help" class="text-right mb-2 mt-1 text-sm text-primary font-semibold">
							Forgot Password?
						</nuxt-link>

						<label for="newPassword" class="hidden">New Password</label>
						<input
							id="newPassword"
							type="password"
							class="w-full border rounded-lg focus:outline-none px-5 py-2 focus:border-primary mb-2"
							placeholder="New Password"
						/>

						<label for="confirmPassword" class="hidden">Confirm Password</label>
						<input
							id="confirmPassword"
							type="password"
							class="w-full border rounded-lg focus:outline-none px-5 py-2 my-2 focus:border-primary"
							placeholder="Confirm Password"
						/>
						<!-- Submit button -->
						<button
							:class="hasChanged() ? '' : 'opacity-50'"
							class="bg-primary text-white rounded-lg focus:outline-none"
							style="width: 128px; height: 40px; margin-left: 340px; margin-top: 25px"
							@click="updateSettings"
						>
							Save Changes
						</button>
					</div>
				</article>
				<!-- Social Links -->
				<article v-if="tab === 'social'" class="col-span-2 border-r border-l h-full">
					<h2
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="border-b-2 text-xl bold font-bold"
						style="padding: 12px 0px 10px 16px"
					>
						Social Links
					</h2>
					<div class="p-5">
						<p :class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'">
							Link your social media accounts:
						</p>
						<VerifySocial platform="twitter" class="my-5" />
						<VerifySocial platform="github" class="my-5" />
						<p
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
							class="py-5 border-t"
						>
							Link your professional account:
						</p>
						<VerifySocial platform="website" class="mb-5 mb-5" />
						<!-- Submit button -->
						<button
							:class="hasChanged() ? '' : 'opacity-50'"
							class="bg-primary text-white rounded-lg focus:outline-none"
							style="width: 128px; height: 40px; margin-left: 350px; margin-top: 25px"
							@click="updateSettings"
						>
							Save Changes
						</button>
					</div>
				</article>
				<!-- Advanced -->
				<article v-if="tab === 'advanced'" class="col-span-2 border-r border-l h-full">
					<h2
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="border-b-2 text-xl bold font-bold"
						style="padding: 12px 0px 10px 16px"
					>
						Advanced Config
					</h2>
					<div class="p-5">
						<p :class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'">
							Preferred OrbitDB Node URL:
						</p>
						<label for="nodeURL" class="hidden">Preferred OrbitDB Node URL</label>
						<input
							id="nodeURL"
							v-model="nodeURL"
							type="text"
							:placeholder="$store.state.nodeURL"
							:class="
								$store.state.settings.darkMode
									? 'bg-lightBG text-lightSecondaryText focus:border-lightActive'
									: 'bg-darkBG text-darkSecondaryText focus:border-darkActive'
							"
							class="focus:outline-none border-2 w-full my-2 focus:border-primary py-2 px-4 rounded-xl"
						/>

						<!-- Submit button -->
						<button
							:class="hasChanged() ? '' : 'opacity-50'"
							class="bg-primary text-white rounded-lg focus:outline-none"
							style="width: 128px; height: 40px; margin-left: 350px; margin-top: 25px"
							@click="updateSettings"
						>
							Save Changes
						</button>
					</div>
				</article>
				<!-- Display Themes -->
				<!-- <article v-if="tab === 'display'" class="col-span-2 border-r border-l h-full">
					<h2
						:class="$store.state.settings.darkMode ? 'text-lightPrimaryText' : 'text-darkPrimaryText'"
						class="border-b-2 text-xl bold font-bold"
						style="padding: 12px 0px 10px 16px"
					>
						Choose a Theme
					</h2>
					<div class="flex items-center">
						<p
							class="m-4"
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						>
							Toggle {{ $store.state.settings.darkMode ? 'night' : 'day' }} mode:
						</p>
						<ColorMode class="text-5xl" />
					</div>
					<div class="flex items-center">
						<p
							class="m-4"
							:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
						>
							Auto-detect dark mode:
						</p>
					</div>
				</article> -->
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import imageCompression from 'browser-image-compression'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'
import ChevronRight from '@/components/icons/ChevronRight.vue'
import UploadAvatar from '@/components/icons/UploadAvatar.vue'
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
	bio: string
	maxCharBio: number
	tab: string
}

export default Vue.extend({
	components: {
		VerifySocial: () => import(`@/components/VerifySocial.vue`),
		ChevronRight,
		UploadAvatar,
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
			bio: this.$store.state.session.bio,
			maxCharBio: 256,
			tab: `account`,
		}
	},
	created() {
		if (this.$store.state.session.avatar !== ``) {
			getPhotoFromIPFS(this.$store.state.session.avatar).then((p) => {
				this.profilePic = p
			})
		}
		// Check for dark mode
		const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches
		if (prefersDarkMode) {
			this.$store.commit(`settings/changeDarkMode`, this.$store.state.settings.darkMode)
		}
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeID: MutationType.CHANGE_ID,
			changeName: MutationType.CHANGE_NAME,
			changeEmail: MutationType.CHANGE_EMAIL,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		getStyles(t: string): string {
			let styles: string = ``
			// Dark mode AND selected tab
			if (t === this.tab && this.$store.state.settings.darkMode) {
				styles += `bg-neutralLightest border-primary`
			} else if (t === this.tab && !this.$store.state.settings.darkMode) {
				styles += `bg-lightButtonBG`
			}
			return styles
		},
		isActiveTab(t: string) {
			return t === this.tab
		},
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
		changeTab(tab: string) {
			this.tab = tab
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
					alert(err)
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
				alert(`Nothing to update!`)
				return
			}
			// Run quality rules before saving
			if (this.newName !== ``) {
				if (this.newName.length < 2 || this.newName.length > 32) {
					alert(`Invalid name length`)
					return
				} else {
					this.changeName(this.newName.trim())
				}
			}
			if (this.newID !== `` && this.$qualityID(this.newID)) {
				if (this.newID.length < 2 || this.newID.length > 18) {
					alert(`Invalid ID length`)
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
			if (this.nodeURL !== this.$store.state.session.nodeURL) {
				if (!/((http|https?):\/\/)?(www\.)?[a-z0-9\-.]{3,}\.[a-z]{3}$/.test(this.nodeURL)) {
					alert(`Invalid URL.`)
					return
				} else {
					this.$store.commit(`changeNodeURL`, this.nodeURL)
				}
			}
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				alert(`Settings updated!`)
				this.$router.push(`/` + this.$store.state.session.id)
			}
		},
	},
})
</script>
