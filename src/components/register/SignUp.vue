<template>
	<div class="flex w-full items-center justify-center">
		<VerifyPhone
			v-if="!hasEnoughFunds()"
			:accountId="userInfo.accountId"
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
			:accountId="userInfo.accountId"
			:nearWallet="userInfo.type === `near`"
			class="w-full xl:w-1/2"
			@setID="setID"
			@setDownloadKeyStep="setDownloadKeyStep"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapMutations } from 'vuex'

import { TorusLoginResponse } from '@toruslabs/customauth'

import VerifyPhone from './VerifyPhone.vue'
import SelectID from './SelectID.vue'
import { hasSufficientFunds } from '@/backend/funder'
import { checkAccountStatus, getUsernameNEAR, removeNearPrivateKey, walletLogout } from '@/backend/near'
import { verifyTokenAndOnboard } from '@/backend/invite'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'
import { login, register } from '@/backend/auth'

interface IData {
	funds: string
	username: null | string
	id: string
	isLoading: boolean
}

interface IWalletStatus {
	type: `torus` | `near`
	accountId: string
}

interface ITorusWallet extends IWalletStatus {
	type: `torus`
	userInfo: TorusLoginResponse
}

interface INearWallet extends IWalletStatus {
	type: `near`
}

export default Vue.extend({
	components: {
		VerifyPhone,
		SelectID,
	},
	props: {
		userInfo: {
			type: Object as PropType<INearWallet | ITorusWallet>,
			required: true,
		},
	},
	data(): IData {
		return {
			funds: `0`,
			username: null,
			id: ``,
			isLoading: true,
		}
	},
	async created() {
		this.$emit(`setIsLoading`, true)
		const username = await getUsernameNEAR(this.userInfo.accountId)
		if (!username) {
			await verifyTokenAndOnboard(this.userInfo.accountId)
			await this.checkFunds()
			await this.postWalletLogin()
			this.$emit(`setIsLoading`, false)
			return
		}

		// Username exists, so if we are with Torus we can just login
		if (this.userInfo.type === `torus`) {
			this.username = username
			await this.verify()
			window.localStorage.removeItem(`inviteToken`)
			return
		}
		if (this.userInfo.type === `near`) {
			removeNearPrivateKey(this.userInfo.accountId)
			walletLogout()
			this.$emit(`updateUserInfo`, null)
			this.$emit(`stepForward`)
			this.$emit(`setIsLoading`, false)
			this.$toastError(`You cannot login with wallet, please log in by importing your private key`)
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
		hasEnoughFunds(): boolean {
			return hasSufficientFunds(this.funds)
		},
		async checkFunds() {
			const accountId = this.userInfo.accountId
			if (!accountId) {
				return
			}
			const status = await checkAccountStatus(accountId)
			this.funds = status.balance
		},
		updateFunds(balance: string) {
			this.funds = balance
		},
		async postWalletLogin() {
			const [username] = await Promise.all([
				getUsernameNEAR(this.userInfo.accountId),
				this.checkFunds(),
				verifyTokenAndOnboard(this.userInfo.accountId),
			])
			this.username = username
			if (this.username) {
				// If a username is found then proceed to login...
				this.verify()
				return true
			}
			if (this.username) {
				this.$toastError(`You cannot login with wallet, please import your private key`)
				removeNearPrivateKey(this.userInfo.accountId)
				walletLogout()
				return false
			}
			return true
		},
		async loginOrRegister(privateKey: string) {
			if (this.username) {
				return login(this.username, privateKey)
			}
			const idCheck = this.$qualityID(this.id)
			if (this.$isError(idCheck)) {
				this.$toastError(idCheck.error)
				return false
			}
			this.id = this.id.toLowerCase()
			const registerResult = await register(this.id, privateKey)
			if (`error` in registerResult) {
				this.$toastError(registerResult.error)
				return false
			}
			return registerResult
		},
		async verify() {
			if (!this.userInfo || this.userInfo.type !== `torus`) {
				throw new Error(`Unexpected condition!`)
			}
			// Login
			const res = await this.loginOrRegister(this.userInfo.userInfo.privateKey)
			if (!res) {
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
		},
		setID(id: string): void {
			this.username = id
		},
	},
})
</script>
