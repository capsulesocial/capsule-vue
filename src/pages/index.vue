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
					<article v-show="userInfo && !username">
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
						Ensure that the NEAR account with ID: "{{ accountId }}" has sufficient funds before registering.
						<BrandedButton :text="`Sign Up`" :action="verify" class="w-full" />
					</article>
					<BrandedButton
						v-show="!userInfo"
						:text="`Sign in or Sign up with Discord`"
						:action="() => torusLogin('discord')"
						class="w-full"
					/>
					<BrandedButton
						v-show="!userInfo"
						style="margin-top: 10px"
						:text="`Sign in or Sign up with Google`"
						:action="() => torusLogin('google')"
						class="w-full"
					/>
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

import { getAccountId, login, register } from '@/backend/auth'
import { Profile } from '@/backend/profile'
import { getUsernameNEAR } from '@/backend/near'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username: null | string
	accountId: null | string
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
				baseUrl: `http://localhost:3000/oauth`,
				network: `testnet`, // details for test net
			}),
			accountId: null,
			userInfo: null,
			username: null,
		}
	},
	async created() {
		await this.torus.init()
	},
	mounted() {
		if (this.$store.state.session.id !== ``) {
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
		async torusLogin(type: string) {
			switch (type) {
				case `google`:
					this.userInfo = await this.torus.triggerLogin({
						typeOfLogin: `discord`,
						verifier: `capsule-social-test-discord`,
						clientId: `906210984396468275`,
					})
					break
				case `discord`:
					this.userInfo = await this.torus.triggerLogin({
						typeOfLogin: `discord`,
						verifier: `capsule-social-test-discord`,
						clientId: `906210984396468275`,
					})
					break
				default:
					throw new Error(`Unknown login type`)
			}

			this.accountId = getAccountId(this.userInfo.privateKey)
			this.username = await getUsernameNEAR(this.accountId)
			if (this.username) {
				this.verify()
			}
		},
		async verify() {
			if (!this.userInfo) {
				throw new Error(`Unexpected condition!`)
			}
			try {
				// Login
				let profile: Profile | null = null
				let cid: string | null = null
				if (this.username) {
					const data = await login(this.username, this.userInfo.privateKey)
					profile = data.profile
					cid = data.profileCID
				} else {
					const idCheck = this.$qualityID(this.id)
					if (!idCheck) {
						alert(idCheck)
						return
					}
					const data = await register(this.id, this.userInfo.privateKey)
					profile = data.profile
					cid = data.cid
				}

				if (!profile || !cid) {
					throw new Error(`Unexpected condition!`)
				}

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
