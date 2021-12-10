<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="bg-gradient-to-r from-lightBGStart to-lightBGStop w-3/5 h-screen overflow-y-scroll flex-col justify-between"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex justify-center items-center" style="height: 86%">
			<div class="flex flex-col items-center w-full p-14 -mt-5">
				<!-- Step 1: Choose Login / register -->
				<article v-show="!(userInfo || nearWallet) && !isLoading" class="w-1/2">
					<h1 class="font-semibold text-primary mb-10" style="font-size: 2.6rem">Sign up</h1>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-4 py-2 flex justify-center items-center focus:outline-none"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon style="width: 28px; height: 28px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Sign up with Discord</h6>
					</button>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 py-2 flex justify-center items-center focus:outline-none"
						@click="() => torusLogin('google')"
					>
						<GoogleIcon style="width: 28px; height: 28px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Sign up with Google</h6>
					</button>
					<div class="w-full flex justify-center items-center my-6">
						<span class="border border-gray5 flex-grow rounded-lg" style="height: 1px"></span>
						<p class="px-4 text-gray5 text-xs">OR</p>
						<span class="border border-gray5 flex-grow rounded-lg" style="height: 1px"></span>
					</div>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-4 py-3 flex justify-center items-center focus:outline-none"
						@click="() => walletLoginComponent()"
					>
						<NearIcon style="width: 22px; height: 22px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Signup with NEAR</h6>
					</button>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-4 py-3 flex justify-center items-center focus:outline-none"
						@click="() => implicitAccountCreate()"
					>
						<h6 class="font-semibold text-gray7 text-sm ml-4">Create implicit account</h6>
					</button>
					<p class="text-center text-gray7 mt-10">
						Already have an account?
						<nuxt-link to="/login" class="text-center font-bold text-primary">Log in</nuxt-link>
					</p>
				</article>
				<!-- Step 2: Sign up -->
				<article v-show="!isLoading" class="w-1/2">
					<div v-show="(userInfo || nearWallet) && username === null">
						<h1 class="text-4xl text-primary font-bold">Sign up</h1>
						<article v-if="!hasSufficientFunds()">
							<!-- Step 2a: Verify Phone # -->
							<div v-if="!otpSent">
								<p class="text-gray7 text-center my-10">
									Verify you’re a human with your phone number so that Capsule can fund your wallet. This is the last
									step needed to create your Capsule account.
								</p>
								<label for="id" class="font-semibold text-sm text-gray5 pb-1 block">Phone Number</label>
								<input
									id="phoneNumber"
									v-model="phoneNumber"
									type="tel"
									class="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary font-sans bg-gray2"
								/>
								<div class="w-full flex justify-end">
									<BrandedButton :text="`Send Code`" :action="sendOTP" />
								</div>
								<p class="text-gray7 text-sm mt-10 text-center">
									Already have a funded wallet? <button class="text-primary font-bold">Connect to NEAR</button>
								</p>
							</div>
							<div v-else>
								<!-- Enter SMS code to complete verify -->
								<label for="id" class="font-semibold text-sm text-gray5 pb-1 block">One-time Password</label>
								<input
									id="phoneNumber"
									v-model="otp"
									type="text"
									placeholder=""
									class="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary font-sans bg-gray2"
								/>
								<BrandedButton :text="`Verify`" class="w-full" :action="validateOTP" />
							</div>
						</article>
						<article v-else>
							<!-- Step 3: Choose an ID -->
							<label for="id" class="font-semibold text-sm text-gray5 pb-1 block">ID</label>
							<input
								id="id"
								v-model="id"
								type="text"
								placeholder=""
								class="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary font-sans bg-gray2"
							/>
							<BrandedButton :text="`Sign Up`" :action="verify" class="w-full" />
							<article>
								<p class="whitespace-nowrap justify-between text-sm p-5 text-gray-600 font-sans">
									Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
								</p>
								<p class="whitespace-nowrap justify-between text-sm p-5 text-gray-600 font-sans">
									Available funds: {{ funds }} yN
								</p>
								<BrandedButton :text="`Re-check funds`" class="w-full" :action="checkFunds" />
							</article>
						</article>
					</div>
				</article>
				<article v-show="isLoading" class="w-3/4 flex justify-center">
					<div class="loader m-5 rounded-lg"></div>
				</article>
			</div>
		</section>
		<p class="px-4 text-gray5 text-sm pl-10">© 2021 Capsule.Social</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
// eslint-disable-next-line import/named
import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/customauth'
import 'intl-tel-input/build/css/intlTelInput.css'
import intlTelInput from 'intl-tel-input'

