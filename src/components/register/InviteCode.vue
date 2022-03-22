<template>
	<!-- Step 0: Code redeem -->
	<article>
		<h1
			class="text-primary text-center lg:text-left dark:text-secondary mb-5 font-semibold xl:mb-10"
			style="font-size: 2.6rem"
		>
			Welcome
		</h1>
		<p class="text-gray7 dark:text-gray3 mt-5 text-center text-sm xl:mt-10 xl:text-base">
			Blogchain is a place for writers to do great work and for readers to discover it. For now, during our beta
			release, we are offering access to Blogchain on an invitation-only basis. We believe this is the best way to seed
			a vibrant community that will grow over time.
		</p>
		<div
			class="relative mt-6 h-44 overflow-hidden rounded-lg p-4 xl:h-52"
			style="background-size: cover; background-repeat: no-repeat; background-position: center"
			:style="{ backgroundImage: `url(` + require(`@/assets/images/util/ticket.png`) + `)` }"
		>
			<label for="id" class="text-gray5 block pb-1 text-sm font-semibold">You have an invite code?</label>
			<input
				id="id"
				v-model="inputCode"
				type="text"
				placeholder="Paste it here to get started"
				class="focus:outline-none focus:border-primary text-primary bg-gray2 border-primary mt-1 mb-5 w-full rounded-lg border border-dashed px-4 py-2 font-sans text-sm"
				style="height: 3rem"
			/>
			<div class="flex flex-row justify-between">
				<img
					:src="require(`@/assets/images/brand/discover.webp`)"
					class="-ml-4 -mb-8 hidden w-6/12 rounded-lg xl:block"
				/>
				<BrandedButton
					:text="`Sign Up`"
					:action="verifyCode"
					class="relative bottom-0 right-0 m-1 w-full xl:absolute xl:m-6 xl:w-2/5"
				/>
			</div>
		</div>
		<p class="text-gray7 dark:text-gray3 mt-6 text-center text-sm">
			Already have an account?
			<nuxt-link to="/login" class="text-primary dark:text-secondary text-center font-bold">Log in</nuxt-link>
		</p>
		<p class="text-gray7 dark:text-gray3 mt-10 text-center text-sm">
			Don’t have an invite yet? Request one
			<a
				href="https://forms.zohopublic.com/peter96/form/BlogchainInviteRequests/formperma/7xCuELT6HdgR08w13-Nt8WFx9SmsnZh1YFL9mcP_oCc"
				target="_blank"
				class="text-primary dark:text-secondary font-semibold"
				>here.</a
			>
			You can also join our community on Discord, or follow our company blog to receive future updates.
		</p>
		<div class="flex items-center justify-center py-6">
			<a href="https://discord.gg/sZWjf3E6bY" target="_blank" class="mr-2">
				<button
					style="padding: 0.8rem 1.5rem; background-color: #7289da"
					class="focus:outline-none flex transform items-center justify-between rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-lg"
				>
					<DiscordLogo class="icon text-lightOnPrimaryText mr-2 h-6 w-6 fill-current" />
					<span class="text-lightOnPrimaryText ml-1 font-sans text-sm xl:text-base"> Discord </span>
				</button>
			</a>
			<nuxt-link
				to="/id/capsule"
				style="padding: 0.9rem 1.7rem"
				class="focus:outline-none border-lightBorder text-lightPrimaryText bg-lightBG flex transform items-center justify-between rounded-lg font-bold shadow-lg transition duration-500 ease-in-out hover:shadow-lg ml-2"
			>
				<CapsuleLogo class="icon text-lightPrimaryText mr-3 h-5 w-5 fill-current" />
				<span class="text-lightPrimaryText hidden font-sans text-sm xl:block xl:text-base"> Latest </span>
				<span class="text-lightPrimaryText ml-1 font-sans text-sm xl:text-base"> news </span>
			</nuxt-link>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import axios from 'axios'

import CapsuleLogo from '@/components/icons/CapsuleLogo.vue'
import DiscordLogo from '@/components/icons/Discord.vue'

import { verifyCodeAndGetToken } from '@/backend/invite'
import { ValidationError } from '@/errors'

interface IData {
	inputCode: string
}

export default Vue.extend({
	components: {
		CapsuleLogo,
		DiscordLogo,
	},
	data(): IData {
		return {
			inputCode: ``,
		}
	},
	methods: {
		async verifyCode() {
			try {
				if (this.inputCode.length !== 8) {
					throw new ValidationError(`Invite codes should be of length 8`)
				}
				await verifyCodeAndGetToken(this.inputCode)
				this.$emit(`validInviteCode`)
			} catch (err) {
				if (axios.isAxiosError(err) && err.response) {
					if (err.response.status === 400 && err.response.data.error === `Invite code not found`) {
						this.$toastWarning(`Invite code not found`)
						return
					}
				}

				throw err
			}
		},
	},
})
</script>
