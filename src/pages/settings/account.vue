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
		<div class="mb-8 flex w-full flex-row items-center">
			<h6 class="w-48 flex-shrink-0 font-semibold text-gray5 dark:text-gray3 text-sm">Blogchain private key</h6>
			<div class="bg-gray2 dark:bg-gray7 my-10 rounded-lg p-4 w-full">
				<!-- Optional encryption -->
				<div class="flex flex-row justify-between my-4">
					<label for="encryptButton" class="text-gray7 dark:text-gray3">Export my private key with a password</label>
					<div
						class="relative w-14 h-7 transition duration-500 ease-in-out rounded-full cursor-pointer"
						:class="[encrypted ? 'bg-neutral' : 'bg-gray1 dark:bg-gray7']"
						@click="toggleEncrypted"
					>
						<label
							class="absolute left-0 w-7 h-7 mb-2 transition duration-300 ease-in-out transform bg-lightBG dark:bg-darkBG border-2 rounded-full flex justify-center items-center"
							:class="[encrypted ? 'translate-x-full border-neutral' : 'translate-x-0 border-gray1 dark:border-gray7']"
						>
						</label>
						<input id="encryptButton" type="checkbox" class="w-full h-full appearance-none focus:outline-none" />
					</div>
				</div>
				<div class="flex flex-col sm:flex-row items-center justify-between">
					<div class="flex flex-row items-center">
						<FileDownloadIcon />
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
					class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg p-6 pt-4 shadow-lg"
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
					<p>
						Add a password to encrypt your private key as an additional security precaution. Your password cannot be
						changed or recovered and will be required on login. Once logged in, you can re-encrypt your private key with
						a new password in the Settings page
					</p>
					<input
						ref="encryptedPassword"
						type="password"
						class="w-full bg-gray2 dark:bg-gray7 my-10 rounded-lg p-4"
						placeholder="Enter password"
					/>
					<BrandedButton :action="encryptKey" :text="`Encrypt`" />
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
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import FileDownloadIcon from '@/components/icons/FileDownload.vue'
import CloseIcon from '@/components/icons/X.vue'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	encrypted: boolean
	showEncryptedInput: boolean
	encryptionKey: string
}

export default Vue.extend({
	components: {
		ChevronLeft,
		PencilIcon,
		FileDownloadIcon,
		CloseIcon,
	},
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			encrypted: false,
			showEncryptedInput: false,
			encryptionKey: ``,
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
			this.encrypted = !this.encrypted
			if (this.encrypted) {
				this.showEncryptedInput = true
			}
		},
		encryptKey() {
			const pw = this.$refs.encryptedPassword as HTMLInputElement
			this.encryptionKey = pw.value
			this.showEncryptedInput = false
		},
		async downloadPrivateKey(): Promise<void> {
			try {
				const accountId = window.localStorage.getItem(`accountId`)
				if (!accountId) {
					this.$toastError(`Account not found, are you signed in?`)
					return
				}
				if (this.encrypted) {
					// TODO: encrypt password
					console.log(`encrypting with password: `, this.encryptionKey)
				}
				const privateKey = await getNearPrivateKey(accountId)
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
