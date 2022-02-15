<template>
	<article>
		<p class="text-gray7 text-center">
			Here is your Capsule private key file. Download this file in a safe spot. You will need it to access your account.
			To download your Capsule private keys again, visit the Settings page
		</p>
		<div class="bg-gray1 my-10 flex items-center justify-between rounded-lg p-4">
			<div class="flex flex-row items-center">
				<FileDownloadIcon />
				<h6 class="text-gray pl-4 text-lg font-semibold">Capsule Private Key</h6>
			</div>
			<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
		</div>
		<nuxt-link v-if="hasDownloadedKey" to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'

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
			type: String as PropType<string>,
			required: true,
		},
		aid: {
			type: String as PropType<string>,
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
			if (!this.accountId) {
				throw new Error(`Unexpected condition!`)
			}
			const privateKey = await getNearPrivateKey(this.accountId)
			const blob = new Blob([JSON.stringify({ accountId: this.accountId, privateKey })], { type: `application/json` })
			const link = document.createElement(`a`)
			link.href = URL.createObjectURL(blob)
			link.download = `capsule-priv-key-${this.aid}`
			link.click()
			URL.revokeObjectURL(link.href)
			this.$toastSuccess(`Downloaded Capsule private key`)
			this.hasDownloadedKey = true
		},
	},
})
</script>
