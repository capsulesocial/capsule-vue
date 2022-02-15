<template>
	<article>
		<div v-show="isLoading" class="modal-animation flex w-full justify-center xl:w-1/2 z-20">
			<div class="loader m-5 rounded-lg"></div>
		</div>
		<div v-show="!isLoading">
			<h1 class="text-primary font-semibold mb-10" style="font-size: 2.6rem">Sign up</h1>
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
			<button
				class="w-full flex flex-row items-center justify-center text-center mt-10 text-gray5 hover:text-primary text-sm"
				@click="$emit(`infos`)"
			>
				<InfoIcon class="mr-3 h-4 w-4" />
				<p>What Signup method should I choose?</p>
			</button>
			<p class="text-gray7 mt-10 text-center">
				Already have an account?
				<nuxt-link to="/login" class="text-primary text-center font-bold">Log in</nuxt-link>
			</p>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import axios from 'axios'

import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/customauth'

import GoogleIcon from '@/components/icons/brands/Google.vue'
import NearIcon from '@/components/icons/brands/Near.vue'
import DiscordIcon from '@/components/icons/Discord.vue'
import InfoIcon from '@/components/icons/Info.vue'

import { torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { getAccountIdFromPrivateKey } from '@/backend/auth'
import { getUsernameNEAR, walletLogin, generateAndSetKey, removeNearPrivateKey } from '@/backend/near'
import { verifyTokenAndOnboard } from '@/backend/invite'

interface IData {
	torus: DirectWebSdk
	isLoading: boolean
}

export default Vue.extend({
	components: {
		DiscordIcon,
		GoogleIcon,
		NearIcon,
		InfoIcon,
	},
	props: {
		checkFunds: {
			type: Function as PropType<() => void>,
			required: true,
		},
		verify: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			torus: new DirectWebSdk({
				baseUrl: `${process.env.DOMAIN}/oauth`,
				network: `testnet`, // details for test net
			}),
			isLoading: false,
		}
	},
	async created() {
		await Promise.all([this.torus.init()])
	},
	methods: {
		async torusLogin(type: TorusVerifiers) {
			this.isLoading = true
			try {
				const userInfo: TorusLoginResponse = await this.torus.triggerLogin(torusVerifiers[type])
				this.$emit(`updateUserInfo`, userInfo)
				const accountId: string = getAccountIdFromPrivateKey(userInfo.privateKey)
				this.$emit(`updateAccountId`, accountId)
				const [username] = await Promise.all([getUsernameNEAR(accountId), this.onboardAccount(accountId)])
				this.$emit(`updateUsername`, username)
				if (username) {
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
		async onboardAccount(accountId: string) {
			if (!accountId) {
				this.$toastError(`AccountId missing`)
				return
			}
			try {
				await verifyTokenAndOnboard(accountId)
			} catch (error: any) {
				if (axios.isAxiosError(error) && error.response) {
					if (error.response.status === 429) {
						this.$toastWarning(`Too many requests`)
						return
					}
					throw new Error(error.response.data.error)
				}
				throw error
			}
		},
		async walletLoginComponent() {
			await walletLogin()
		},
		async implicitAccountCreate() {
			const accountId: string = await generateAndSetKey()
			this.$emit(`updateAccountId`, accountId)
			const [username] = await Promise.all([
				getUsernameNEAR(accountId),
				this.checkFunds(),
				this.onboardAccount(accountId),
			])
			this.$emit(`updateUsername`, username)
			if (username) {
				this.$toastError(`You cannot login with implicit account, please import your Capsule private key`)
				removeNearPrivateKey(accountId)
			}
			this.$emit(`setNearWallet`)
		},
	},
})
</script>
