<template>
	<div class="flex flex-row w-full items-center justify-center">
		<article v-if="!downloadKey" class="flex flex-row w-full items-center justify-center">
			<VerifyPhone
				v-if="!hasEnoughFunds()"
				:accountId="userInfo.accountId"
				class="w-full h-full xl:w-1/2"
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
				class="w-full h-full xl:w-1/2"
			/>
		</article>
		<!-- Step 4: Download key -->
		<DownloadKey v-if="downloadKey" :aid="username" :accountId="userInfo.accountId" class="w-full xl:w-1/2" />
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapMutations } from 'vuex'

import VerifyPhone from './VerifyPhone.vue'
import SelectID from './SelectID.vue'
import DownloadKey from './DownloadKey.vue'

import { hasSufficientFunds } from '@/backend/funder'
import {
	checkAccountStatus,
	getIsAccountIdOnboarded,
	getUsernameNEAR,
	removeNearPrivateKey,
	walletLogout,
} from '@/backend/near'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'
import { setNearUserFromPrivateKey, login, register, IAuthResult, IWalletStatus } from '@/backend/auth'
import { ValidationError } from '@/errors'
import { verifyTokenAndOnboard } from '@/backend/invite'
import { getInviteToken } from '@/backend/utilities/helpers'

interface IData {
	funds: string
	username: null | string
	isLoading: boolean
	downloadKey: boolean
}

export default Vue.extend({
	components: {
		VerifyPhone,
		DownloadKey,
		SelectID,
	},
	props: {
		userInfo: {
			type: Object as PropType<IWalletStatus>,
			required: true,
		},
	},
	data(): IData {
		return {
			funds: `0`,
			username: null,
			isLoading: true,
			downloadKey: false,
		}
	},
	async created() {
		this.$emit(`setIsLoading`, true)
		const username = await getUsernameNEAR(this.userInfo.accountId)
		if (!username) {
			const inviteToken = getInviteToken()
			if (!inviteToken) {
				const isAccountOnboarded = await getIsAccountIdOnboarded(this.userInfo.accountId)
				if (!isAccountOnboarded) {
					this.$emit(`updateUserInfo`, null)
					this.$emit(`setIsLoading`, false)
					this.$emit(`stepForward`)
					return
				}
			} else {
				await verifyTokenAndOnboard(this.userInfo.accountId)
			}
			await this.checkFunds()
			this.$emit(`setIsLoading`, false)
			return
		}

		// Username exists, so if we are with Torus we can just login
		if (this.userInfo.type === `torus`) {
			this.username = username
			await this.verify(this.username)
			window.localStorage.removeItem(`inviteToken`)
			return
		}
		if (this.userInfo.type === `near`) {
			// If the key exists we can login him
			const pk = window.localStorage.getItem(`near-api-js:${this.userInfo.accountId}:testnet`)
			if (pk) {
				this.username = username
				await this.verify(this.username)
				window.localStorage.removeItem(`inviteToken`)
				return
			}
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
		async verify(id: string) {
			if (!this.userInfo) {
				throw new Error(`Unexpected condition!`)
			}
			let res: false | IAuthResult = false
			if (this.username) {
				// Login
				if (this.userInfo.type === `torus`) {
					res = await login(this.username, this.userInfo.privateKey)
				} else {
					throw new ValidationError(`Can't use wallet for login, please upload your private key`)
				}
			} else {
				// Register
				const lowerID = id.toLowerCase()
				const idCheck = this.$qualityID(lowerID)
				if (this.$isError(idCheck)) {
					throw new ValidationError(idCheck.error)
				}
				if (this.userInfo.type === `torus`) {
					await setNearUserFromPrivateKey(this.userInfo.privateKey)
				}
				const registerResult = await register(lowerID, this.userInfo.accountId)
				if (`error` in registerResult) {
					throw new ValidationError(registerResult.error)
				}
				res = registerResult
			}

			// Login
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

			this.username = account.id
			window.localStorage.setItem(`accountId`, this.userInfo.accountId)
			if (this.userInfo.type !== `near`) {
				this.$router.push(`/home`)
			} else {
				this.downloadKey = true
			}
		},
	},
})
</script>
