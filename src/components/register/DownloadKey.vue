<template>
	<article>
		<p class="text-gray5 dark:text-gray3 text-center">
			Here is your Blogchain private key file. Download this file in a safe spot. You will need it to access your
			account. To download your Blogchain private key again, visit the Settings page
		</p>
		<div class="bg-lightBorder dark:bg-gray7 my-10 rounded-lg pt-4 pb-5 px-6">
			<!-- Optional encryption -->
			<div class="flex flex-row justify-between items-center mb-6">
				<label for="encryptButton" class="text-gray7 dark:text-gray3 w-4/5">
					Add an optional password to encrypt your private key:
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
		<nuxt-link v-if="hasDownloadedKey" to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
		<!-- Encrypt password popup -->
		<portal v-if="showEncryptedInput" to="registerPage">
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
					<p class="mt-4 text-gray5 dark:text-gray3">
						Add a password to encrypt your private key as an additional security precaution. Your private key password
						cannot be changed or recovered and will be required on login. Once logged in, you can re-encrypt your
						private key with a new password in the Settings page
					</p>
					<input
						ref="encryptedPassword"
						v-model="encryptedPassword"
						type="password"
						class="w-full bg-gray2 dark:bg-gray7 mt-6 rounded-lg px-4 py-3 focus:outline-none"
						placeholder="Enter password"
					/>
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
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import FileDownloadIcon from '@/components/icons/FileDownload.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import CloseIcon from '@/components/icons/X.vue'
import BasicSwitch from '@/components/BasicSwitch.vue'

import { getNearPrivateKey } from '@/backend/near'
import { getEncryptedPrivateKey } from '@/backend/privateKey'

interface IData {
	hasDownloadedKey: boolean
	encrypted: boolean
	showEncryptedInput: boolean
	encryptedPassword: string
	encryptionKey: string
}

export default Vue.extend({
	components: {
		FileDownloadIcon,
		BrandedButton,
		CloseIcon,
		BasicSwitch,
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
			encryptionKey: ``,
		}
	},
	methods: {
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
				if (!this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				const privateKey = this.encrypted
					? await getEncryptedPrivateKey(this.encryptionKey)
					: await getNearPrivateKey(this.accountId)
				const blob = new Blob([JSON.stringify({ accountId: this.accountId, privateKey })], {
					type: `application/json`,
				})
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
