<template>
	<main
		style="backdrop-filter: blur(10px)"
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop h-screen w-full flex-col justify-between overflow-y-scroll bg-gradient-to-r lg:w-3/5"
	>
		<CapsuleIcon class="pt-6 pl-10 text-lightPrimaryText dark:text-gray1" />
		<section class="flex items-center justify-center" style="height: 86%">
			<div class="-mt-5 flex w-full flex-col items-center p-14">
				<!-- Step 1: Choose Login / register -->
				<article v-show="!userInfo && !isLoading" class="w-full lg:w-3/4 xl:w-1/2">
					<h1 class="text-lightPrimaryText dark:text-gray1 mb-10 font-semibold" style="font-size: 2.6rem">Log in</h1>
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
					<div class="flex w-full mb-4 relative">
						<button
							class="bg-gray2 dark:bg-gray7 mr-2 focus:outline-none flex w-full items-center justify-center rounded-lg py-3"
							@click="handleKeyClick"
						>
							<FileIcon />
							<span class="text-gray7 dark:text-gray2 ml-4 text-sm font-semibold"> Import Blogchain private key </span>
							<input id="key" ref="key" type="file" name="key" accept=".json" class="hidden" @change="handleKey" />
						</button>
						<div
							class="bg-gray2 dark:bg-gray7 focus:outline-none rounded-lg p-3 flex justify-center items-center cursor-pointer"
							@mouseenter="showInfo = true"
							@mouseleave="showInfo = false"
						>
							<InfoIcon class="h-6 w-6 text-gray5 dark:text-gray3" />
						</div>
						<div
							v-show="showInfo"
							class="absolute z-10 border-lightBorder modal-animation rounded-lg border bg-lightBG dark:bg-gray7 p-2 shadow-lg text-gray5 dark:text-gray1 self-center text-xs"
							:class="$colorMode.dark ? `LoginInfoOpenDark` : `LoginInfoOpen`"
							style="top: 55px; right: 0"
						>
							This is a Blogchain-specific key, not a NEAR seed phrase. We will never ask for your NEAR seed phrase and
							make sure you are only importing your Blogchain key to https://blogchain.app/login
						</div>
					</div>
					<p class="text-gray7 dark:text-gray3 mt-10 text-center text-sm xl:text-base">
						Don't have an account yet?
						<nuxt-link to="/register" class="text-primary text-center font-bold">Sign up</nuxt-link>
					</p>
				</article>
				<!-- Step 2: Sign up -->
				<article v-show="!isLoading" class="w-full lg:w-3/4 xl:w-1/2">
					<div v-show="userInfo && username === null">
						<h1 class="text-primary text-4xl font-bold">Signup</h1>
						Looks like you don't have an account. Sign up
					</div>
				</article>
				<article v-show="isLoading" class="modal-animation flex w-full justify-center lg:w-3/4">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
						:style="`border-top: 2px solid` + $color.hex"
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
import DirectWebSdk, { UX_MODE } from '@toruslabs/customauth'

import CapsuleIcon from '@/components/icons/CapsuleNew.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import FileIcon from '@/components/icons/File.vue'
import InfoIcon from '@/components/icons/Info.vue'

import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { getAccountIdFromPrivateKey, login, loginNearAccount } from '@/backend/auth'
import { getUserInfoNEAR, getUsernameNEAR } from '@/backend/near'
import { domain, torusNetwork, torusVerifiers, TorusVerifiers } from '@/backend/utilities/config'
import { revokeDiscordKey } from '@/backend/discordRevoke'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'

interface ITorusResponse {
	userInfo: { accessToken: string; typeOfLogin: `discord` | `google` }
	privateKey: string
}

interface IData {
	id: string
	torus: DirectWebSdk
	userInfo: null | ITorusResponse
	username: null | string
	accountId: null | string
	isLoading: boolean
	accountIdInput: string
	privateKey: string
	currentYear: string
	keyFileTarget: HTMLInputElement | null
	showInfo: boolean
}

export default Vue.extend({
	components: {
		CapsuleIcon,
		DiscordIcon,
		GoogleIcon,
		FileIcon,
		InfoIcon,
	},
	layout: `unauth`,
	data(): IData {
		return {
			id: ``,
			torus: new DirectWebSdk({
				baseUrl: `${domain}`,
				redirectPathName: `login`,
				network: torusNetwork, // details for test net
				uxMode: UX_MODE.REDIRECT,
			}),
			accountId: null,
			userInfo: null,
			isLoading: true,
			username: null,
			accountIdInput: ``,
			privateKey: ``,
			currentYear: ``,
			keyFileTarget: null,
			showInfo: false,
		}
	},
	head() {
		return {
			title: `Login - Blogchain`,
			meta: [{ hid: `login`, name: `login`, content: `Log into Blogchain` }],
		}
	},
	async mounted() {
		this.isLoading = true
		const theDate = new Date()
		this.currentYear = theDate.getFullYear().toString()
		const accountIdLocalStorage = window.localStorage.getItem(`accountId`)
		if (this.$store.state.session.id !== `` && accountIdLocalStorage) {
			this.$router.push(`/home`)
			return
		}

		try {
			let res: ITorusResponse | null = null
			try {
				const info = await this.torus.getRedirectResult()
				res = info.result as ITorusResponse
			} catch (err) {
				// the error here can be safely dismissed (it will also error out in nominal cases)
			}

			if (!res) {
				await this.torus.init({ skipSw: true })
				return
			}

			if (res.userInfo.typeOfLogin === `discord`) {
				this.discordRevoke(res.userInfo.accessToken)
			}
			this.userInfo = res
			this.accountId = getAccountIdFromPrivateKey(res.privateKey)
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

			await this.verify()
		} catch (err: unknown) {
			if (err instanceof Error) {
				this.$toastError(err.message)
				return
			}

			throw err
		} finally {
			this.isLoading = false
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
			changeWebsite: MutationType.CHANGE_WEBSITE,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		async torusLogin(type: TorusVerifiers) {
			try {
				this.isLoading = true
				await this.torus.triggerLogin(torusVerifiers[type])
			} finally {
				this.isLoading = false
			}
		},
		async discordRevoke(accessToken: string) {
			try {
				await revokeDiscordKey(accessToken)
			} catch (err) {
				this.$toastWarning(`We couldn't revoke the Discord key, this might hinder you to login for the next 30 minutes`)
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
				this.changeWebsite(account.website)
				this.$store.dispatch(`paymentProfile/fetchProfile`, { username: account.id })
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
				this.changeWebsite(account.website)
				this.$store.dispatch(`paymentProfile/fetchProfile`, { username: account.id })
				this.$router.push(`/home`)
			} catch (err: unknown) {
				this.isLoading = false
				this.$handleError(err)
			}
		},
	},
})
</script>

<style>
.LoginInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
.LoginInfoOpenDark::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	right: 1rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #686868;
	border-radius: 2px;
	z-index: 1;
}
</style>
