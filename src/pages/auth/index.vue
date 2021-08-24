<template>
	<main class="min-h-screen flex flex-col md:justify-center py-10">
		<div class="self-center mb-5">
			<CapsuleIcon />
		</div>
		<!-- Login -->
		<section class="bg-white mx-auto lg:w-full lg:max-w-md rounded shadow-lg divide-y divide-gray-200">
			<article class="flex justify-around">
				<span v-if="isLogin" class="text-primary p-5 inline-block border-b-2 border-primary font-bold"> Sign In </span>
				<button v-if="!isLogin" class="focus:outline-none" @click="toggleFormType">Sign In</button>
				<span v-if="!isLogin" class="text-primary p-5 inline-block border-b-2 border-primary font-bold"> Sign Up </span>
				<button v-else class="focus:outline-none" @click="toggleFormType">Sign Up</button>
			</article>

			<article class="px-10 py-6 font-sans">
				<!-- Register: Name -->
				<label v-if="!isLogin" for="name" class="font-semibold text-sm text-gray-600 pb-1 block">Name</label>
				<input
					v-if="!isLogin"
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
				<label for="id" class="font-semibold text-sm text-gray-600 pb-1 block">ID</label>
				<input
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
				<label v-if="!isLogin" for="contact" class="font-semibold text-sm text-gray-600 pb-1 block">Contact</label>
				<input
					v-if="!isLogin"
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
				<label for="password" class="font-semibold text-sm text-gray-600 pb-1 block">Password</label>
				<input
					id="loginPassword"
					v-model="password"
					type="password"
					placeholder="************"
					class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
				/>
				<label v-if="!isLogin" for="confirmPassword" class="font-semibold text-sm text-gray-600 pb-1 block"
					>Confirm Password</label
				>
				<input
					v-if="!isLogin"
					id="confirmPassword"
					v-model="confirmPassword"
					type="password"
					placeholder="************"
					class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
				/>
				<BrandedButton :text="isLogin ? 'Sign In' : 'Sign Up'" :action="verify" class="w-full" />
			</article>
			<article
				v-if="isLogin"
				class="text-center whitespace-nowrap flex justify-between text-sm p-5 text-gray-600 font-sans"
			>
				<button class="px-4 py-2 focus:outline-none">Forgot Password</button>
				<button class="px-4 py-2 focus:outline-none">Help</button>
			</article>
			<article v-else class="flex justify-center">
				<label class="items-center p-5 text-gray-600 inline-flex">
					<input v-model="consent" type="checkbox" class="form-checkbox h-4 w-4 text-primary" checked /><span
						class="ml-2 text-gray-700 font-sans"
						>I agree to the Terms and Conditions
					</span>
				</label>
			</article>
		</section>
		<BrandedButton class="fixed bottom-0 m-5" text="Admin Bypass (for development)" :action="adminBypass" />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import CapsuleIcon from '@/components/icons/Capsule.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import { MutationType, namespace as sessionStoreNamespace } from '~/store/session'
import { Profile } from '~/interfaces/Profile'
import { signedInToWallet } from '~/plugins/near'
import { sendProfileServer } from '~/plugins/server'
export default Vue.extend({
	components: {
		CapsuleIcon,
		BrandedButton,
	},
	layout: `unauth`,
	data() {
		return {
			isLogin: true,
			name: ``,
			id: ``,
			email: ``,
			password: ``,
			confirmPassword: null,
			consent: true,
		}
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
		}),
		toggleFormType() {
			this.isLogin = !this.isLogin
			// Request wallet sign-in for new capsule users
			// provided wallet credentials aren't already present
			// in LocalStorage
			if (this.isLogin === false) {
				if (!signedInToWallet()) {
					// Request wallet sign-in
					this.$walletLogin()
				}
			}
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
				const { success, profileCID } = await this.$login(this.id, this.password)
				if (success === true && signedInToWallet()) {
					const account = await this.$getProfile(profileCID)
					account.cid = profileCID
					this.changeCID(profileCID)
					this.changeID(account.id)
					this.changeName(account.name)
					this.changeEmail(account.email)
					this.$router.push(`/settings`)
				} else {
					alert(`Authentication failed!`)
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
					const account: Profile = {
						cid: ``,
						id: this.id,
						name: this.name,
						email: this.email,
						password: ``,
						bio: `Default bio.`,
						location: ``,
						posts: [],
						reposts: [],
						socials: [],
						bookmarks: [],
						categories: [],
						comments: [],
						followers: [],
						following: [],
						avatar: ``,
					}
					// Send user profile to IPFS
					const cid = await this.$sendProfile(account)
					const serverProfile = await sendProfileServer(cid, account)
					if (serverProfile.success === false) {
						alert(`Invalid entry`)
						return
					}
					account.cid = cid
					account.password = this.password
					const _res = await this.$register(account, cid)
					if (_res === true) {
						// Registration successful
						this.changeCID(cid)
						this.changeID(this.id)
						this.changeName(this.name)
						this.changeEmail(this.email)
						this.$router.push(`/settings`)
					} else {
						alert(`Registration Unsuccessful!`)
					}
				} else {
					alert(`Password mismatch!`)
				}
			}
		},
		adminBypass() {
			this.changeCID(`Qmdors4fRHTT6ut6BAjNHEARxfbnBwHSbyz7BaD4oJPwzZ`)
			this.changeID(`admin`)
			this.changeName(`Capsule Admin`)
			this.changeEmail(`admin@admin.com`)
			this.$router.push(`/settings`)
		},
	},
})
</script>
