<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r lg:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10 text-primary dark:text-secondary" />
		<section class="flex items-center justify-center" style="height: 86%">
			<div class="-mt-5 flex w-full flex-col items-center p-14">
				<!-- Step 1: Choose Login / register -->
				<article v-show="!userInfo && !isLoading" class="w-full lg:w-3/4 xl:w-1/2">
					<h1 class="text-primary dark:text-secondary mb-10 font-semibold" style="font-size: 2.6rem">Log in</h1>
					<button
						class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-2"
						@click="() => torusLogin('discord')"
					>
						<DiscordIcon style="width: 28px; height: 28px" />
						<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Log in with Discord</h6>
					</button>
					<button
						class="bg-gray2 dark:bg-gray7 focus:outline-none flex w-full items-center justify-center rounded-lg py-2"
						@click="() => torusLogin('google')"
					>
						<GoogleIcon style="width: 28px; height: 28px" />
						<h6 class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold">Log in with Google</h6>
					</button>
					<div class="my-6 flex w-full items-center justify-center">
						<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
						<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
						<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
					</div>
					<button
						class="bg-gray2 dark:bg-gray7 focus:outline-none mb-4 flex w-full items-center justify-center rounded-lg py-3"
						@click="handleKeyClick"
					>
						<FileIcon />
						<span class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold"> Import Blogchain private key </span>
						<input id="key" ref="key" type="file" name="key" accept=".json" class="hidden" @change="handleKey" />
					</button>
					<p class="text-gray7 dark:text-gray3 mt-10 text-center text-sm xl:text-base">
						Don't have an account yet?
						<nuxt-link to="/register" class="text-primary dark:text-secondary text-center font-bold">Sign up</nuxt-link>
					</p>
				</article>
				<!-- Step 2: Sign up -->
				<article v-show="!isLoading" class="w-full lg:w-3/4 xl:w-1/2">
					<div v-show="userInfo && username === null">
						<h1 class="text-primary dark:text-secondary text-4xl font-bold">Signup</h1>
						Looks like you don't have an account. Sign up
					</div>
				</article>
				<article v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
						:style="$colorMode.dark ? `border-top: 2px solid #7097ac` : `border-top: 2px solid #2e556a`"
					></div>
				</article>
			</div>
		</section>
		<p class="text-gray5 dark:text-gray3 px-4 pl-10 text-sm">© {{ currentYear }} Capsule Social, Inc.</p>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import DirectWebSdk, { TorusLoginResponse } from '@toruslabs/customauth'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import FileIcon from '@/components/icons/File.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, login, loginNearAccount } from '@/backend/auth'
