<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="bg-gradient-to-r from-lightBGStart to-lightBGStop w-3/5 h-screen overflow-y-scroll flex-col justify-between"
	>
		<CapsuleIcon class="pt-6 pl-10" />
		<section class="flex justify-center items-center" style="height: 86%">
			<div class="flex flex-col items-center w-full p-14 -mt-5">
				<!-- Step 1: Choose Login / register -->
				<article v-show="!userInfo && !isLoading" class="w-1/2">
					<h1 class="font-semibold text-primary mb-10" style="font-size: 2.6rem">Log in</h1>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-4 py-2 flex justify-center items-center focus:outline-none"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon style="width: 28px; height: 28px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Log in with Discord</h6>
					</button>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 py-2 flex justify-center items-center focus:outline-none"
						@click="() => torusLogin('google')"
					>
						<GoogleIcon style="width: 28px; height: 28px" />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Log in with Google</h6>
					</button>
					<div class="w-full flex justify-center items-center my-6">
						<span class="border border-gray5 flex-grow rounded-lg" style="height: 1px"></span>
						<p class="px-4 text-gray5 text-xs">OR</p>
						<span class="border border-gray5 flex-grow rounded-lg" style="height: 1px"></span>
					</div>
					<button
						class="w-full rounded-lg w-1/2 bg-gray2 mb-4 py-3 flex justify-center items-center focus:outline-none"
					>
						<FileIcon />
						<h6 class="font-semibold text-gray7 text-sm ml-4">Import private key</h6>
					</button>
					<p class="text-center text-gray7 mt-10">
						Don't have an account yet?
						<nuxt-link to="/register" class="text-center font-bold text-primary">Sign up</nuxt-link>
					</p>
				</article>
				<!-- Step 2: Sign up -->
				<article v-show="!isLoading" class="w-1/2">
					<div v-show="userInfo && username === null">
						<h1 class="text-4xl text-primary font-bold">Signup</h1>
						Looks like you don't have an account. Sign up
					</div>
				</article>
				<article v-show="isLoading" class="w-3/4 flex justify-center">
					<div class="loader m-5 rounded-lg"></div>
				</article>
			</div>
		</section>
		<p class="px-4 text-gray5 text-sm pl-10">© 2021 Capsule.Social</p>
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
import FileIcon from '@/components/icons/File.vue'
// import TwitterIcon from '@/components/icons/brands/Twitter.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, login, register } from '@/backend/auth'
import { getUsernameNEAR } from '@/backend/near'
import { torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'

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
		FileIcon,
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
		async torusLogin(type: TorusVerifiers) {
			this.isLoading = true
			try {
				this.userInfo = await this.torus.triggerLogin(torusVerifiers[type])

				this.accountId = getAccountIdFromPrivateKey(this.userInfo.privateKey)
				this.username = await getUsernameNEAR(this.accountId)
				if (this.username) {
					// If a username is found then proceed to login...
					this.verify()
					return
				}

				// If no username is found then register...
				alert(`looks like you don't have an account`)
				this.$router.push(`/register`)
			} catch (e) {
				// eslint-disable-next-line no-console
				console.log(e)
				this.isLoading = false
			}
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
				this.$router.push(`/home`)
			} catch (err: any) {
				alert(err.message)
			}
		},
	},
})
</script>
