<template>
	<main>
		<nav class="flex flex-row flex-wrap justify-between p-5">
			<div class="flex items-center">
				<span class="mr-5"><CapsuleIcon /></span>
				<h1 class="text-3xl italic font-bold">Capsule Social</h1>
			</div>
			<section>
				<p class="text-center">Join the Community</p>
				<div class="flex items-center justify-center">
					<a href="https://twitter.com/capsule_social" target="_blank">
						<TwitterIcon />
					</a>

					<a href="https://discord.gg/sZWjf3E6bY" target="_blank" class="ml-6 bg-white rounded-lg">
						<DiscordIcon class="w-24" />
					</a>
				</div>
			</section>
		</nav>

		<div class="flex flex-col mt-10">
			<!-- Login -->
			<section class="bg-white mx-auto lg:w-full lg:max-w-md rounded shadow-lg divide-y divide-gray-200">
				<article class="px-10 py-6 font-sans">
					<!-- Sign in + Register: ID -->
					<article v-show="userInfo && username === null">
						<label for="id" class="font-semibold text-sm text-gray-600 pb-1 block">ID</label>
						<input
							id="id"
							v-model="id"
							type="text"
							placeholder=""
							class="
								border
								rounded-lg
								px-3
								py-2
								mt-1
								mb-5
								text-sm
								w-full
								focus:outline-none focus:border-primary
								text-primary
								font-sans
							"
						/>
						<p class="text-center">
							Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before signing up.
						</p>
						<BrandedButton :text="`Sign Up`" :action="verify" class="w-full" />
					</article>
					<article v-show="!userInfo">
						<p style="margin-bottom: 10px" class="text-center">Sign in or sign up using...</p>
						<BrandedButton :text="`Discord`" :action="() => torusLogin('discord')" class="w-full" />
						<BrandedButton
							style="margin-top: 10px"
							:text="`Google`"
							:action="() => torusLogin('google')"
							class="w-full"
						/>
					</article>
					<article v-show="this.isLoading" class="flex justify-center h-screen">
						<div class="loader m-5"></div>
					</article>
				</article>
				<article class="text-center whitespace-nowrap flex justify-between text-sm p-5 text-gray-600 font-sans">
					<button class="px-4 py-2 focus:outline-none">Help</button>
				</article>
			</section>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
// eslint-disable-next-line import/named
import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/torus-direct-web-sdk'

import CapsuleIcon from '@/components/icons/Capsule.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import BrandedButton from '@/components/BrandedButton.vue'

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
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		TwitterIcon,
		DiscordIcon,
		BrandedButton,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			torus: new DirectWebSdk({
				baseUrl: `${process.env.DOMAIN}/oauth`,
				network: `testnet`, // details for test net
			}),
			accountId: null,
			userInfo: null,
			isLoading: false,
			username: undefined,
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
			this.userInfo = await this.torus.triggerLogin(torusVerifiers[type])
			this.isLoading = true

			this.accountId = getAccountIdFromPrivateKey(this.userInfo.privateKey)
			this.username = await getUsernameNEAR(this.accountId)
			if (this.username) {
				this.verify()
				return
			}
			this.isLoading = false
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
				this.$router.push(`/settings`)
			} catch (err: any) {
				alert(err.message)
			}
		},
	},
})
</script>
