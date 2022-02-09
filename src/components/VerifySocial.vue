<template>
	<article>
		<!-- Unverified -->
		<div v-if="!isActive" class="flex justify-between text-gray7">
			<div class="flex flex-row items-center text-xl text-lightSecondaryText">
				<TwitterIcon v-if="platform === 'twitter'" class="text-gray7 mr-4" />
				<GitHubIcon v-if="platform === 'github'" class="text-gray7 mr-4" />
				<ExternalURLIcon v-if="platform === 'website'" class="text-gray7 mr-4" />
				<span class="text-gray7 capitalize">{{ platform }}</span>
			</div>
			<button class="focus:outline-none text-primary font-bold" @click="toggleVerify">Connect</button>
		</div>

		<div v-else class="flex h-12 w-full items-center justify-between">
			<div v-if="!isVerified">
				<label for="handle" class="text-gray7">
					<span v-if="platform !== 'website'">handle: @</span><span v-else>URL:</span>
				</label>
				<input
					id="handle"
					v-model="handle"
					type="text"
					placeholder="handle"
					class="focus:outline-none border-b bg-lightBG text-lightPrimaryText border-lightBorder"
				/>
			</div>
			<div v-else>
				<span class="text-gray7"> ({{ handle }}) {{ platform }} account has been verified </span>
			</div>
			<button
				v-if="!isVerified"
				class="focus:outline-none flex rounded-lg py-2 px-4 font-bold shadow-lg bg-lightButtonBG text-lightButtonText hover:bg-lightActive"
				@click="verifySocial()"
			>
				<span class="mr-2">Verify</span>
				<TwitterIcon v-if="platform === 'twitter'" />
				<GitHubIcon v-if="platform === 'github'" />
				<ExternalURLIcon v-if="platform === 'website'" />
			</button>
			<button
				v-else
				class="focus:outline-none flex rounded-lg border border-red-500 bg-white py-2 px-4 font-bold shadow-lg hover:bg-red-200"
				@click="removeSocial()"
			>
				<TwitterIcon v-if="platform === 'twitter'" />
				<GitHubIcon v-if="platform === 'github'" />
				<ExternalURLIcon v-if="platform === 'website'" />
				<span class="mx-2">Remove</span>
				<XIcon />
			</button>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import GitHubIcon from '@/components/icons/brands/GitHub.vue'
import ExternalURLIcon from '@/components/icons/ExternalURL.vue'
import XIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: {
		TwitterIcon,
		GitHubIcon,
		ExternalURLIcon,
		XIcon,
	},
	props: {
		platform: {
			type: String,
			default: ``,
		},
	},
	data() {
		return {
			isActive: false,
			handle: ``,
			isVerified: false,
		}
	},
	mounted() {
		const socials = this.$store.state.session.socials
		for (const s of socials) {
			if (s.platform === this.platform) {
				this.isActive = true
				this.isVerified = true
				this.handle = s.username
			}
		}
	},
	methods: {
		toggleVerify() {
			this.isActive = !this.isActive
		},
		verifySocial() {
			const urlCheck = this.$qualityURL(this.handle)
			if (this.platform === `website` && this.$isError(urlCheck)) {
				// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp
				this.$toastError(urlCheck.error)
				return
			}
			this.$store.commit(`me/addSocial`, {
				platform: this.platform,
				username: this.handle,
			})
			this.isVerified = true
		},
		removeSocial() {
			// this.$api.settings.removeSocial(
			//   this.$store.state.me.id,
			//   this.platform,
			// )
			// this.$store.commit('me/removeSocial', {
			//   platform: this.platform,
			// })
			this.isVerified = false
			this.isActive = false
		},
	},
})
</script>
