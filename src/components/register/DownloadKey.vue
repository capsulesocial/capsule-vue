<template>
	<article>
		<p class="text-gray7 dark:text-gray3 text-center">
			Here is your Blogchain private key file. Download this file in a safe spot. You will need it to access your
			account. To download your Blogchain private key again, visit the Settings page
		</p>
		<div class="bg-gray2 dark:bg-gray7 my-10 flex items-center justify-between rounded-lg p-4">
			<div class="flex flex-row items-center">
				<FileDownloadIcon />
				<h6 class="text-gray pl-4 text-lg font-semibold dark:text-darkPrimaryText">Blogchain Private Key</h6>
			</div>
			<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
		</div>
		<nuxt-link v-if="hasDownloadedKey" to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import FileDownloadIcon from '@/components/icons/FileDownload.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { getNearPrivateKey } from '@/backend/near'

interface IData {
	hasDownloadedKey: boolean
}

export default Vue.extend({
	components: {
		FileDownloadIcon,
		BrandedButton,
	},
	props: {
		accountId: {
			type: String,
			required: true,
		},
		aid: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			hasDownloadedKey: false,
		}
	},
	methods: {
		async downloadPrivateKey(): Promise<void> {
			try {
				if (!this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				const privateKey = await getNearPrivateKey(this.accountId)
				const blob = new Blob([JSON.stringify({ accountId: this.accountId, privateKey })], { type: `application/json` })
				const link = document.createElement(`a`)
				link.href = URL.createObjectURL(blob)
				link.download = `blogchain-priv-key-${this.aid}`
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
