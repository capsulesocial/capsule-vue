<template>
	<main style="backdrop-filter: blur(10px)" class="bg-white bg-opacity-75 w-1/2 h-screen">
		<CapsuleIcon />
		<section class="flex justify-center items-center">
			<div class="flex flex-col items-center w-full">
				<!-- Login / register -->
				<article v-show="!userInfo" class="w-1/2">
					<h1 class="mb-10 text-2xl text-primary font-bold text-center">Sign in or sign up using...</h1>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-2 py-2 flex justify-center items-center"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon />
						<h6 class="text-xl ml-2">Discord</h6>
					</button>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-2 py-2 flex justify-center items-center"
						@click="() => torusLogin('google')"
					>
						<GoogleIcon />
						<h6 class="text-xl ml-2">Google</h6>
					</button>
				</article>
				<!-- Part 2: -->
				<!-- Sign in + Register: ID -->
				<article v-show="!isLoading" class="w-3/4">
					<article v-show="userInfo && username === null">
						<h1 class="mb-10 text-2xl text-primary font-bold text-center">Sign up</h1>
						<p class="whitespace-nowrap justify-between text-sm p-5 text-gray-600 font-sans">
							Available funds: {{ funds }} yN
						</p>
						<article v-if="hasSufficientFunds()">
							<label for="id" class="font-semibold text-sm text-gray-600 pb-1 block">ID</label>
							<input
								id="id"
								v-model="id"
								type="text"
								placeholder=""
								class="
									border
									rounded-lg
									px-3
									py-2
									mt-1
									mb-5
									text-sm
									w-full
									focus:outline-none focus:border-primary
									text-primary
									font-sans
								"
							/>
							<BrandedButton :text="`Sign Up`" :action="verify" class="w-full" />
						</article>
						<article v-else>
							<article v-if="!otpSent">
								<p>
									Verify you’re a human with your phone number so that Capsule can fund your wallet. This is the last
									step needed to create your Capsule account.
								</p>
								<label for="id" class="font-semibold text-sm text-gray-600 pb-1 block">Phone Number</label>
								<input
									id="phoneNumber"
									v-model="phoneNumber"
									type="text"
									placeholder=""
									class="
										border
										rounded-lg
										px-3
										py-2
										mt-1
										mb-5
										text-sm
										w-full
										focus:outline-none focus:border-primary
										text-primary
										font-sans
									"
								/>
								<BrandedButton :text="`Send Verification Code`" class="w-full" :action="sendOTP" />
							</article>
							<article v-else>
								<label for="id" class="font-semibold text-sm text-gray-600 pb-1 block">OTP</label>
								<input
									id="phoneNumber"
									v-model="otp"
									type="text"
									placeholder=""
									class="
										border
										rounded-lg
										px-3
										py-2
										mt-1
										mb-5
										text-sm
										w-full
										focus:outline-none focus:border-primary
										text-primary
										font-sans
									"
								/>
								<BrandedButton :text="`Verify`" class="w-full" :action="validateOTP" />
							</article>
							<article>
								<p class="whitespace-nowrap justify-between text-sm p-5 text-gray-600 font-sans">
									Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
								</p>
								<BrandedButton :text="`Re-check funds`" class="w-full" :action="checkFunds" />
							</article>
						</article>
					</article>
				</article>
				<article v-show="isLoading" class="w-3/4 flex justify-center">
					<div class="loader m-5 p-10 rounded-lg"></div>
				</article>
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
// eslint-disable-next-line import/named
import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/customauth'

import CapsuleIcon from '@/components/icons/Capsule.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
// import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import BrandedButton from '@/components/BrandedButton.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, login, register } from '@/backend/auth'
import { checkAccountStatus, getUsernameNEAR } from '@/backend/near'
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
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		// TwitterIcon,
		DiscordIcon,
		GoogleIcon,
		BrandedButton,
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
		}
	},
	async created() {
		await this.torus.init()
	},
	mounted() {
		const accountId = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountId) {
			this.$router.push(`/home`)
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
			try {
				this.isLoading = true
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
		async sendOTP() {
			if (!this.$qualityPhoneNumber(this.phoneNumber)) {
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
				alert(idCheck)
				return null
			}
			return register(this.id, privateKey)
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
				this.$router.push(`/settings`)
			} catch (err: any) {
				alert(err.message)
			}
		},
	},
})
</script>
