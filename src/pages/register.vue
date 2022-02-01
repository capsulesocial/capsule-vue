<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r xl:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex items-center justify-center" style="height: 86%">
			<div class="-mt-5 flex w-full flex-col items-center p-14">
				<!-- Step 0: Code redeem -->
				<InviteCode
					v-if="!hasInviteCode && !(userInfo || nearWallet)"
					class="w-full xl:w-1/2"
					@validInviteCode="validInviteCode"
				/>
				<!-- Step 1: Choose Login / register -->
				<RegisterMethods
					v-show="hasInviteCode && !(userInfo || nearWallet)"
					class="w-full xl:w-1/2"
					:checkFunds="checkFunds"
					:verify="verify"
					@setNearWallet="setNearWallet"
					@updateUserInfo="updateUserInfo"
					@updateAccountId="updateAccountId"
					@updateUsername="updateUsername"
				/>
				<!-- Step 2: Sign up -->
				<article v-show="!downloadKeyStep" class="w-full xl:w-1/2">
					<div v-show="(userInfo || nearWallet) && username === null">
						<h1 class="text-primary text-4xl font-bold">Sign up</h1>
						<article v-if="!hasSufficientFunds()">
							<!-- Step 2a: Verify Phone # -->
							<div v-if="!otpSent">
								<p class="text-gray7 my-10 text-center">
									Verify you’re a human with your phone number so that Capsule can fund your wallet. This is the last
									step needed to create your Capsule account.
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
							<div v-else>
								<!-- Enter SMS code to complete verify -->
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
						</article>
						<article v-else>
							<!-- Step 3: Choose an ID -->
							<label for="id" class="text-gray5 block pb-1 text-sm font-semibold">Pick your Capsule name</label>
							<input
								id="id"
								v-model="id"
								type="text"
								placeholder=""
								class="focus:outline-none focus:border-primary text-primary bg-gray2 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
							/>
							<BrandedButton :text="`Sign Up`" :action="userInfo ? verify : walletVerify" class="w-full" />
							<article>
								<p class="justify-between whitespace-nowrap p-5 font-sans text-sm text-gray-600">
									Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
								</p>
								<p class="justify-between whitespace-nowrap p-5 font-sans text-sm text-gray-600">
									Available funds: {{ funds }} yN
								</p>
								<BrandedButton :text="`Re-check funds`" class="w-full" :action="checkFunds" />
							</article>
						</article>
					</div>
				</article>
				<!-- Step 3: Download key -->
				<DownloadKey v-if="downloadKeyStep" :aid="id" :accountId="accountId" class="w-full xl:w-1/2" />
			</div>
		</section>
		<p class="text-gray5 px-4 pl-10 text-sm">© {{ currentYear }} Capsule Social, Inc.</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
// eslint-disable-next-line import/named
import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/customauth'
import 'intl-tel-input/build/css/intlTelInput.css'
import intlTelInput from 'intl-tel-input'
import axios from 'axios'

