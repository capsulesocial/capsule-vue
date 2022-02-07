<template>
	<article>
		<h1 class="text-primary dark:text-secondary text-4xl font-bold">Sign up</h1>
		<label for="id" class="text-gray5 dark:text-gray3 block pb-1 text-sm font-semibold">Pick your Capsule name</label>
		<input
			id="id"
			v-model="id"
			type="text"
			placeholder=""
			class="focus:outline-none focus:border-primary dark:focus:border-secondary text-primary dark:text-darkPrimaryText bg-gray2 dark:bg-gray7 mt-1 mb-5 w-full rounded-lg px-3 py-2 font-sans text-sm"
		/>
		<BrandedButton v-show="!isLoading" :text="`Sign Up`" :action="handleRegisterID" class="w-full" />
		<h6 v-show="isLoading" class="text-primary dark:text-secondary text-center">Checking ID...</h6>
		<div>
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">
				Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
			</p>
			<p class="justify-between p-5 font-sans text-sm text-gray7 dark:text-gray3">Available funds: {{ funds }} yN</p>
			<BrandedButton :text="`Re-check funds`" class="w-full" :action="checkFunds" />
		</div>
	</article>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapMutations } from 'vuex'

import { TorusLoginResponse } from '@toruslabs/customauth'
import BrandedButton from '@/components/BrandedButton.vue'
import { registerNearWallet } from '@/backend/auth'
import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'
import { ValidationError } from '@/errors'

interface IData {
	id: string
	isLoading: boolean
}

export default Vue.extend({
	components: {
		BrandedButton,
	},
	props: {
		funds: {
			type: String,
			required: true,
		},
		checkFunds: {
			type: Function as PropType<() => Promise<void>>,
			required: true,
		},
		userInfo: {
			type: Object as PropType<null | TorusLoginResponse>,
			default: null,
		},
		verify: {
			type: Function as PropType<() => Promise<void>>,
			required: true,
		},
		accountId: {
			type: String,
			required: true,
		},
		nearWallet: {
			type: Boolean,
			required: true,
		},
	},
	data(): IData {
		return {
			id: ``,
			isLoading: false,
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
		async registerWallet() {
			if (!this.accountId) {
				throw new Error(`Unexpected condition`)
			}
			const registerResult = await registerNearWallet(this.id, this.accountId)
			if (`error` in registerResult) {
				this.isLoading = false
				throw new ValidationError(registerResult.error)
			}
			this.$store.commit(`setWelcome`, true)
			return registerResult
		},
		async walletVerify() {
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
			this.$emit(`setDownloadKeyStep`)
		},
		handleRegisterID() {
			this.isLoading = true
			this.id = this.id.toLowerCase()
			const idCheck = this.$qualityID(this.id)
			if (this.$isError(idCheck)) {
				this.isLoading = false
				throw new ValidationError(idCheck.error)
			}
			this.$emit(`setID`, this.id)
			if (this.userInfo) {
				this.verify()
				return
			}
			this.walletVerify()
		},
	},
})
</script>
