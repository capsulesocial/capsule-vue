<template>
	<main>
		<!-- Account Security -->
		<div v-show="tab === `account`">
			<h2 class="text-primary font-semibold mb-4 text-sm">Account Security</h2>
			<!-- ID -->
			<div class="flex flex-row items-center w-full mb-4">
				<label for="id" class="w-32 font-semibold">Identifier</label>
				<input
					id="id"
					type="text"
					:placeholder="$store.state.session.id"
					class="flex-grow bg-primary bg-opacity-25 text-primary placeholder-primary rounded-lg px-2 py-1"
					disabled
				/>
				<button class="w-32" disabled></button>
			</div>
			<!-- Export Private Key -->
			<div class="flex flex-row items-center w-full mb-4">
				<label for="export" class="w-32 font-semibold">Private Key</label>
				<button id="export" class="text-primary">Export Private Key</button>
			</div>
			<!-- Account Profile -->
			<h2 class="text-primary font-semibold text-sm py-4">Account Profile</h2>
			<div class="flex flex-row items-center w-full mb-4">
				<label for="editProfile" class="w-32 font-semibold">Public Profile</label>
				<nuxt-link :to="$store.state.session.id" class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2">
					Edit your Profile
				</nuxt-link>
			</div>
			<!-- Account Data -->
			<h2 class="text-primary font-semibold pt-4 mb-4">Account Data</h2>
			<div class="flex mb-4">
				<h3 class="w-48 font-semibold">Your Capsule data</h3>
				<button class="text-primary focus:outline-none">Request a download of your Capsule data</button>
			</div>
			<div class="flex mb-4">
				<h3 class="w-48 font-semibold">Deactivate My Account</h3>
				<button class="text-lightError focus:outline-none">Deactivate my Capsule Account</button>
			</div>
		</div>

		<!-- Network Tab -->
		<div v-show="tab === `network`">
			<h2 class="text-primary font-semibold mb-4">OrbitDB</h2>
			<div class="flex flex-row items-center w-full mb-4">
				<label for="node" class="w-48 font-semibold">Preferred Node URL:</label>
				<input
					id="node"
					v-model="nodeURL"
					type="text"
					:placeholder="$store.state.nodeURL"
					class="
						flex-grow
						bg-primary bg-opacity-25
						text-primary
						placeholder-primary
						rounded-lg
						px-2
						py-1
						focus:outline-none
					"
				/>
				<button class="w-48 focus:outline-none" disabled></button>
			</div>
		</div>
		<!-- Submit button -->
		<div class="w-full flex justify-center">
			<button
				v-show="tab !== `account`"
				:class="hasChanged() ? '' : 'opacity-50'"
				class="bg-primary text-white rounded-lg focus:outline-none px-4 py-2"
				@click="updateSettings"
			>
				Save Changes
			</button>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapMutations } from 'vuex'
import { MutationType, getProfileFromSession, namespace as sessionStoreNamespace } from '~/store/session'
import { setProfile } from '@/backend/profile'

interface IData {
	nodeURL: string
}

export default Vue.extend({
	components: {},
	layout: `settings`,
	props: {
		tab: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			nodeURL: this.$store.state.nodeURL,
		}
	},
	created() {
		// Check for dark mode
		// const prefersDarkMode = window.matchMedia(`(prefers-color-scheme: dark)`).matches
		// if (prefersDarkMode) {
		// 	this.$store.commit(`settings/changeDarkMode`, this.$store.state.settings.darkMode)
		// }
	},
	methods: {
		...mapMutations(sessionStoreNamespace, {
			changeCID: MutationType.CHANGE_CID,
			changeID: MutationType.CHANGE_ID,
			changeName: MutationType.CHANGE_NAME,
			changeAvatar: MutationType.CHANGE_AVATAR,
			changeBio: MutationType.CHANGE_BIO,
			changeLocation: MutationType.CHANGE_LOCATION,
		}),
		hasChanged() {
			return this.nodeURL !== ``
		},
		async updateProfile() {
			const backendProfile = getProfileFromSession(this.$store.state.session)
			const cid = await setProfile(backendProfile)
			this.changeCID(cid)
			return true
		},
		async updateSettings() {
			if (this.hasChanged() === false) {
				alert(`Nothing to update!`)
				return
			}
			if (this.nodeURL && this.nodeURL !== this.$store.state.session.nodeURL) {
				if (!/((http|https?):\/\/)?(www\.)?[a-z0-9\-.]{3,}\.[a-z]{3}$/.test(this.nodeURL)) {
					alert(`Invalid URL.`)
					return
				} else {
					this.$store.commit(`changeNodeURL`, this.nodeURL)
				}
			}
			const profileUpdated = await this.updateProfile()
			if (profileUpdated) {
				alert(`Settings updated!`)
			}
		},
	},
})
</script>
