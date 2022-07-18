<template>
	<article>
		<h1 class="text-lightPrimaryText dark:text-gray1 text-4xl font-bold">Sign up</h1>
		<!-- Enter phone number -->
		<div v-show="!otpSent">
			<p class="text-gray7 dark:text-gray3 my-10 text-center">
				Verify you’re a human so that Blogchain can fund your wallet.
			</p>
			<BrandedButton class="h-captcha" :action="captchaTrigger" data-sitekey="eb37fbb9-2e3e-48b2-8ef6-995d3d93348d" />
		</div>
		<!-- Enter SMS code to complete verify -->
		<div v-show="otpSent" class="mt-10">
			<h6 v-show="isLoading" class="text-primary text-center">Verifying...</h6>
			<h6 v-show="waitingForFunds" class="text-primary text-center">Executing smart contract...</h6>
		</div>
		<p v-show="otpSent" class="text-gray7 dark:text-gray2 mt-10 text-center text-sm">
			Didn't receive a code?
			<button class="text-primary font-bold" @click="otpSent = false">
				Check your phone number and request a new one
			</button>
		</p>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import { AxiosError } from 'axios'
import { requestOTP, requestOnboard, waitForFunds } from '@/backend/funder'
import BrandedButton from '@/components/BrandedButton.vue'
interface IData {
	otp: string
	otpSent: boolean
	inputCode: string
	isLoading: boolean
	waitingForFunds: boolean
}

export default Vue.extend({
	components: {
		BrandedButton,
	},
	props: {
		accountId: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			otp: ``,
			otpSent: false,
			inputCode: ``,
			isLoading: false,
			waitingForFunds: false,
		}
	},
	methods: {
		async captchaTrigger() {
			try {
				console.log(`success!`)
				const res = await hcaptcha.execute(undefined, { async: true })
				console.log(res)
			} catch (err: any) {
				console.log(err)
			}
		},
		async sendOTP() {
			this.isLoading = true
			await requestOTP(`test`)
			this.otpSent = true
			this.$toastSuccess(
				`If you haven't used this phone number before on Blogchain, you'll receive a code on your phone`,
			)
			this.isLoading = false
		},
		async validateOTP() {
			try {
				if (this.otp.length !== 6) {
					this.$toastError(`OTP should have 6 digits`)
					return
				}
				if (!this.accountId) {
					return
				}
				this.isLoading = true
				await requestOnboard(`test`, this.otp, this.accountId)
				this.isLoading = false
				this.waitingForFunds = true
				const { balance } = await waitForFunds(this.accountId)
				this.waitingForFunds = false
				this.$emit(`setIsOnboarded`, true)
				this.$emit(`updateFunds`, balance)
			} catch (err: any) {
				this.isLoading = false
				this.waitingForFunds = false
				if (err instanceof AxiosError && err.response) {
					this.otp = ``
					this.$toastError(err.response.data.error)
					return
				}
				this.$toastError(err.message)
				throw err
			}
		},
	},
})
</script>
<style>
.iti {
	width: 100%;
}
</style>
