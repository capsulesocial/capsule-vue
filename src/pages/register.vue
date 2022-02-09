<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r xl:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex items-center justify-center max-h-90" style="height: 86%">
			<div v-show="isLoading" class="modal-animation flex w-full justify-center xl:w-1/2 z-20">
				<div class="loader m-5 rounded-lg"></div>
			</div>
			<div v-show="!isLoading" class="-mt-5 flex w-full flex-col items-center px-14">
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
					@infos="showInfos = true"
				/>
				<!-- Step 2: Sign up -->
				<div
					v-show="!downloadKeyStep && (userInfo || nearWallet) && username === null"
					class="flex w-full items-center justify-center"
				>
					<VerifyPhone
						v-if="!hasEnoughFunds()"
						:accountId="accountId"
						class="w-full xl:w-1/2"
						@updateFunds="updateFunds"
					/>
					<!-- Step 3: Choose ID -->
					<SelectID
						v-else
						:funds="funds"
						:checkFunds="checkFunds"
						:userInfo="userInfo"
						:verify="verify"
						:accountId="accountId"
						:nearWallet="nearWallet"
						class="w-full xl:w-1/2"
						@setID="setID"
						@setDownloadKeyStep="setDownloadKeyStep"
					/>
				</div>
				<!-- Step 4: Download key -->
				<DownloadKey v-if="downloadKeyStep" :aid="id" :accountId="accountId" class="w-full xl:w-1/2" />
			</div>
		</section>
		<p class="text-gray5 px-4 pl-10 text-sm">© {{ currentYear }} Capsule Social, Inc.</p>
		<div
			v-if="showInfos"
			class="popup bg-primary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50"
		>
			<InfosPopup @close="showInfos = false" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
// eslint-disable-next-line import/named
import { TorusLoginResponse } from '@toruslabs/customauth'
import 'intl-tel-input/build/css/intlTelInput.css'
import axios from 'axios'

import InviteCode from '@/components/register/InviteCode.vue'
import DownloadKey from '@/components/register/DownloadKey.vue'
import RegisterMethods from '@/components/register/RegisterMethods.vue'
import VerifyPhone from '@/components/register/VerifyPhone.vue'
import SelectID from '@/components/register/SelectID.vue'
import InfosPopup from '@/components/register/InfosPopup.vue'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
// @ts-ignore
import ogImage from '@/assets/images/util/ogImage.png'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { login, register } from '@/backend/auth'
import {
	checkAccountStatus,
	getUsernameNEAR,
	getWalletConnection,
	removeNearPrivateKey,
	signedInToWallet,
	walletLogout,
} from '@/backend/near'
import { verifyTokenAndOnboard } from '@/backend/invite'
import { hasSufficientFunds } from '@/backend/funder'

interface IData {
	id: string
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	hasInviteCode: boolean
	funds: string
	nearWallet: boolean
	downloadKeyStep: boolean
	currentYear: string
	isLoading: boolean
	showInfos: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		InviteCode,
		DownloadKey,
		RegisterMethods,
		VerifyPhone,
		SelectID,
		InfosPopup,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			accountId: null,
			hasInviteCode: false,
			userInfo: null,
			username: undefined,
			funds: `0`,
			nearWallet: false,
			downloadKeyStep: false,
			currentYear: ``,
			isLoading: true,
			showInfos: false,
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
	errorCaptured(err: Error) {
		this.$toastError(err.message)
	},
	async created() {
		await Promise.all([this.postWalletLogin()])
		this.nearWallet = this.isSignedInToWallet()
		this.isLoading = false
	},
	mounted() {
		const accountId = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountId) {
			this.$router.push(`/home`)
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
		setDownloadKeyStep(): void {
			this.downloadKeyStep = true
		},
		updateUserInfo(userInfo: TorusLoginResponse): void {
			this.userInfo = userInfo
		},
		updateAccountId(accountId: string): void {
			this.accountId = accountId
		},
		updateUsername(username: string): void {
			this.username = username
		},
		setID(id: string): void {
			this.id = id
		},
		validInviteCode() {
			this.hasInviteCode = true
		},
		setNearWallet() {
			this.nearWallet = true
		},
		updateFunds(balance: string) {
			this.funds = balance
		},
		async checkFunds() {
			const accountId = this.accountId
			if (!accountId) {
				return
			}
			const status = await checkAccountStatus(accountId)
			this.funds = status.balance
		},
		hasEnoughFunds(): boolean {
			return hasSufficientFunds(this.funds)
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
				throw new Error(err.message)
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

<style>
.loader {
	border: 3px solid #eeeeee;
	border-top: 3px solid #2e556a;
	border-radius: 50%;
	width: 40px;
	height: 40px;
	animation: spin 2s linear infinite;
}

@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
