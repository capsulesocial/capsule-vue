<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop h-screen w-full flex flex-col justify-between overflow-y-scroll bg-gradient-to-r lg:w-3/5"
	>
		<CapsuleIcon class="pt-6 pb-2 pl-10 text-primary dark:text-secondary" />
		<section class="flex items-center justify-center">
			<div v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4 xl:w-1/2 z-20">
				<div
					class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
					:style="dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
				></div>
			</div>
			<div v-show="!isLoading" class="flex w-full h-full flex-col justify-center items-center px-14">
				<!-- Step 0: Code redeem -->
				<InviteCode v-if="step === `inviteCode`" class="w-full lg:w-3/4 xl:w-1/2" @validInviteCode="stepForward" />
				<!-- Step 1: Choose Login / register -->
				<RegisterMethods
					v-else-if="step === `registerMethods`"
					class="w-full lg:w-3/4 xl:w-1/2"
					@updateUserInfo="updateUserInfo"
					@infos="showInfos = true"
					@stepForward="stepForward"
				/>
				<SignUp
					v-else-if="step === `signUp`"
					:userInfo="userInfo"
					@stepForward="stepForward"
					@updateUserInfo="updateUserInfo"
					@setIsLoading="setIsLoading"
				/>
			</div>
		</section>
		<p class="text-gray5 dark:text-gray3 px-4 py-5 pl-10 text-sm">
			© {{ new Date().getFullYear().toString() }} Capsule Social, Inc.
		</p>
		<div
			v-if="showInfos"
			class="popup bg-primary dark:bg-secondary modal-animation z-30 absolute top-0 right-0 flex h-full w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<InfosPopup @close="showInfos = false" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import 'intl-tel-input/build/css/intlTelInput.css'
import axios from 'axios'

import InviteCode from '@/components/register/InviteCode.vue'
import RegisterMethods from '@/components/register/RegisterMethods.vue'

import InfosPopup from '@/components/register/InfosPopup.vue'
import SignUp from '@/components/register/SignUp.vue'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import ogImage from '@/assets/images/util/ogImage.png'

import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'

import { removeNearPrivateKey, walletLogout } from '@/backend/near'
import { ValidationError } from '@/errors'
import { getInviteToken } from '@/backend/utilities/helpers'
import { getUserInfo, IWalletStatus } from '@/backend/auth'

interface IData {
	id: string
	userInfo: null | IWalletStatus
	isLoading: boolean
	showInfos: boolean
	dark: boolean
	step: `inviteCode` | `registerMethods` | `signUp` | `downloadKey`
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		InviteCode,
		RegisterMethods,
		InfosPopup,
		SignUp,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			userInfo: null,
			isLoading: true,
			showInfos: false,
			dark: false,
			step: `inviteCode`,
		}
	},
	head() {
		return {
			title: `Create an account on Blogchain`,
			meta: [
				{ hid: `register`, name: `register`, content: `Create a Blogchain account` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	errorCaptured(err: Error) {
		if (err instanceof ValidationError) {
			this.$toastWarning(err.message)
			return false
		}
		if (axios.isAxiosError(err)) {
			if (!err.response) {
				this.$toastError(`Network error, please try again`)
				return false
			}
			if (err.response.status === 429) {
				this.$toastError(`Too many requests, please try again in a minute`)
				return false
			}
			if (err.response.status === 400) {
				if (this.userInfo) {
					removeNearPrivateKey(this.userInfo.accountId)
				}
				walletLogout()
				window.localStorage.removeItem(`inviteToken`)
				if (err.response.data.error === `Cannot reuse token`) {
					window.localStorage.clear()
					this.userInfo = null
					this.step = `inviteCode`
				}
				this.isLoading = false
				this.stepForward()
			}
			this.$toastError(err.response.data.error)
			return false
		}

		this.$toastError(err.message)
		if (this.userInfo) {
			removeNearPrivateKey(this.userInfo.accountId)
		}
		window.localStorage.clear()
		walletLogout()
		return false
	},
	async created() {
		await this.stepForward()
	},
	mounted() {
		const accountId = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountId) {
			this.$router.push(`/home`)
		}
		this.dark = document.documentElement.classList.contains(`dark`)
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
		async stepForward() {
			this.isLoading = true
			const inviteToken = getInviteToken()

			if (!this.userInfo) {
				this.userInfo = await getUserInfo()
			}

			// Check if we already have any sign-in info set up

			this.isLoading = false
			if (inviteToken && !this.userInfo) {
				this.step = `registerMethods`
				return
			}

			if (this.userInfo) {
				this.step = `signUp`
				return
			}

			this.step = `inviteCode`
		},
		updateUserInfo(userInfo: IWalletStatus | null): void {
			this.userInfo = userInfo
		},
		setIsLoading(isLoading: boolean): void {
			this.isLoading = isLoading
		},
	},
})
</script>
