<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-4 flex items-center xl:hidden">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">All Settings</h6>
		</nuxt-link>
		<!-- Account Security -->
		<h2 class="text-primary mb-4 text-sm font-semibold">Account Security</h2>
		<!-- ID -->
		<div class="mb-4 flex w-full flex-row items-center">
			<label for="id" class="w-32 font-semibold">Identifier</label>
			<input
				id="id"
				type="text"
				:placeholder="$store.state.session.id"
				class="bg-gray1 text-gray5 placeholder-gray5 flex-grow rounded-lg px-2 py-1"
				disabled
			/>
		</div>
		<!-- Export Private Key -->
		<div class="mb-4 flex w-full flex-row items-center">
			<label for="export" class="w-32 font-semibold">Capsule Private Key</label>
			<button id="export" class="text-primary focus:outline-none" @click="downloadPrivateKey">
				Export Capsule Private Key
			</button>
		</div>
		<!-- Account Profile -->
		<h2 class="text-primary py-4 text-sm font-semibold">Account Profile</h2>
		<div class="mb-4 flex w-full flex-row items-center justify-between xl:justify-start">
			<label for="editProfile" class="w-32 font-semibold">Public Profile</label>
			<button class="bg-secondary focus:outline-none block rounded-lg xl:hidden" @click="redirectProfile">
				<PencilIcon class="m-2 h-5 w-5 text-white" />
			</button>
			<SecondaryButton :text="`Edit Profile`" :action="redirectProfile" class="hidden xl:block" />
		</div>
		<!-- Account Data -->
		<!-- <h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Data</h2>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Your Capsule data</h3>
			<button class="text-primary focus:outline-none">Request a download of your Capsule data</button>
		</div>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Deactivate My Account</h3>
			<button class="text-negative focus:outline-none">Deactivate my Capsule Account</button>
		</div> -->
		<!-- Account Invites -->
		<h2 class="text-primary mb-4 pt-4 text-sm font-semibold">Account Invites</h2>
		<div
			class="from-lightBGStart to-lightBGStop border-lightBorder relative mt-4 overflow-hidden rounded-lg bg-gradient-to-r p-5 shadow-lg"
		>
			<label for="id" class="mb-2 block pb-1 text-sm font-semibold">Generate an invite code</label>
			<p class="text-gray5">
				Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
				release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to
				seed a vibrant community that will grow over time. As an already registered user, you can invite one member from
				your social circle to participate to the Blogchain beta by sharing the following invite code:
			</p>
			<p class="mt-4 text-sm" :class="inviteCodesRemaining > 0 ? `text-primary` : `text-negative`">
				You have {{ inviteCodesRemaining }} invites remaining
			</p>
			<div class="mt-3 flex flex-col items-start xl:items-center xl:flex-row">
				<h3 class="mr-4 font-semibold">Invite code</h3>
				<div class="relative mr-0 xl:mr-4 flex my-4 xl:my-0 w-full items-center xl:w-2/5">
					<input
						id="id"
						ref="code"
						v-model="generatedInviteCode"
						type="text"
						placeholder="Eg. a5bX2cYY"
						class="focus:outline-none focus:border-primary text-primary bg-gray2 border-primary w-full rounded-lg border border-dashed px-4 py-2 font-sans text-sm"
						style="height: 3rem"
						@focus="$event.target.select()"
					/>
					<button class="text-primary focus:outline-none absolute right-0 mr-4 text-xs" @click="copyURL">
						<CopyIcon class="h-5 w-5 fill-current" />
					</button>
				</div>
				<button
					v-if="inviteCodesRemaining >= 1"
					class="text-primary focus:outline-none text-sm text-right"
					@click="generateNewInviteCode"
				>
					Generate a new code
				</button>
				<button v-else class="text-gray5 focus:outline-none text-sm" style="cursor: not-allowed">
					Generate a new code
				</button>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'
import { mapMutations } from 'vuex'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile } from '@/backend/profile'
import { getNearPrivateKey } from '@/backend/near'
import CopyIcon from '@/components/icons/Copy.vue'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import PencilIcon from '@/components/icons/Pencil.vue'
import { generateInviteCode, getInvitesRemaining } from '@/backend/invite'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	generatedInviteCode: string
	inviteCodesRemaining: number
}

export default Vue.extend({
	components: {
		CopyIcon,
		ChevronLeft,
		PencilIcon,
	},
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			generatedInviteCode: ``,
			inviteCodesRemaining: 1,
		}
	},
	head() {
		return {
			title: `Account Settings - Capsule Social`,
			meta: [{ hid: `settings-account`, name: `settings-account`, content: `Account settings on Capsule Social` }],
		}
	},
	created() {
		this.getInviteCodesRemaining()
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeName: MutationType.CHANGE_NAME,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		async downloadPrivateKey(): Promise<void> {
			const accountId = window.localStorage.getItem(`accountId`)
			if (!accountId) {
				this.$toastError(`Account not found, are you signed in?`)
				return
			}
			const privateKey = await getNearPrivateKey(accountId)
			const blob = new Blob([JSON.stringify({ accountId, privateKey })], { type: `application/json` })
			const link = document.createElement(`a`)
			link.href = URL.createObjectURL(blob)
			link.download = `capsule-priv-key-${this.$store.state.session.id}`
			link.click()
			URL.revokeObjectURL(link.href)
			this.$toastSuccess(`Downloaded Capsule private key`)
		},
		async updateProfile() {
			const backendProfile = getProfileFromSession(this.$store.state.session)
			const cid = await setProfile(backendProfile)
			this.changeCID(cid)
			return true
		},
		async updateSettings() {
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				this.$toastSuccess(`Your settings has been successfully updated`)
			}
		},
		async generateNewInviteCode() {
			// generate a new invite code
			try {
				const { inviteCode, invitesRemaining } = await generateInviteCode(this.$store.state.session.id)
				this.generatedInviteCode = inviteCode
				this.inviteCodesRemaining = invitesRemaining
			} catch (error: any) {
				if (axios.isAxiosError(error) && error.response) {
					if (error.response.status === 429) {
						this.$toastWarning(`Too many requests`)
						return
					}
					this.$toastError(error.response.data.error)
					return
				}
				throw error
			}
		},
		copyURL(): void {
			const code = this.$refs.code as HTMLElement
			code.focus()
			document.execCommand(`copy`)
			this.$toastSuccess(`Code copied to clipboard!`)
		},
		async getInviteCodesRemaining() {
			const response = await getInvitesRemaining(this.$store.state.session.id)
			this.inviteCodesRemaining = response
		},
		redirectProfile() {
			this.$store.commit(`settings/setRecentlyInSettings`, true)
			this.$router.push(`/id/` + this.$store.state.session.id)
		},
	},
})
</script>
