<template>
	<main>
		<!-- Mobile back button -->
		<nuxt-link to="/settings" class="mb-6 flex items-center lg:hidden">
			<span class="bg-gray1 dark:bg-gray5 mr-4 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold dark:text-darkPrimaryText">All Settings</h6>
		</nuxt-link>
		<!-- Account Security -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Security</h3>
		<!-- ID -->
		<div class="mb-4 flex w-full flex-row items-center">
			<label for="id" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Identifier</label>
			<input
				id="id"
				type="text"
				:placeholder="$store.state.session.id"
				class="cursor-not-allowed bg-gray1 dark:bg-gray7 text-gray5 dark:text-gray3 placeholder-gray5 dark:placeholder-gray3 flex-grow rounded-lg px-2 py-1"
				disabled
			/>
		</div>
		<!-- Export Private Key -->
		<div class="mb-8 flex w-full flex-row items-center">
			<label for="export" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Blogchain Private Key</label>
			<button id="export" class="text-primary focus:outline-none" @click="downloadPrivateKey">
				Export Blogchain Private Key
			</button>
		</div>
		<!-- Account Profile -->
		<h3 class="text-lightPrimaryText dark:text-darkPrimaryText pb-4 text-base font-semibold">Account Profile</h3>
		<div class="mb-8 flex w-full flex-row items-center justify-between xl:justify-start">
			<label for="editProfile" class="w-48 font-semibold text-gray5 dark:text-gray3 text-sm">Public Profile</label>
			<button class="bg-darkBG focus:outline-none block rounded-lg xl:hidden" @click="redirectProfile">
				<PencilIcon class="m-2 h-5 w-5 text-white" />
			</button>
			<SecondaryButton :text="`Edit Profile`" :action="redirectProfile" class="hidden xl:block" />
		</div>
		<!-- Account Data -->
		<!-- <h2 class="text-primary font-semibold pt-4 mb-4 text-sm">Account Data</h2>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Your Blogchain data</h3>
			<button class="text-primary focus:outline-none">Request a download of your Blogchain data</button>
		</div>
		<div class="flex mb-4">
			<h3 class="w-56 font-semibold">Deactivate My Account</h3>
			<button class="text-negative focus:outline-none">Deactivate my Blogchain Account</button>
		</div> -->
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile } from '@/backend/profile'
import { getNearPrivateKey } from '@/backend/near'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import PencilIcon from '@/components/icons/Pencil.vue'

interface IData {
	backgroundImage: null | string | ArrayBuffer
}

export default Vue.extend({
	components: {
		ChevronLeft,
		PencilIcon,
	},
	layout: `settings`,
	data(): IData {
		return {
			backgroundImage: null,
		}
	},
	head() {
		return {
			title: `Account Settings - Blogchain`,
			meta: [{ hid: `settings-account`, name: `settings-account`, content: `Account settings on Blogchain` }],
		}
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
			try {
				const accountId = window.localStorage.getItem(`accountId`)
				if (!accountId) {
					this.$toastError(`Account not found, are you signed in?`)
					return
				}
				const privateKey = await getNearPrivateKey(accountId)
				const blob = new Blob([JSON.stringify({ accountId, privateKey })], { type: `application/json` })
				const link = document.createElement(`a`)
				link.href = URL.createObjectURL(blob)
				link.download = `blogchain-priv-key-${this.$store.state.session.id}.json`
				link.click()
				URL.revokeObjectURL(link.href)
				this.$toastSuccess(`Downloaded Blogchain private key`)
			} catch (error) {
				this.$handleError(error)
			}
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
		checkAvailablity(exp: number, used: boolean) {
			if (used) {
				return `used`
			}

			const now = Date.now()
			if (exp < now) {
				return `exp`
			}

			return `valid`
		},
		redirectProfile() {
			this.$store.commit(`settings/setRecentlyInSettings`, true)
			this.$router.push(`/id/` + this.$store.state.session.id)
		},
	},
})
</script>
