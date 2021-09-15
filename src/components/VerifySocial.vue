<template>
	<article>
		<!-- Unverified -->
		<div
			v-if="!isActive"
			:class="this.$store.state.settings.darkMode ? 'text-gray7' : 'text-darkPrimaryText'"
			class="flex justify-between"
		>
			<div
				class="flex flex-row items-center text-xl"
				:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
			>
				<TwitterIcon v-if="platform === 'twitter'" class="mr-4 text-gray7" />
				<GitHubIcon v-if="platform === 'github'" class="mr-4 text-gray7" />
				<ExternalURLIcon v-if="platform === 'website'" class="mr-4 text-gray7" />
				<span class="capitalize text-gray7">{{ platform }}</span>
			</div>
			<button class="focus:outline-none font-bold text-primary" @click="toggleVerify">Connect</button>
		</div>

		<div v-else class="h-12 w-full flex justify-between items-center">
			<div v-if="!isVerified">
				<label for="handle" :class="this.$store.state.settings.darkMode ? 'text-gray7' : 'text-darkSecondaryText'">
					<span v-if="platform !== 'website'">handle: @</span><span v-else>URL:</span>
				</label>
				<input
					id="handle"
					v-model="handle"
					type="text"
					placeholder="handle"
					:class="
						this.$store.state.settings.darkMode
							? 'bg-lightBG text-lightPrimaryText border-lightBorder'
							: 'bg-darkBG text-darkPrimaryText border-darkBorder'
					"
					class="border-b focus:outline-none"
				/>
			</div>
			<div v-else>
				<span class="text-gray7"> ({{ handle }}) {{ platform }} account has been verified </span>
			</div>
			<button
				v-if="!isVerified"
				:class="
					this.$store.state.settings.darkMode
						? 'bg-lightButtonBG text-lightButtonText hover:bg-lightActive'
						: 'bg-darkButtonBG text-darkButtonText hover:bg-darkActive'
				"
				class="flex font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
				@click="verifySocial()"
			>
				<span class="mr-2">Verify</span>
				<TwitterIcon v-if="platform === 'twitter'" />
				<GitHubIcon v-if="platform === 'github'" />
				<ExternalURLIcon v-if="platform === 'website'" />
			</button>
			<button
				v-else
				class="
					flex
					bg-white
					border border-red-500
					hover:bg-red-200
					font-bold
					py-2
					px-4
					rounded-lg
					shadow-lg
					focus:outline-none
				"
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
		for (const s in socials) {
			if (socials[s].platform === this.platform) {
				this.isActive = true
				this.isVerified = true
				this.handle = socials[s].username
			}
		}
	},
	methods: {
		toggleVerify() {
			this.isActive = !this.isActive
		},
		verifySocial() {
			if (this.platform === `website` && !this.$qualityURL(this.handle)) {
				alert(`Check URL!`)
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
			//   this.$props.platform,
			// )
			// this.$store.commit('me/removeSocial', {
			//   platform: this.$props.platform,
			// })
			this.isVerified = false
			this.isActive = false
		},
	},
})
</script>
