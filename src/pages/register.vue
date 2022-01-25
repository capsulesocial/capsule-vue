<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r xl:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex items-center justify-center" style="height: 86%">
			<div class="-mt-5 flex w-full flex-col items-center p-14">
				<!-- Step 0: Code redeem -->
				<article v-if="!hasInviteCode && !(userInfo || nearWallet) && !isLoading" class="w-full xl:w-1/2">
					<h1 class="text-primary mb-5 font-semibold xl:mb-10" style="font-size: 2.6rem">Welcome</h1>
					<p class="text-gray7 mt-5 text-center text-sm xl:mt-10 xl:text-base">
						Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
						release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to
						seed a vibrant community that will grow over time.
					</p>
					<div
						class="relative mt-6 h-44 overflow-hidden rounded-lg p-4 xl:h-52"
						style="background-size: cover; background-repeat: no-repeat; background-position: center"
						:style="{ backgroundImage: `url(` + require(`@/assets/images/util/ticket.png`) + `)` }"
					>
						<label for="id" class="text-gray5 block pb-1 text-sm font-semibold">You have an invite code?</label>
						<input
							id="id"
							v-model="inputCode"
							type="text"
							placeholder="Paste it here to get started"
							class="focus:outline-none focus:border-primary text-primary bg-gray2 border-primary mt-1 mb-5 w-full rounded-lg border border-dashed px-4 py-2 font-sans text-sm"
							style="height: 3rem"
						/>
						<div class="flex flex-row justify-between">
							<img
								:src="require(`@/assets/images/brand/discover.webp`)"
								class="-ml-4 -mb-8 hidden w-6/12 rounded-lg xl:block"
							/>
							<BrandedButton
								:text="`Sign Up`"
								:action="verifyCode"
								class="relative bottom-0 right-0 m-1 w-full xl:absolute xl:m-6 xl:w-2/5"
							/>
						</div>
					</div>
					<p class="text-gray7 mt-6 text-center text-sm">
						Already have an account?
						<nuxt-link to="/login" class="text-primary text-center font-bold">Log in</nuxt-link>
					</p>
					<p class="text-gray7 mt-10 text-center text-sm">
						Don’t have an invite yet? Request one
						<a
							href="https://forms.zohopublic.com/peter96/form/BlogchainInviteRequests/formperma/7xCuELT6HdgR08w13-Nt8WFx9SmsnZh1YFL9mcP_oCc"
							target="_blank"
							class="text-primary font-semibold"
							>here.</a
						>
						You can also join our community on Discord, or follow our company blog to receive future updates.
					</p>
					<div class="flex items-center justify-between py-6">
						<a href="https://discord.gg/sZWjf3E6bY" target="_blank">
							<button
								style="padding: 0.8rem 1.5rem; background-color: #7289da"
								class="focus:outline-none flex transform items-center justify-between rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
							>
								<DiscordIcon class="icon text-lightOnPrimaryText mr-2 h-6 w-6 fill-current" />
								<span class="text-lightOnPrimaryText hidden font-sans text-sm xl:block xl:text-base"> Join </span>
								<span class="text-lightOnPrimaryText ml-1 font-sans text-sm xl:text-base"> Discord </span>
							</button>
						</a>
						<a href="https://blog.capsule.social/" target="_blank">
							<button
								style="padding: 0.9rem 1.7rem"
								class="focus:outline-none border-lightBorder text-lightPrimaryText bg-lightBG flex transform items-center justify-between rounded-lg font-bold shadow-lg transition duration-500 ease-in-out hover:shadow-lg"
							>
								<CapsuleLogo class="icon text-lightPrimaryText mr-3 h-5 w-5 fill-current" />
								<span class="text-lightPrimaryText hidden font-sans text-sm xl:block xl:text-base"> Latest </span>
								<span class="text-lightPrimaryText ml-1 font-sans text-sm xl:text-base"> news </span>
							</button>
						</a>
					</div>
				</article>
				<!-- Step 1: Choose Login / register -->
				<article v-show="hasInviteCode && !(userInfo || nearWallet) && !isLoading" class="w-full xl:w-1/2">
					<h1 class="text-primary mb-10 font-semibold" style="font-size: 2.6rem">Sign up</h1>
					<button
						class="bg-gray2 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-2"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon style="width: 28px; height: 28px; color: #8c9eff" />
						<h6 class="text-gray7 ml-4 text-sm font-semibold">Sign up with Discord</h6>
					</button>
					<button
						class="bg-gray2 focus:outline-none flex w-full items-center justify-center rounded-lg py-2"
						@click="() => torusLogin('google')"
					>
						<GoogleIcon style="width: 28px; height: 28px" />
						<h6 class="text-gray7 ml-4 text-sm font-semibold">Sign up with Google</h6>
					</button>
					<div class="my-6 flex w-full items-center justify-center">
						<span class="border-gray5 flex-grow rounded-lg border" style="height: 1px"></span>
						<p class="text-gray5 px-4 text-xs">OR</p>
						<span class="border-gray5 flex-grow rounded-lg border" style="height: 1px"></span>
					</div>
					<button
						class="bg-gray2 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
						@click="() => walletLoginComponent()"
					>
						<NearIcon style="width: 22px; height: 22px" />
						<h6 class="text-gray7 ml-4 text-sm font-semibold">Signup with NEAR</h6>
					</button>
					<button
						class="bg-gray2 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
						@click="() => implicitAccountCreate()"
					>
						<h6 class="text-gray7 ml-4 text-sm font-semibold">Create implicit account</h6>
					</button>
					<p class="text-gray7 mt-10 text-center">
						Already have an account?
						<nuxt-link to="/login" class="text-primary text-center font-bold">Log in</nuxt-link>
					</p>
				</article>
				<!-- Step 2: Sign up -->
				<article v-show="!isLoading && !downloadKeyStep" class="w-full xl:w-1/2">
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
									id="phoneNumber"
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
				<article v-if="downloadKeyStep && !isLoading" class="w-full xl:w-1/2">
					<p class="text-gray7 text-center">
						Here is your private key file. Download this file in a safe spot. You will need it to access your account.
						To download your private keys again, visit the Settings page
					</p>
					<div class="bg-gray1 my-10 flex items-center justify-between rounded-lg p-4">
						<div class="flex flex-row items-center">
							<FileDownloadIcon />
							<h6 class="text-gray pl-4 text-lg font-semibold">Private Key</h6>
						</div>
						<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
					</div>
					<nuxt-link to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
				</article>
				<article v-show="isLoading" class="modal-animation flex w-full justify-center xl:w-3/4">
					<div class="loader m-5 rounded-lg"></div>
				</article>
			</div>
		</section>
		<p class="text-gray5 px-4 pl-10 text-sm">© 2021 Capsule.Social</p>
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

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import CapsuleLogo from '@/components/icons/CapsuleLogo.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import NearIcon from '@/components/icons/brands/Near.vue'
import DiscordIcon from '@/components/icons/Discord.vue'
// import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import FileDownloadIcon from '@/components/icons/FileDownload.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, login, register, registerNearWallet } from '@/backend/auth'
import {
	checkAccountStatus,
	generateAndSetKey,
	getNearPrivateKey,
	getUsernameNEAR,
	getWalletConnection,
	removeNearPrivateKey,
	signedInToWallet,
	walletLogin,
	walletLogout,
} from '@/backend/near'
import { torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { hasSufficientFunds, requestOTP, requestSponsor, waitForFunds } from '@/backend/funder'
import { verifyCodeAndGetToken, verifyTokenAndOnboard } from '@/backend/invite'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	hasInviteCode: boolean
	inputCode: string
	isLoading: boolean
	phoneNumber: string
	otp: string
	otpSent: boolean
	funds: string
	iti: any
	nearWallet: boolean
	downloadKeyStep: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		CapsuleLogo,
		DiscordIcon,
		GoogleIcon,
		BrandedButton,
		NearIcon,
		FileDownloadIcon,
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
			isLoading: false,
			username: undefined,
			otpSent: false,
			funds: `0`,
			iti: null,
			nearWallet: false,
			downloadKeyStep: false,
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
			return hasSufficientFunds(this.funds)
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
				const [username] = await Promise.all([getUsernameNEAR(this.accountId), this.onboardAccount()])
				this.username = username
				if (this.username) {
					// If a username is found then proceed to login...
					this.verify()
					return
				}

				// If no username is found then register...
				await this.checkFunds()
				this.isLoading = false
			} catch (e) {
				this.$toastError(`oops, ` + e)
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

			const [username] = await Promise.all([getUsernameNEAR(this.accountId), this.checkFunds(), this.onboardAccount()])
			this.username = username
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
			const [username] = await Promise.all([getUsernameNEAR(this.accountId), this.checkFunds(), this.onboardAccount()])
			this.username = username
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
			if (this.otp.length !== 6) {
				this.$toastError(`OTP should have 6 digits`)
				return
			}

			if (!this.accountId) {
				return
			}

			this.isLoading = true
			try {
				await requestSponsor(this.phoneNumber, this.otp, this.accountId)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					this.otp = ``
					this.$toastError(err.response.data.error)
					this.isLoading = false
					return
				}
				throw err
			}
			const { error, balance } = await waitForFunds(this.accountId)
			if (error) {
				// TODO: Let the user repeat the process.
				this.$toastError(error)
				this.isLoading = false
				return
			}
			if (balance) {
				this.funds = balance
			}
			this.isLoading = false
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
				this.isLoading = true
				// Login
				const res = await this.loginOrRegister(this.userInfo.privateKey)
				if (!res) {
					// Next line ensures multiple attempts to pick a username
					this.isLoading = false
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
				this.isLoading = true

				// Register
				const res = await this.registerWallet()
				if (!res) {
					// Next line ensures multiple attempts to pick a username
					this.isLoading = false
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
				this.isLoading = false
				this.downloadKeyStep = true
			} catch (err: any) {
				this.$toastError(err.message)
			}
		},
		async downloadPrivateKey(): Promise<void> {
			if (!this.accountId) {
				throw new Error(`Unexpected condition!`)
			}
			const privateKey = await getNearPrivateKey(this.accountId)
			const blob = new Blob([JSON.stringify({ accountId: this.accountId, privateKey })], { type: `application/json` })
			const link = document.createElement(`a`)
			link.href = URL.createObjectURL(blob)
			link.download = `capsule-priv-key-${this.id}`
			link.click()
			URL.revokeObjectURL(link.href)
			this.$toastSuccess(`Downloaded private key`)
		},
		async verifyCode() {
			if (this.inputCode.length !== 8) {
				this.$toastError(`Invite codes should be of length 8`)
				return
			}
			try {
				await verifyCodeAndGetToken(this.inputCode)
				this.hasInviteCode = true
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