import CapsuleIcon from '@/components/icons/Capsule.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import NearIcon from '@/components/icons/brands/Near.vue'
// import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, IAuthResult, login, register, registerNearWallet } from '@/backend/auth'
import {
	checkAccountStatus,
	generateAndSetKey,
	getUsernameNEAR,
	getWalletConnection,
	removeNearPrivateKey,
	signedInToWallet,
	walletLogin,
	walletLogout,
} from '@/backend/near'
import { sufficientFunds, torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { requestOTP, requestSponsor } from '@/backend/funder'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	isLoading: boolean
	phoneNumber: string
	otp: string
	otpSent: boolean
	funds: string
	iti: any
	nearWallet: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		// TwitterIcon,
		DiscordIcon,
		GoogleIcon,
		BrandedButton,
		NearIcon,
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
			userInfo: null,
			isLoading: false,
			username: undefined,
			otpSent: false,
			funds: `0`,
			iti: null,
			nearWallet: false,
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
				utilsScript: `https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.15/js/utils.min.js`,
				// any initialisation options go here
			})
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
		hasSufficientFunds() {
			return BigInt(this.funds) >= BigInt(sufficientFunds)
		},
		async checkFunds() {
			this.isLoading = true
			const accountId = this.accountId
			if (!accountId) {
				return
			}
			const status = await checkAccountStatus(accountId)
			this.funds = status.balance
			this.isLoading = false
		},
		async torusLogin(type: TorusVerifiers) {
			this.isLoading = true
			try {
				this.userInfo = await this.torus.triggerLogin(torusVerifiers[type])

				this.accountId = getAccountIdFromPrivateKey(this.userInfo.privateKey)
				this.username = await getUsernameNEAR(this.accountId)
				if (this.username) {
					// If a username is found then proceed to login...
					this.verify()
					return
				}

				// If no username is found then register...
				await this.checkFunds()
				this.isLoading = false
			} catch (e) {
				// eslint-disable-next-line no-console
				console.log(e)
				this.isLoading = false
			}
		},
		async walletLoginComponent() {
			this.isLoading = true
			await walletLogin()
			this.isLoading = false
		},
		async postWalletLogin() {
			this.isLoading = true
			const walletConnection = getWalletConnection()
			this.accountId = walletConnection.getAccountId()
			if (!this.accountId) {
				this.isLoading = false
				return false
			}

			;[this.username] = await Promise.all([getUsernameNEAR(this.accountId), this.checkFunds()])
			if (this.username) {
				this.$toastError(`You cannot login with wallet, please import your private key`)
				removeNearPrivateKey(this.accountId)
				walletLogout()
				this.isLoading = false
			}
			this.isLoading = false
			return true
		},
		isSignedInToWallet() {
			return signedInToWallet()
		},
		async implicitAccountCreate() {
			this.isLoading = true

			this.accountId = await generateAndSetKey()
			;[this.username] = await Promise.all([getUsernameNEAR(this.accountId), this.checkFunds()])
			if (this.username) {
				this.$toastError(`You cannot login with implicit account, please import your private key`)
				removeNearPrivateKey(this.accountId)
				this.isLoading = false
			}
			this.nearWallet = true
			this.isLoading = false
		},
		async sendOTP() {
			this.phoneNumber = this.iti.getNumber()
			if (!this.iti.isValidNumber()) {
				this.$toastError(`Invalid phone number`)
				return
			}
			this.isLoading = true
			await requestOTP(this.phoneNumber)
			this.otpSent = true
			this.isLoading = false
		},
		async validateOTP() {
			if (!this.$qualityPhoneNumber(this.phoneNumber)) {
				throw new Error(`Invalid phone number`)
			}

			if (this.otp.length !== 6) {
				return
			}

			if (!this.accountId) {
				return
			}

			this.isLoading = true
			await requestSponsor(this.phoneNumber, this.otp, this.accountId)
			await this.checkFunds()
			this.isLoading = false
		},
		loginOrRegister(privateKey: string) {
			if (this.username) {
				return login(this.username, privateKey)
			}
			const idCheck = this.$qualityID(this.id)
			if (!idCheck) {
				this.$toastError(`ID did not pass quality rules`)
				return null
			}
			return register(this.id, privateKey)
		},
		registerWallet() {
			if (!this.accountId) {
				this.$toastError(`Unexpected condition`)
				return null
			}

			const idCheck = this.$qualityID(this.id)
			if (!idCheck) {
				this.$toastError(`ID did not pass quality rules`)
				return null
			}

			return registerNearWallet(this.id, this.accountId)
		},
		async verify() {
			try {
				if (!(this.userInfo || this.nearWallet) || !this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				this.isLoading = true

				// Login
				let res: IAuthResult | null = null
				if (this.nearWallet) {
					res = await this.registerWallet()
				} else if (this.userInfo) {
					res = await this.loginOrRegister(this.userInfo.privateKey)
				}

				if (!res) {
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
				this.$router.push(`/home`)
			} catch (err: any) {
				this.$toastError(err.message)
			}
		},
	},
})
</script>
