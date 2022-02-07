<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r xl:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex items-center justify-center max-h-90" style="height: 86%">
			<div v-show="isLoading" class="modal-animation flex w-full justify-center xl:w-1/2 z-20">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
				></div>
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
		<p class="text-gray5 dark:text-gray3 px-4 pl-10 text-sm">© {{ new Date().getFullYear().toString() }} Capsule Social, Inc.</p>
		<div
			v-if="showInfos"
			class="popup bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<InfosPopup @close="showInfos = false" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
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
import { ValidationError } from '@/errors'

interface IData {
	id: string
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	hasInviteCode: boolean
	funds: string
	nearWallet: boolean
	downloadKeyStep: boolean
	isLoading: boolean
	showInfos: boolean
	dark: boolean
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
			isLoading: true,
			showInfos: false,
			dark: false,
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
		if (axios.isAxiosError(err) && err.response) {
			if (err.response.status === 429) {
				this.$toastWarning(`Too many requests`)
				return false
			}
			this.$toastError(err.response.data.error)
			return false
		}
		if (err instanceof ValidationError) {
			this.$toastError(err.message)
			return false
		}

		this.$toastError(err.message)
		removeNearPrivateKey(this.accountId)
		walletLogout()
		return false
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
<<<<<<< HEAD
		const theDate = new Date()
		this.currentYear = theDate.getFullYear().toString()
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
		}
=======
>>>>>>> ee326df (wip: initial error handling on register.vue)
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
				throw new Error(`You cannot login with wallet, please import your private key`)
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
				throw new ValidationError(idCheck.error)
			}
			this.id = this.id.toLowerCase()
			const registerResult = await register(this.id, privateKey)
			if (`error` in registerResult) {
				throw new ValidationError(registerResult.error)
			}
			return registerResult
		},
		async verify() {
			if (!this.userInfo || !this.accountId) {
				throw new Error(`Unexpected condition!`)
			}
			// Login
			const res = await this.loginOrRegister(this.userInfo.privateKey)

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
		},
		async onboardAccount() {
			if (!this.accountId) {
				throw new Error(`AccountId missing`)
			}
			await verifyTokenAndOnboard(this.accountId)
		},
	},
})
</script>