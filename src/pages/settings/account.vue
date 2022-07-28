<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<!-- Account Security -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Security</h3>
		<!-- ID -->
		<div class="mb-4 flex w-full flex-row items-center">
			<label for="id" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Identifier</label>
			<input
				id="id"
				type="text"
				:placeholder="$store.state.session.id"
				class="cursor-not-allowed bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 flex-grow rounded-lg px-2 py-1"
				disabled
			/>
		</div>
		<!-- Export Private Key -->
		<div class="mb-8 flex w-full flex-row items-start">
			<h6 class="w-48 flex-shrink-0 font-semibold text-gray5 dark:text-gray3 text-sm">Blogchain private key</h6>
			<div class="bg-gray1 dark:bg-gray7 rounded-lg pt-4 pb-5 px-6 w-full">
				<!-- Optional encryption -->
				<div class="flex flex-row justify-between mb-6">
					<label for="encryptButton" class="text-gray7 dark:text-gray3 w-4/5">
						Export my private key with a password:
					</label>
					<BasicSwitch
						:enabled="encrypted"
						:class="[encrypted ? 'bg-primary' : 'bg-gray2 dark:bg-gray7']"
						@toggle="toggleEncrypted"
					/>
				</div>
				<div class="flex flex-col sm:flex-row items-center justify-between">
					<div class="flex flex-row items-center">
						<FileDownloadIcon class="text-primary" />
						<div>
							<h6 class="text-gray pl-4 text-lg font-semibold dark:text-darkPrimaryText">Blogchain Private Key</h6>
							<p v-if="encrypted" class="text-xs text-primary pl-4">Encrypted</p>
						</div>
					</div>
					<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
				</div>
			</div>
		</div>
		<!-- Encrypt password popup -->
		<portal v-if="showEncryptedInput" to="settingsLayout">
			<div
				class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
				@click.self="showEncryptedInput = false"
			>
				<!-- Container -->
				<div
					class="w-full lg:w-600 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
				>
					<div class="flex flex-row justify-between items-center">
						<!-- title, close button -->
						<h2 class="text-xl font-semibold">Encrypt your private key</h2>
						<button
							class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full p-1"
							@click="showEncryptedInput = false"
						>
							<CloseIcon />
						</button>
					</div>
					<p class="mt-4 mb-6 text-gray5 dark:text-gray3">
						Add a password to encrypt your private key as an additional security precaution. Your private key password
						cannot be changed or recovered and will be required on login. Once logged in, you can re-encrypt your
						private key with a new password in the Settings page
					</p>
					<div class="relative w-full bg-gray2 dark:bg-gray7 rounded-lg px-4 py-3">
						<input
							ref="encryptedPassword"
							v-model="encryptedPassword"
							:type="seePassword ? `text` : `password`"
							class="w-full focus:outline-none bg-transparent"
							placeholder="Enter password"
						/>
						<button class="absolute" style="right: 1rem; top: 1.1rem" @click="seePassword = !seePassword">
							<EyeIcon />
						</button>
					</div>
					<div class="flex justify-end mt-8">
						<BrandedButton
							:action="encryptKey"
							:text="`Encrypt`"
							:class="encryptedPassword === `` ? `opacity-50 cursor-not-allowed` : ``"
							:disabled="encryptedPassword === ``"
						/>
					</div>
				</div>
			</div>
		</portal>
		<!-- Account Profile -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Profile</h3>
		<div class="mb-8 flex w-full flex-row items-center justify-between xl:justify-start">
			<label for="editProfile" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Public Profile</label>
			<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="redirectProfile">
				<PencilIcon class="m-2 h-5 w-5 text-white" />
			</button>
			<SecondaryButton :text="`Edit Profile`" :action="redirectProfile" class="hidden xl:block" />
		</div>
		<!-- Account Data -->
		<!-- <h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Data</h2>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Your Blogchain data</h3>
			<button class="text-primary focus:outline-none">Request a download of your Blogchain data</button>
		</div>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Deactivate My Account</h3>
			<button class="text-negative focus:outline-none">Deactivate my Blogchain Account</button>
		</div> -->
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile } from '@/backend/profile'
import { getNearPrivateKey } from '@/backend/near'
import { getEncryptedPrivateKey } from '@/backend/privateKey'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import FileDownloadIcon from '@/components/icons/FileDownload.vue'
import CloseIcon from '@/components/icons/X.vue'
import EyeIcon from '@/components/icons/Preview.vue'
import BasicSwitch from '@/components/BasicSwitch.vue'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	encrypted: boolean
	showEncryptedInput: boolean
	encryptedPassword: string
	encryptionKey: string
	seePassword: boolean
}

export default Vue.extend({
	components: {
		ChevronLeft,
		PencilIcon,
		FileDownloadIcon,
		CloseIcon,
		BasicSwitch,
		EyeIcon,
	},
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			encrypted: false,
			showEncryptedInput: false,
			encryptedPassword: ``,
			encryptionKey: ``,
			seePassword: false,
		}
	},
	head() {
		return {
			title: `Account Settings - Blogchain`,
			meta: [{ hid: `settings-account`, name: `settings-account`, content: `Account settings on Blogchain` }],
		}
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeName: MutationType.CHANGE_NAME,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		toggleEncrypted() {
			if (this.encryptionKey !== ``) {
				this.encrypted = false
				this.encryptedPassword = ``
				this.encryptionKey = ``
			} else {
				this.showEncryptedInput = !this.showEncryptedInput
			}
		},
		encryptKey() {
			this.encryptionKey = this.encryptedPassword
			this.showEncryptedInput = false
			this.encrypted = true
		},
		async downloadPrivateKey(): Promise<void> {
			try {
				const accountId = window.localStorage.getItem(`accountId`)
				if (!accountId) {
					this.$toastError(`Account not found, are you signed in?`)
					return
				}
				const privateKey = this.encrypted
					? await getEncryptedPrivateKey(this.encryptionKey)
					: await getNearPrivateKey(accountId)
				const blob = new Blob([JSON.stringify({ accountId, privateKey })], { type: `application/json` })
				const link = document.createElement(`a`)
				link.href = URL.createObjectURL(blob)
				link.download = `blogchain-priv-key-${this.$store.state.session.id}.json`
				link.click()
				URL.revokeObjectURL(link.href)
				this.$toastSuccess(`Downloaded Blogchain private key`)
			} catch (error) {
				this.$handleError(error)
			}
		},
		async updateProfile() {
			const backendProfile = getProfileFromSession(this.$store.state.session)
			const cid = await setProfile(backendProfile)
			this.changeCID(cid)
			return true
		},
		async updateSettings() {
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				this.$toastSuccess(`Your settings has been successfully updated`)
			}
		},
		checkAvailablity(exp: number, used: boolean) {
			if (used) {
				return `used`
			}

			const now = Date.now()
			if (exp < now) {
				return `exp`
			}

			return `valid`
		},
		redirectProfile() {
			this.$store.commit(`settings/setRecentlyInSettings`, true)
			this.$router.push(`/id/` + this.$store.state.session.id)
		},
	},
})
</script>
