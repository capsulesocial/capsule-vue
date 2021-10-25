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
				<article class="flex justify-around">
					<span v-show="isLogin" class="text-primary p-5 inline-block border-b-2 border-primary font-bold">
						Sign In
					</span>
					<button v-show="!isLogin" class="focus:outline-none" @click="toggleFormType">Sign In</button>
					<span v-show="!isLogin" class="text-primary p-5 inline-block border-b-2 border-primary font-bold">
						Sign Up
					</span>
					<button v-show="isLogin" class="focus:outline-none" @click="toggleFormType">Sign Up</button>
				</article>

				<article class="px-10 py-6 font-sans">
					<!-- Connect Wallet -->
					<div class="flex justify-center">
						<BrandedButton
							v-show="!walletConnected && !isLogin"
							class="w-64"
							:action="$walletLogin"
							text="Connect Wallet"
						/>
						<h6 v-show="walletConnected && !isLogin" class="text-center italics text-gray-600">Wallet connected</h6>
					</div>

					<!-- Register: Name -->
					<label v-show="!isLogin && walletConnected" for="name" class="font-semibold text-sm text-gray-600 pb-1 block"
						>Name</label
					>
					<input
						v-show="!isLogin && walletConnected"
						id="name"
						v-model="name"
						type="text"
						placeholder="Tom Brady"
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
					<!-- Sign in + Register: ID -->
					<label
						v-show="isLogin || (!isLogin && walletConnected)"
						for="id"
						class="font-semibold text-sm text-gray-600 pb-1 block"
						>ID</label
					>
					<input
						v-show="isLogin || (!isLogin && walletConnected)"
						id="id"
						v-model="id"
						type="text"
						placeholder="tombrady"
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
					<!-- Register: Contact -->
					<label
						v-show="walletConnected && !isLogin"
						for="contact"
						class="font-semibold text-sm text-gray-600 pb-1 block"
						>Contact</label
					>
					<input
						v-show="walletConnected && !isLogin"
						id="contact"
						v-model="email"
						type="email"
						placeholder="tb12@nfl.com"
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
					<label
						v-show="isLogin || (walletConnected && !isLogin)"
						for="password"
						class="font-semibold text-sm text-gray-600 pb-1 block"
						>Password</label
					>
					<input
						v-show="isLogin || (walletConnected && !isLogin)"
						id="loginPassword"
						v-model="password"
						type="password"
						placeholder="************"
						class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
					/>
					<label
						v-show="walletConnected && !isLogin"
						for="confirmPassword"
						class="font-semibold text-sm text-gray-600 pb-1 block"
						>Confirm Password</label
					>
					<input
						v-show="walletConnected && !isLogin"
						id="confirmPassword"
						v-model="confirmPassword"
						type="password"
						placeholder="************"
						class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
					/>
					<BrandedButton
						v-show="isLogin || (walletConnected && !isLogin)"
						:text="isLogin ? 'Sign In' : 'Sign Up'"
						:action="verify"
						class="w-full"
					/>
				</article>
				<article
					v-show="isLogin"
					class="text-center whitespace-nowrap flex justify-between text-sm p-5 text-gray-600 font-sans"
				>
					<button class="px-4 py-2 focus:outline-none">Forgot Password</button>
					<button class="px-4 py-2 focus:outline-none">Help</button>
				</article>
				<article v-show="walletConnected && !isLogin" class="flex justify-center">
					<label class="items-center p-5 text-gray-600 inline-flex">
						<input v-model="consent" type="checkbox" class="form-checkbox h-4 w-4 text-primary" checked /><span
							class="ml-2 text-gray-700 font-sans"
							>I agree to the Terms and Conditions
						</span>
					</label>
				</article>
			</section>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import CapsuleIcon from '@/components/icons/Capsule.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import { MutationType, createSessionFromProfile, namespace as sessionStoreNamespace } from '~/store/session'

import { signedInToWallet } from '@/backend/near'
import { login, register } from '@/backend/auth'

interface IData {
	isLogin: boolean
	name: string
	id: string
	email: string
	password: string
	confirmPassword: string | null
	consent: boolean
	walletConnected: boolean
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
			isLogin: false,
			name: ``,
			id: ``,
			email: ``,
			password: ``,
			confirmPassword: null,
			consent: true,
			walletConnected: false,
		}
	},
	created() {
		this.walletConnected = signedInToWallet()
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
		toggleFormType() {
			this.isLogin = !this.isLogin
			this.walletConnected = signedInToWallet()
		},
		async verify() {
			const pwCheck = this.$qualityPassword(this.password)
			const idCheck = this.$qualityID(this.id)
			if (pwCheck !== true) {
				alert(pwCheck)
				return
			}
			if (idCheck !== true) {
				alert(idCheck)
				return
			}
			// Login
			if (this.isLogin) {
				try {
					const { profile: backendProfile, profileCID } = await login(this.id, this.password)
					if (!signedInToWallet()) {
						throw new Error(`Authentication failed!`)
					}
					const account = createSessionFromProfile(profileCID, backendProfile)
					this.changeCID(profileCID)
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
			} else {
				// Registration
				if (!this.consent) {
					alert(`Please accept the Terms & Conditions`)
					return
				}
				if (this.$qualityEmail(this.email) !== true) {
					alert(`Invalid email!`)
					return
				}
				if (this.password === this.confirmPassword) {
					try {
						const { cid, profile } = await register(this.id, this.password, this.name, this.email)
						// Registration successful
						const account = createSessionFromProfile(cid, profile)
						this.changeCID(cid)
						this.changeID(account.id)
						this.changeName(account.name)
						this.changeEmail(account.email)
						this.changeAvatar(account.avatar)
						this.changeBio(account.bio)
						this.changeLocation(account.location)
						this.$router.push(`/settings`)
					} catch (err) {
						alert(`Registration Unsuccessful!`)
						throw err
					}
				} else {
					alert(`Password mismatch!`)
				}
			}
		},
	},
})
</script>
