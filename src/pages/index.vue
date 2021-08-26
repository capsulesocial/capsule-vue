<template>
	<main
		class="h-full"
		:class="this.$store.state.settings.darkMode ? 'bg-lightBG text-lightPrimaryText' : 'bg-darkBG text-darkPrimaryText'"
	>
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

					<a href="https://discord.gg/sZWjf3E6bY" target="_blank" class="ml-5 bg-white rounded-lg">
						<DiscordIcon class="w-24" />
					</a>
				</div>
			</section>
		</nav>
		<section>
			<article class="flex justify-center">
				<BrandedButton text="Get started" :action="handleCTA" />
			</article>
		</section>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'
import TwitterIcon from '@/components/icons/brands/Twitter.vue'
import DiscordIcon from '@/components/icons/brands/Discord.vue'
import BrandedButton from '@/components/BrandedButton.vue'

export default Vue.extend({
	components: {
		CapsuleIcon,
		TwitterIcon,
		DiscordIcon,
		BrandedButton,
	},
	layout: `landing`,
	methods: {
		handleCTA() {
			if (this.$store.state.session.cid === ``) {
				this.$router.push(`/auth`)
			} else {
				this.$router.push(`/home`)
			}
		},
	},
})
</script>
