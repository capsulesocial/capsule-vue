<template>
	<article>
		<h1 class="text-primary text-4xl font-bold">Sign up</h1>
		<!-- Phone verification -->
		<div v-if="!hasEnoughFunds()">
			<!-- Enter phone number -->
			<div v-if="!otpSent">
				<p class="text-gray7 my-10 text-center">
					Verify you’re a human with your phone number so that Capsule can fund your wallet. This is the last step
					needed to create your Capsule account.
				</p>
				<label for="id" class="text-gray5 block pb-1 text-sm font-semibold">Phone Number</label>
				<input
					id="phoneNumber"
					v-model="phoneNumber"
					type="tel"
					class="focus:outline-none focus:border-primary text-primary bg-gray2 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
				/>
				<div class="flex w-full justify-end">
					<BrandedButton :text="`Send Code`" :action="sendOTP" />
				</div>
				<p class="text-gray7 mt-10 text-center text-sm">
					Already have a funded wallet? <button class="text-primary font-bold">Connect to NEAR</button>
				</p>
			</div>
			<!-- Enter SMS code to complete verify -->
			<div v-else>
				<label for="id" class="text-gray5 block pb-1 text-sm font-semibold"
					>Enter the one-time verification code sent to your phone number.</label
				>
				<input
					id="otp"
					v-model="otp"
					type="text"
					placeholder=""
					class="focus:outline-none focus:border-primary text-primary bg-gray2 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
				/>
				<BrandedButton :text="`Verify`" class="w-full" :action="validateOTP" />
			</div>
		</div>
		<!-- Choose an ID -->
		<div v-else>
			<label for="id" class="text-gray5 block pb-1 text-sm font-semibold">Pick your Capsule name</label>
			<input
				id="id"
				v-model="id"
				type="text"
				placeholder=""
				class="focus:outline-none focus:border-primary text-primary bg-gray2 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
			/>
			<BrandedButton v-show="!isLoading" :text="`Sign Up`" :action="handleRegisterID" class="w-full" />
			<article>
				<p class="justify-between p-5 font-sans text-sm text-gray-600">
					Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
				</p>
				<p class="justify-between p-5 font-sans text-sm text-gray-600">Available funds: {{ funds }} yN</p>
				<BrandedButton :text="`Re-check funds`" class="w-full" :action="checkFunds" />
			</article>
		</div>
	</article>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import intlTelInput from 'intl-tel-input'
import axios from 'axios'

import BrandedButton from '@/components/BrandedButton.vue'
import { requestOTP, requestSponsor, waitForFunds, hasSufficientFunds } from '@/backend/funder'

interface IData {
	otp: string
	otpSent: boolean
	iti: any
	phoneNumber: string
	inputCode: string
	id: string
	isLoading: boolean
}

export default Vue.extend({
	components: {
		BrandedButton,
	},
	props: {
		accountId: {
			type: String as PropType<string>,
			required: true,
		},
		checkFunds: {
			type: Function as PropType<() => void>,
			required: true,
		},
		funds: {
			type: String as PropType<string>,
			required: true,
		},
		verify: {
			type: Function as PropType<() => void>,
			required: true,
		},
		walletVerify: {
			type: Function as PropType<() => void>,
			required: true,
		},
		userInfo: {
			type: Object as PropType<Object>,
			default: null,
		},
	},
	data(): IData {
		return {
			otp: ``,
			otpSent: false,
			iti: null,
			phoneNumber: ``,
			inputCode: ``,
			id: ``,
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
		handleRegisterID() {
			this.isLoading = true
			this.id = this.id.toLowerCase()
			const idCheck = this.$qualityID(this.id)
			if (this.$isError(idCheck)) {
				this.$toastError(idCheck.error)
				this.isLoading = false
				return
			}
			this.$emit(`setID`, this.id)
			if (this.userInfo) {
				this.verify()
				return
			}
			this.walletVerify()
		},
		async sendOTP() {
			this.phoneNumber = this.iti.getNumber()
			if (!this.iti.isValidNumber()) {
				this.$toastError(`Invalid phone number`)
				return
			}
			await requestOTP(this.phoneNumber)
			this.otpSent = true
			const itiElements = document.getElementsByClassName(`iti`)
			while (itiElements.length > 0) {
				if (itiElements[0]) {
					itiElements[0].parentNode?.removeChild(itiElements[0])
				}
			}
		},
		async validateOTP() {
			if (this.otp.length !== 6) {
				this.$toastError(`OTP should have 6 digits`)
				return
			}
			if (!this.accountId) {
				return
			}
			try {
				await requestSponsor(this.phoneNumber, this.otp, this.accountId)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					this.otp = ``
					this.$toastError(err.response.data.error)
					return
				}
				throw err
			}
			const { error, balance } = await waitForFunds(this.accountId)
			if (error) {
				// TODO: Let the user repeat the process.
				this.$toastError(error)
				return
			}
			if (balance) {
				this.$emit(`updateFunds`, balance)
			}
		},
		hasEnoughFunds(): boolean {
			return hasSufficientFunds(this.funds)
		},
	},
})
</script>
