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
			v-show="!isLoading"
			id="hcaptcha"
			:data-sitekey="siteKey"
			data-size="invisible"
			style="padding: 0.6rem 1.7rem"
			class="h-captcha w-full bg-primary text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
			@click="handleRegisterID"
		>
			<span class="font-sans" style="font-size: 0.95rem"> Sign Up </span>
		</button>
		<h6 v-show="isLoading" class="text-primary text-center">Checking ID...</h6>
		<div v-show="!hasEnoughFunds()">
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">
				Ensure that the NEAR account with ID: "{{ userInfo.accountId }}" has sufficient funds before signing up.
			</p>
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">Available funds: {{ funds }} yN</p>
			<BrandedButton :text="`Re-check funds`" class="w-full" :action="() => $emit(`checkFunds`)" />
		</div>
	</article>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapMutations } from 'vuex'

import BrandedButton from '@/components/BrandedButton.vue'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { ValidationError } from '@/errors'
import { IWalletStatus } from '@/backend/auth'
import { hasSufficientFunds, requestOnboard, waitForFunds } from '@/backend/funder'
import { validateUsernameNEAR } from '@/backend/near'
import { hcaptchaSiteKey } from '@/backend/utilities/config'

interface IData {
	id: string
	isLoading: boolean
	siteKey: string
}

export default Vue.extend({
	components: {
		BrandedButton,
	},
	props: {
		onboarded: {
			type: Boolean,
			required: true,
		},
		funds: {
			type: String,
			required: true,
		},
		userInfo: {
			type: Object as PropType<IWalletStatus>,
			required: true,
		},
		accountId: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			id: ``,
			isLoading: false,
			siteKey: hcaptchaSiteKey,
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
				this.isLoading = true
				this.id = this.id.toLowerCase()
				const idValidity = await validateUsernameNEAR(this.id)
				if (idValidity.error) {
					this.isLoading = false
					throw new ValidationError(idValidity.error)
				}
				console.log(`success!`)
				const res = await hcaptcha.execute(undefined, { async: true })
				if (!res) {
					throw new Error(`Issue on captcha`)
				}
				console.log(res.response, this.accountId)
				await requestOnboard(res.response, this.accountId)
				const { balance } = await waitForFunds(this.accountId)
				this.$emit(`setIsOnboarded`, true)
				this.$emit(`updateFunds`, balance)
				this.$emit(`verify`, this.id)
			} catch (error) {
				console.log(error)
				this.$handleError(error)
			} finally {
				console.log(`test`)
				this.isLoading = false
			}
		},
		hasEnoughFunds(): boolean {
			return hasSufficientFunds(this.funds)
		},
	},
})
</script>
