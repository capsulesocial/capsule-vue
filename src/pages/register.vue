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
				<InviteCode v-if="step === `inviteCode`" class="w-full xl:w-1/2" @validInviteCode="stepForward" />
				<!-- Step 1: Choose Login / register -->
				<RegisterMethods
					v-else-if="step === `registerMethods`"
					class="w-full xl:w-1/2"
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
		<p class="text-gray5 dark:text-gray3 px-4 pl-10 text-sm">
			© {{ new Date().getFullYear().toString() }} Capsule Social, Inc.
		</p>
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
import 'intl-tel-input/build/css/intlTelInput.css'
import axios from 'axios'

import InviteCode from '@/components/register/InviteCode.vue'
import RegisterMethods from '@/components/register/RegisterMethods.vue'

import InfosPopup from '@/components/register/InfosPopup.vue'
import SignUp from '@/components/register/SignUp.vue'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
// @ts-ignore
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
			if (err.response.status === 400) {
				if (this.userInfo) {
					removeNearPrivateKey(this.userInfo.accountId)
				}
				walletLogout()
				window.localStorage.removeItem(`inviteToken`)
				this.isLoading = false
				this.stepForward()
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
		if (document.documentElement.classList.contains(`dark`)) {
			this.dark = true
		} else {
			this.dark = false
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
		async stepForward() {
			this.isLoading = true
			const inviteToken = getInviteToken()
			this.userInfo = await getUserInfo()

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
