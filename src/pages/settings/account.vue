<template>
	<main>
		<!-- Account Security -->
		<h2 class="text-primary font-semibold mb-4 text-sm">Account Security</h2>
		<!-- ID -->
		<div class="flex flex-row items-center w-full mb-4">
			<label for="id" class="w-32 font-semibold">Identifier</label>
			<input
				id="id"
				type="text"
				:placeholder="$store.state.session.id"
				class="flex-grow bg-gray1 text-gray5 placeholder-gray5 rounded-lg px-2 py-1"
				disabled
			/>
			<button class="w-32" disabled></button>
		</div>
		<!-- Export Private Key -->
		<div class="flex flex-row items-center w-full mb-4">
			<label for="export" class="w-32 font-semibold">Private Key</label>
			<button id="export" class="text-primary" @click="downloadPrivateKey">Export Private Key</button>
		</div>
		<!-- Account Profile -->
		<h2 class="text-primary font-semibold text-sm py-4">Account Profile</h2>
		<div class="flex flex-row items-center w-full mb-4">
			<label for="editProfile" class="w-32 font-semibold">Public Profile</label>
			<nuxt-link
				:to="`/id/` + $store.state.session.id"
				class="bg-secondary text-white rounded-lg focus:outline-none"
				style="padding: 0.4rem 1.5rem"
			>
				Edit your Profile
			</nuxt-link>
		</div>
		<!-- Account Data -->
		<h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Data</h2>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Your Capsule data</h3>
			<button class="text-primary focus:outline-none">Request a download of your Capsule data</button>
		</div>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Deactivate My Account</h3>
			<button class="text-negative focus:outline-none">Deactivate my Capsule Account</button>
		</div>
		<!-- Account Invites -->
		<h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Invites</h2>
		<div
			class="p-5 rounded-lg mt-4 overflow-hidden relative bg-gradient-to-r from-lightBGStart to-lightBGStop border-lightBorder shadow-lg"
		>
			<label for="id" class="font-semibold text-sm pb-1 block mb-2">Generate an invite code</label>
			<p class="text-gray5">
				Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
				release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to
				seed a vibrant community that will grow over time. As an already registered user, you can invite one member your
				social circle to participate to the Blogchain beta by sharing the following invite code:
			</p>
			<div class="flex items-center mt-5">
				<h3 class="font-semibold mr-4">Invite code</h3>
				<div class="relative w-2/5 mr-4 flex items-center">
					<input
						id="id"
						ref="code"
						v-model="generatedInviteCode"
						type="text"
						placeholder="Eg. a5bX2cYY"
						class="rounded-lg px-4 py-2 text-sm focus:outline-none focus:border-primary text-primary font-sans bg-gray2 border border-dashed border-primary w-full"
						style="height: 3rem"
						@focus="$event.target.select()"
					/>
					<button class="text-primary focus:outline-none text-xs absolute right-0 mr-4" @click="copyURL">
						<CopyIcon class="w-5 h-5 fill-current" />
					</button>
				</div>
				<button
					v-if="inviteCodesRemaining >= 1"
					class="text-primary focus:outline-none text-sm"
					@click="generateNewInviteCode"
				>
					Generate a new code
				</button>
			</div>
			<br />
			<p class="text-gray5">You have {{ inviteCodesRemaining }} invites remaining</p>
		</div>

		<!-- Submit button -->
		<div class="w-full flex justify-center">
			<button class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2" @click="updateSettings">
				Save Changes
			</button>
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
import { generateInviteCode, getInvitesRemaining } from '@/backend/invite'

interface IData {
	backgroundImage: null | string | ArrayBuffer
	generatedInviteCode: string
	inviteCodesRemaining: number
}

export default Vue.extend({
	components: {
		CopyIcon,
	},
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
			generatedInviteCode: ``,
			inviteCodesRemaining: 1,
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
			this.$toastSuccess(`Downloaded private key`)
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
	},
})
</script>