import { getUserInfoNEAR, getUsernameNEAR } from '@/backend/near'
import { torusNetwork, torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { revokeDiscordKey } from '@/backend/discordRevoke'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'
import ogImage from '@/assets/images/util/ogImage.png'

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | TorusLoginResponse
	username?: null | string
	accountId: null | string
	isLoading: boolean
	phoneNumber: string
	accountIdInput: string
	privateKey: string
	currentYear: string
	keyFileTarget: HTMLInputElement | null
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		DiscordIcon,
		GoogleIcon,
		FileIcon,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			phoneNumber: ``,
			torus: new DirectWebSdk({
				baseUrl: `${process.env.DOMAIN}/oauth`,
				network: torusNetwork, // details for test net
			}),
			accountId: null,
			userInfo: null,
			isLoading: false,
			username: undefined,
			accountIdInput: ``,
			privateKey: ``,
			currentYear: ``,
			keyFileTarget: null,
		}
	},
	head() {
		return {
			title: `Login - Blogchain`,
			meta: [
				{ hid: `login`, name: `login`, content: `Log into Blogchain` },
				{ hid: `og:image`, property: `og:image`, content: `${document.location.origin}` + ogImage },
			],
		}
	},
	async created() {
		this.isLoading = true
		await this.torus.init()
		this.isLoading = false
	},
	mounted() {
		const accountId = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountId) {
			this.$router.push(`/home`)
		}
		const theDate = new Date()
		this.currentYear = theDate.getFullYear().toString()
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
				if (this.userInfo.userInfo.typeOfLogin === `discord`) {
					await revokeDiscordKey(this.userInfo.userInfo.accessToken)
				}
				this.accountId = getAccountIdFromPrivateKey(this.userInfo.privateKey)
				this.username = await getUsernameNEAR(this.accountId)

				if (!this.username) {
					// If no username is found then register...
					this.$toastWarning(`looks like you don't have an account`)
					this.$router.push(`/register`)
					return
				}

				const { blocked } = await getUserInfoNEAR(this.username)
				if (blocked) {
					// If account is blocked then send to register page...
					this.$toastError(`Your account has been deactivated or banned`)
					this.$router.push(`/register`)
					return
				}
				// If a username is found then proceed to login...
				this.verify()
				return
			} catch (e: any) {
				this.$toastError(`oops, ` + e)
				this.isLoading = false
			}
		},
		handleKeyClick(): void {
			const b = this.$refs.key as HTMLElement
			b.click()
		},
		handleKey(e: HTMLInputEvent): void {
			this.keyFileTarget = e.target
			if (!e.target.files) {
				return
			}
			const keyFile = e.target.files[0]
			if (keyFile) {
				const reader = new FileReader()
				reader.readAsText(keyFile)
				reader.onload = (i: Event) => {
					if (i.target !== null && reader.result !== null) {
						try {
							const key = JSON.parse(reader.result as string)
							this.accountIdInput = key.accountId
							this.privateKey = key.privateKey
							this.walletLogin()
						} catch (error) {
							if (this.keyFileTarget) {
								this.keyFileTarget.value = ``
							}
							this.$handleError(error)
						}
					}
				}
			}
		},
		async verify() {
			try {
				if (!this.userInfo || !this.accountId) {
					throw new Error(`Unexpected condition!`)
				}
				this.isLoading = true

				if (!this.username) {
					this.$toastWarning(`looks like you don't have an account`)
					this.$router.push(`/register`)
					return
				}

				// Login
				const { profile, cid } = await login(this.username, this.userInfo.privateKey)
				window.localStorage.setItem(`accountId`, this.accountId)
				const account = createSessionFromProfile(cid, profile)
				this.changeCID(cid)
				this.changeID(account.id)
				this.changeName(account.name)
				this.changeEmail(account.email)
				this.changeAvatar(account.avatar)
				this.changeBio(account.bio)
				this.changeLocation(account.location)
				this.$router.push(`/home`)
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
		async walletLogin(): Promise<void> {
			try {
				this.username = await getUsernameNEAR(this.accountIdInput)
				if (!this.username) {
					this.$toastWarning(`looks like you don't have an account`)
					this.$router.push(`/register`)
					return
				}

				const { blocked } = await getUserInfoNEAR(this.username)
				if (blocked) {
					// If account is blocked then send to register page...
					this.$toastError(`Your account has been deactivated or banned`)
					this.$router.push(`/register`)
					return
				}
				this.walletVerify()
			} catch (error) {
				if (this.keyFileTarget) {
					this.keyFileTarget.value = ``
				}
				this.$handleError(error)
			}
		},
		async walletVerify() {
			try {
				if (!this.accountIdInput || !this.privateKey || !this.username) {
					throw new Error(`Unexpected condition!`)
				}
				this.isLoading = true

				const { profile, cid } = await loginNearAccount(this.username, this.privateKey, this.accountIdInput)
				window.localStorage.setItem(`accountId`, this.accountIdInput)
				const account = createSessionFromProfile(cid, profile)
				this.changeCID(cid)
				this.changeID(account.id)
				this.changeName(account.name)
				this.changeEmail(account.email)
				this.changeAvatar(account.avatar)
				this.changeBio(account.bio)
				this.changeLocation(account.location)
				this.$router.push(`/home`)
			} catch (err: unknown) {
				this.isLoading = false
				this.$handleError(err)
			}
		},
	},
})
</script>
