<template>
	<article>
		<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20">
			<div
				class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
				:style="`border-top: 2px solid` + $color.hex"
			></div>
		</div>
		<div v-show="!isLoading">
			<h1 class="text-lightPrimaryText dark:text-gray1 mb-10 font-semibold" style="font-size: 2.6rem">Sign up</h1>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-2"
				@click="() => torusLogin('discord')"
			>
				<DiscordIcon style="width: 28px; height: 28px; color: #8c9eff" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Sign up with Discord</h6>
			</button>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none flex w-full items-center justify-center rounded-lg py-2"
				@click="() => torusLogin('google')"
			>
				<GoogleIcon style="width: 28px; height: 28px" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Sign up with Google</h6>
			</button>
			<div class="my-6 flex w-full items-center justify-center">
				<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
				<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
				<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
			</div>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
				@click="walletLoginComponent"
			>
				<NearIcon style="width: 22px; height: 22px" />
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Signup with NEAR</h6>
			</button>
			<button
				class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
				@click="implicitAccountCreate"
			>
				<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Create implicit account</h6>
			</button>
			<button
				class="w-full flex flex-row items-center justify-center text-center mt-10 text-gray5 dark:text-gray3 hover:text-primary dark:hover:text-primary text-sm"
				@click="$emit(`infos`)"
			>
				<InfoIcon class="mr-3 h-4 w-4" />
				<p>What Signup method should I choose?</p>
			</button>
			<p class="text-gray7 dark:text-gray3 mt-10 text-center">
				Already have an account?
				<nuxt-link to="/login" class="text-primary text-center font-bold">Log in</nuxt-link>
			</p>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import DirectWebSdk from '@toruslabs/customauth'

import GoogleIcon from '@/components/icons/brands/Google.vue'
import NearIcon from '@/components/icons/brands/Near.vue'
import DiscordIcon from '@/components/icons/Discord.vue'
import InfoIcon from '@/components/icons/Info.vue'

import { domain, torusNetwork, torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { getAccountIdFromPrivateKey, IWalletStatus } from '@/backend/auth'
import { walletLogin, generateAndSetKey } from '@/backend/near'
import { revokeDiscordKey } from '@/backend/discordRevoke'

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
	props: {},
	data(): IData {
		return {
			torus: new DirectWebSdk({
				baseUrl: `${domain}/oauth`,
				network: torusNetwork, // details for test net
			}),
			isLoading: false,
		}
	},
	async created() {
		this.isLoading = true
		await this.torus.init()
		this.isLoading = false
	},
	methods: {
		async torusLogin(type: TorusVerifiers) {
			this.isLoading = true
			try {
				const info = await this.torus.triggerLogin(torusVerifiers[type])
				if (info.userInfo.typeOfLogin === `discord`) {
					await revokeDiscordKey(info.userInfo.accessToken)
				}
				const accountId = getAccountIdFromPrivateKey(info.privateKey)
				const userInfo: IWalletStatus = {
					type: `torus`,
					accountId,
					privateKey: info.privateKey,
				}
				this.$emit(`updateUserInfo`, userInfo)
				this.$emit(`stepForward`)
				// If no username is found then register...
				this.isLoading = false
			} catch (e) {
				this.isLoading = false
				throw e
			}
		},
		async walletLoginComponent() {
			await walletLogin()
		},
		implicitAccountCreate() {
			this.isLoading = true
			const { accountId, privateKey } = generateAndSetKey()
			const userInfo: IWalletStatus = {
				type: `near`,
				accountId,
				privateKey,
			}
			this.$emit(`updateUserInfo`, userInfo)
			this.$emit(`stepForward`)
			this.isLoading = false
		},
	},
})
</script>
