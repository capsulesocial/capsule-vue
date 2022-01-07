<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="bg-gradient-to-r from-lightBGStart to-lightBGStop w-3/5 h-screen overflow-y-scroll flex-col justify-between"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex justify-center items-center" style="height: 86%">
			<div class="flex flex-col items-center w-full p-14 -mt-5">
				<!-- Step 0: Code redeem -->
				<article v-if="!inviteCode && !isLoading" class="w-1/2">
					<h1 class="font-semibold text-primary mb-10" style="font-size: 2.6rem">Welcome</h1>
					<p class="text-center text-gray7 mt-10">
						Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
						release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to
						seed a vibrant community that will grow over time.
					</p>
					<div
						class="p-4 rounded-lg mt-6 h-60 overflow-hidden relative"
						style="background-size: cover; background-repeat: no-repeat"
						:style="{ backgroundImage: `url(` + require(`@/assets/images/backgrounds/ticket.png`) + `)` }"
					>
						<label for="id" class="font-semibold text-sm text-gray5 pb-1 block">You have an invite code?</label>
						<input
							id="id"
							v-model="inputCode"
							type="text"
							placeholder="Paste it here to get started"
							class="rounded-lg px-4 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary font-sans bg-gray2 border border-dashed border-primary"
							style="height: 3rem"
						/>
						<div class="flex flex-row justify-between">
							<img :src="require(`@/assets/images/brand/discover.webp`)" class="w-6/12 -ml-4 -mb-5" />
							<BrandedButton :text="`Sign Up`" :action="verifyCode" class="w-2/5 absolute bottom-0 right-0 m-6" />
						</div>
					</div>
					<p class="text-center text-gray7 mt-6 text-sm">
						Already have an account?
						<nuxt-link to="/login" class="text-center font-bold text-primary">Log in</nuxt-link>
					</p>
					<p class="text-center text-gray7 mt-10 text-sm">
						Don’t have an invite yet? Request one
						<a
							href="https://forms.zohopublic.com/peter96/form/BlogchainInviteRequests/formperma/7xCuELT6HdgR08w13-Nt8WFx9SmsnZh1YFL9mcP_oCc"
							target="_blank"
							class="text-primary font-semibold"
							>here.</a
						>
						You can also join our community on Discord, or follow our company blog to receive future updates.
					</p>
					<div class="flex justify-between items-center p-6">
						<a href="https://discord.gg/sZWjf3E6bY" target="_blank">
							<button
								style="padding: 0.8rem 1.7rem; background-color: #7289da"
								class="transition duration-500 ease-in-out transform font-bold rounded-lg hover:shadow-lg focus:outline-none flex justify-between items-center"
								@click="action"
							>
								<DiscordIcon class="icon fill-current w-6 h-6 text-lightOnPrimaryText" />
								<span class="font-sans text-lightOnPrimaryText ml-2" style="font-size: 0.95rem"> Join Discord </span>
							</button>
						</a>
						<a href="https://blog.capsule.social/" target="_blank">
							<button
								style="padding: 0.8rem 1.7rem"
								class="transition duration-500 ease-in-out transform font-bold rounded-lg hover:shadow-lg focus:outline-none flex justify-between items-center shadow-lg border-lightBorder text-lightPrimaryText bg-lightBG"
								@click="action"
							>
								<CapsuleLogo class="icon fill-current w-5 h-5 text-lightPrimaryText" />
								<span class="font-sans text-lightPrimaryText ml-3" style="font-size: 0.95rem ml-1"> Latest news </span>
							</button>
						</a>
					</div>
				</article>
				<!-- Step 1: Choose Login / register -->
				<article v-show="inviteCode && !(userInfo || nearWallet) && !isLoading" class="w-1/2">
					<h1 class="font-semibold text-primary mb-10" style="font-size: 2.6rem">Sign up</h1>
					<button
						class="w-full rounded-lg bg-gray2 mb-4 py-2 flex justify-center items-center focus:outline-none"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon style="width: 28px; height: 28px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Sign up with Discord</h6>
					</button>
					<button
						class="w-full rounded-lg bg-gray2 py-2 flex justify-center items-center focus:outline-none"
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
						class="w-full rounded-lg bg-gray2 mb-4 py-3 flex justify-center items-center focus:outline-none"
						@click="() => walletLoginComponent()"
					>
						<NearIcon style="width: 22px; height: 22px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Signup with NEAR</h6>
					</button>
					<button
						class="w-full rounded-lg bg-gray2 mb-4 py-3 flex justify-center items-center focus:outline-none"
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
				<article v-show="!isLoading && !downloadKeyStep" class="w-1/2">
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
							<label for="id" class="font-semibold text-sm text-gray5 pb-1 block">Pick your Capsule name</label>
							<input
								id="id"
								v-model="id"
								type="text"
								placeholder=""
								class="rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary font-sans bg-gray2"
							/>
							<BrandedButton :text="`Sign Up`" :action="userInfo ? verify : walletVerify" class="w-full" />
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
				<article v-if="downloadKeyStep && !isLoading" class="w-1/2">
					<p class="text-gray7 text-center">
						Here is your private key file. Download this file in a safe spot. You will need it to access your account.
						To download your private keys again, visit the Settings page
					</p>
					<div class="bg-gray1 rounded-lg flex items-center p-4 my-10 justify-between">
						<div class="flex flex-row items-center">
							<FileDownloadIcon />
							<h6 class="text-gray text-lg font-semibold pl-4">Private Key</h6>
						</div>
						<BrandedButton :text="`Download`" :action="downloadPrivateKey" />
					</div>
					<nuxt-link to="/home" class="text-primary text-center">Continue to Homepage</nuxt-link>
				</article>
				<article v-show="isLoading" class="w-3/4 flex justify-center modal-animation">
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
import { sufficientFunds, torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { requestOTP, requestSponsor } from '@/backend/funder'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	inviteCode: null | string
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
			inviteCode: null,
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
			await this.checkFunds()
			this.isLoading = false
		},
		async loginOrRegister(privateKey: string) {
			if (this.username) {
				return login(this.username, privateKey)
			}
			const idCheck = this.$qualityID(this.id)
			if (!idCheck) {
				this.$toastError(`ID did not pass quality rules`)
				return null
			}
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
			if (!idCheck) {
				this.$toastError(`ID did not pass quality rules`)
				return null
			}

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
	},
})
</script>
