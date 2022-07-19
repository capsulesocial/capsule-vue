<template>
	<article>
		<h1 class="text-lightPrimaryText dark:text-gray1 text-4xl font-bold">Sign up</h1>
		<label for="id" class="text-gray5 dark:text-gray3 block pb-1 text-sm font-semibold"
			>Pick your Blogchain username</label
		>
		<input
			id="id"
			v-model="id"
			type="text"
			placeholder=""
			class="focus:outline-none focus:border-primary text-primary dark:text-darkPrimaryText bg-gray2 dark:bg-gray7 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
		/>
		<!-- This is basically a BrandedButton -->
		<button
			v-if="loadingState === null"
			id="hcaptcha"
			:data-sitekey="siteKey"
			data-size="invisible"
			style="padding: 0.6rem 1.7rem"
			class="h-captcha w-full bg-primary text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
			@click="handleRegisterID"
		>
			<span class="font-sans" style="font-size: 0.95rem"> Sign Up </span>
		</button>
		<h6 v-else-if="loadingState === 'checking_id'" class="text-primary text-center">Checking ID...</h6>
		<h6 v-else-if="loadingState === 'hcaptcha_loading'" class="text-primary text-center">Verifying humanity...</h6>
		<h6 v-else-if="loadingState === 'smart_contract'" class="text-primary text-center">Executing smart contract...</h6>
		<h6 v-else-if="loadingState === 'transfer_funds'" class="text-primary text-center">Waiting for funds...</h6>
		<!-- <div v-show="!hasEnoughFunds()">
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">
				Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
			</p>
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">Available funds: {{ funds }} yN</p>
			<BrandedButton :text="`Re-check funds`" class="w-full" :action="() => $emit(`checkFunds`)" />
		</div> -->
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { ValidationError } from '@/errors'
import { requestOnboard, waitForFunds } from '@/backend/funder'
import { validateUsernameNEAR } from '@/backend/near'
import { hcaptchaSiteKey } from '@/backend/utilities/config'

interface IData {
	id: string
	siteKey: string
	loadingState: `checking_id` | `hcaptcha_loading` | `smart_contract` | `transfer_funds` | null
}

export default Vue.extend({
	props: {
		accountId: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			id: ``,
			siteKey: hcaptchaSiteKey,
			loadingState: null,
		}
	},
	head() {
		return {
			script: [{ src: `https://js.hcaptcha.com/1/api.js`, defer: true, async: true }],
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
		async handleRegisterID() {
			try {
				this.loadingState = `checking_id`
				this.id = this.id.toLowerCase()
				const idValidity = await validateUsernameNEAR(this.id)
				if (idValidity.error) {
					this.loadingState = null
					throw new ValidationError(idValidity.error)
				}
				this.loadingState = `hcaptcha_loading`
				const res = await hcaptcha.execute(undefined, { async: true })
				if (!res) {
					this.loadingState = null
					throw new Error(`Issue on captcha`)
				}
				this.loadingState = `smart_contract`
				await requestOnboard(res.response, this.accountId)
				this.loadingState = `transfer_funds`
				await waitForFunds(this.accountId)
				this.loadingState = null
				this.$emit(`verify`, this.id)
			} catch (error) {
				this.$handleError(error)
			} finally {
				this.loadingState = null
			}
		},
	},
})
</script>
