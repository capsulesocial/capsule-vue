<template>
	<article>
		<p class="text-gray7 dark:text-gray3 text-center">
			Here is your Blogchain private key file. Download this file in a safe spot. You will need it to access your
			account. To download your Blogchain private key again, visit the Settings page
		</p>
		<div class="bg-gray2 dark:bg-gray7 my-10 rounded-lg p-4">
			<!-- Optional encryption -->
			<div class="flex flex-row justify-between my-4">
				<label for="encryptButton" class="text-gray7 dark:text-gray3"
					>Add an optional password to encrypt your private key</label
				>
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
		<nuxt-link v-if="hasDownloadedKey" to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
		<!-- Encrypt password popup -->
		<portal v-if="showEncryptedInput" to="registerPage">
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
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import FileDownloadIcon from '@/components/icons/FileDownload.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import CloseIcon from '@/components/icons/X.vue'

import { getNearPrivateKey } from '@/backend/near'

interface IData {
	hasDownloadedKey: boolean
	encrypted: boolean
	showEncryptedInput: boolean
	encryptedPassword: string
}

export default Vue.extend({
	components: {
		FileDownloadIcon,
		BrandedButton,
		CloseIcon,
	},
	props: {
		accountId: {
			type: String,
			required: true,
		},
		username: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			hasDownloadedKey: false,
			encrypted: false,
			showEncryptedInput: false,
			encryptedPassword: ``,
		}
	},
	methods: {
		toggleEncrypted() {
			this.encrypted = !this.encrypted
			if (this.encrypted) {
				this.showEncryptedInput = true
			}
		},
		encryptKey() {
			const pw = this.$refs.encryptedPassword as HTMLInputElement
			this.encryptedPassword = pw.value
			this.showEncryptedInput = false
		},
		async downloadPrivateKey(): Promise<void> {
			try {
				if (!this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				if (this.encrypted) {
					// TODO: encrypt password
					console.log(`encrypting with password: `, this.encryptedPassword)
				}
				const privateKey = await getNearPrivateKey(this.accountId)
				const blob = new Blob([JSON.stringify({ accountId: this.accountId, privateKey })], { type: `application/json` })
				const link = document.createElement(`a`)
				link.href = URL.createObjectURL(blob)
				link.download = `blogchain-priv-key-${this.username}.json`
				link.click()
				URL.revokeObjectURL(link.href)
				this.$toastSuccess(`Downloaded Blogchain private key`)
				this.hasDownloadedKey = true
			} catch (error) {
				this.$handleError(error)
			}
		},
	},
})
</script>