import InviteCode from '@/components/register/InviteCode.vue'
import DownloadKey from '@/components/register/DownloadKey.vue'
import RegisterMethods from '@/components/register/RegisterMethods.vue'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import BrandedButton from '@/components/BrandedButton.vue'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { login, register, registerNearWallet } from '@/backend/auth'
import {
	checkAccountStatus,
	getUsernameNEAR,
	getWalletConnection,
	removeNearPrivateKey,
	signedInToWallet,
	walletLogout,
} from '@/backend/near'
import { hasSufficientFunds, requestOTP, requestSponsor, waitForFunds } from '@/backend/funder'
import { verifyTokenAndOnboard } from '@/backend/invite'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	hasInviteCode: boolean
	inputCode: string
	phoneNumber: string
	otp: string
	otpSent: boolean
	funds: string
	iti: any
	nearWallet: boolean
	downloadKeyStep: boolean
	currentYear: string
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		BrandedButton,
		InviteCode,
		DownloadKey,
		RegisterMethods,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			phoneNumber: ``,
			otp: ``,
			torus: new DirectWebSdk({
				baseUrl: `${process.env.DOMAIN}/oauth`,
				network: `testnet`, // details for test net
			}),
			accountId: null,
			hasInviteCode: false,
			inputCode: ``,
			userInfo: null,
			username: undefined,
			otpSent: false,
			funds: `0`,
			iti: null,
			nearWallet: false,
			downloadKeyStep: false,
			currentYear: ``,
		}
	},
	head() {
		return {
			title: `Create an account on Capsule Social`,
			meta: [
				{ hid: `register`, name: `register`, content: `Create a Capsule Social account` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	async created() {
		await Promise.all([this.torus.init(), this.postWalletLogin()])
		this.nearWallet = this.isSignedInToWallet()
	},
	mounted() {
		const accountId = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountId) {
			this.$router.push(`/home`)
		}
		const input = document.querySelector(`#phoneNumber`)
		if (input) {
			this.iti = intlTelInput(input, {
				utilsScript: require(`intl-tel-input/build/js/utils`),
				// any initialisation options go here
			})
		}
		const theDate = new Date()
		this.currentYear = theDate.getFullYear().toString()
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
		updateUserInfo(userInfo: TorusLoginResponse): void {
			this.userInfo = userInfo
		},
		updateAccountId(accountId: string): void {
			this.accountId = accountId
		},
		updateUsername(username: string): void {
			this.username = username
		},
		validInviteCode() {
			this.hasInviteCode = true
		},
		setNearWallet() {
			this.nearWallet = true
		},
		hasSufficientFunds(): boolean {
			return hasSufficientFunds(this.funds)
		},
		async checkFunds() {
			const accountId = this.accountId
			if (!accountId) {
				return
			}
			const status = await checkAccountStatus(accountId)
			this.funds = status.balance
		},
		async postWalletLogin() {
			const walletConnection = getWalletConnection()
			this.accountId = walletConnection.getAccountId()
			if (!this.accountId) {
				return false
			}

			const [username] = await Promise.all([getUsernameNEAR(this.accountId), this.checkFunds(), this.onboardAccount()])
			this.username = username
			if (this.username) {
				this.$toastError(`You cannot login with wallet, please import your private key`)
				removeNearPrivateKey(this.accountId)
				walletLogout()
			}
			return true
		},
		isSignedInToWallet() {
			return signedInToWallet()
		},
		async sendOTP() {
			this.phoneNumber = this.iti.getNumber()
			if (!this.iti.isValidNumber()) {
				this.$toastError(`Invalid phone number`)
				return
			}
			await requestOTP(this.phoneNumber)
			this.otpSent = true
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
				this.funds = balance
			}
		},
		async loginOrRegister(privateKey: string) {
			if (this.username) {
				return login(this.username, privateKey)
			}
			const idCheck = this.$qualityID(this.id)
			if (this.$isError(idCheck)) {
				this.$toastError(idCheck.error)
				return null
			}
			this.id = this.id.toLowerCase()
			const registerResult = await register(this.id, privateKey)
			if (`error` in registerResult) {
				this.$toastError(registerResult.error)
				return null
			}
			return registerResult
		},
		async registerWallet() {
			if (!this.accountId) {
				this.$toastError(`Unexpected condition`)
				return null
			}
			const idCheck = this.$qualityID(this.id)
			if (this.$isError(idCheck)) {
				this.$toastError(idCheck.error)
				return null
			}
			this.id = this.id.toLowerCase()
			const registerResult = await registerNearWallet(this.id, this.accountId)
			if (`error` in registerResult) {
				this.$toastError(registerResult.error)
				return null
			}
			return registerResult
		},
		async verify() {
			try {
				if (!this.userInfo || !this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				// Login
				const res = await this.loginOrRegister(this.userInfo.privateKey)
				if (!res) {
					// Next line ensures multiple attempts to pick a username
					return
				}
				const { profile, cid } = res

				const account = createSessionFromProfile(cid, profile)
				this.$store.commit(`setWelcome`, true)
				this.changeCID(cid)
				this.changeID(account.id)
				this.changeName(account.name)
				this.changeEmail(account.email)
				this.changeAvatar(account.avatar)
				this.changeBio(account.bio)
				this.changeLocation(account.location)
				this.$router.push(`/home`)
			} catch (err: any) {
				this.$toastError(err.message)
			}
		},
		async walletVerify() {
			try {
				if (!this.nearWallet || !this.accountId) {
					throw new Error(`Unexpected condition!`)
				}

				// Register
				const res = await this.registerWallet()
				if (!res) {
					// Next line ensures multiple attempts to pick a username
					return
				}
				const { profile, cid } = res

				const account = createSessionFromProfile(cid, profile)
				this.changeCID(cid)
				this.changeID(account.id)
				this.changeName(account.name)
				this.changeEmail(account.email)
				this.changeAvatar(account.avatar)
				this.changeBio(account.bio)
				this.changeLocation(account.location)
				this.downloadKeyStep = true
			} catch (err: any) {
				this.$toastError(err.message)
			}
		},
		async onboardAccount() {
			if (!this.accountId) {
				this.$toastError(`AccountId missing`)
				return
			}
			try {
				await verifyTokenAndOnboard(this.accountId)
			} catch (error: any) {
				if (axios.isAxiosError(error) && error.response) {
					if (error.response.status === 429) {
						this.$toastWarning(`Too many requests`)
						return
					}
					this.$toastError(error.response.data.error)
					return
				}
				throw error
			}
		},
	},
})
</script>
