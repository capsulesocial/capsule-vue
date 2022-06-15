<template>
	<article>
		<h1 class="text-lightPrimaryText dark:text-gray1 text-4xl font-bold">Sign up</h1>
		<!-- Enter phone number -->
		<div v-show="!otpSent">
			<p class="text-gray7 dark:text-gray3 my-10 text-center">
				Verify you’re a human with your phone number so that Blogchain can fund your wallet. This is the last step
				needed to create your Blogchain account.
			</p>
			<label for="phoneNumber" class="text-gray5 dark:text-gray3 block pb-1 text-sm font-semibold">Phone Number</label>
			<input
				id="phoneNumber"
				v-model="phoneNumber"
				type="tel"
				class="focus:outline-none focus:border-primary text-primary dark:text-darkPrimaryText bg-gray2 dark:bg-gray7 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
			/>
			<div class="flex w-full justify-end mt-4">
				<BrandedButton :text="otpSent ? `Re-send code` : `Send Code`" :action="sendOTP" />
			</div>
		</div>
		<!-- Enter SMS code to complete verify -->
		<div v-show="otpSent" class="mt-10">
			<label for="otp" class="text-gray5 dark:text-gray3 block pb-1 text-sm font-semibold"
				>Enter the one-time verification code sent to your phone number.</label
			>
			<input
				id="otp"
				v-model="otp"
				type="text"
				placeholder=""
				class="focus:outline-none focus:border-primary text-primary dark:text-darkPrimaryText bg-gray2 dark:bg-gray7 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
			/>
			<BrandedButton v-show="!isLoading" :text="`Verify`" class="w-full" :action="validateOTP" />
			<h6 v-show="isLoading" class="text-primary text-center">Verifying...</h6>
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
import intlTelInput from 'intl-tel-input'
import { AxiosError } from 'axios'

import BrandedButton from '@/components/BrandedButton.vue'
import { requestOTP, requestOnboard, waitForFunds } from '@/backend/funder'

interface IData {
	otp: string
	otpSent: boolean
	iti: null | intlTelInput.Plugin
	phoneNumber: string
	inputCode: string
	isLoading: boolean
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
			iti: null,
			phoneNumber: ``,
			inputCode: ``,
			isLoading: false,
		}
	},
	mounted() {
		const input = document.querySelector(`#phoneNumber`)
		if (input) {
			this.iti = intlTelInput(input, {
				utilsScript: require(`intl-tel-input/build/js/utils`),
				// any initialisation options go here
			})
		}
	},
	methods: {
		async sendOTP() {
			if (this.iti === null) {
				return
			}
			this.phoneNumber = this.iti.getNumber()
			if (!this.iti.isValidNumber()) {
				this.$toastError(`Invalid phone number`)
				return
			}
			await requestOTP(this.phoneNumber)
			this.otpSent = true
			this.$toastSuccess(
				`If you haven't used this phone number before on Blogchain, you'll receive a code on your phone`,
			)
		},
		async validateOTP() {
			this.isLoading = true
			try {
				if (this.otp.length !== 6) {
					this.$toastError(`OTP should have 6 digits`)
					this.isLoading = false
					return
				}
				if (!this.accountId) {
					this.isLoading = false
					return
				}
				await requestOnboard(this.phoneNumber, this.otp, this.accountId)
				const { balance } = await waitForFunds(this.accountId)
				this.$emit(`updateFunds`, balance)
			} catch (err: any) {
				this.isLoading = false
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
