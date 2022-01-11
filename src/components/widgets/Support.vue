<template>
	<article
		class="w-full rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation mb-5 p-4"
	>
		<h6 class="font-semibold text-primary mb-6">Contact Support</h6>
		<p class="text-sm text-gray5 mb-6 px-6 text-center">
			Do you need any help with your Capsule experience ? If you face any technical difficulties, you can contact the
			team on Discord, or directly send us an email:
		</p>
		<div class="flex justify-between items-center mb-12 px-6">
			<a href="https://discord.gg/sZWjf3E6bY" target="_blank">
				<button
					style="padding: 0.8rem 1.7rem; background-color: #7289da"
					class="transition duration-500 ease-in-out transform font-bold rounded-lg hover:shadow-lg focus:outline-none flex justify-between items-center"
				>
					<DiscordIcon class="icon fill-current w-6 h-6 text-lightOnPrimaryText" />
					<span class="font-sans text-lightOnPrimaryText ml-2" style="font-size: 0.95rem"> Join Discord </span>
				</button>
			</a>
			<a href="mailto:support@capsule.social" target="_blank">
				<button
					style="padding: 0.8rem 1.7rem"
					class="transition duration-500 ease-in-out transform font-bold rounded-lg hover:shadow-lg focus:outline-none flex justify-between items-center shadow-lg border-lightBorder"
				>
					<MailIcon class="icon fill-current w-5 h-5" />
					<span class="font-sans text-lightPrimaryText ml-2" style="font-size: 0.95rem"> Send Email </span>
				</button>
			</a>
		</div>
		<section>
			<img src="~/assets/images/brand/help-page.webp" alt="" class="w-full" />
		</section>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import DiscordIcon from '@/components/icons/Discord.vue'
import MailIcon from '@/components/icons/Mail.vue'

export default Vue.extend({
	components: {
		DiscordIcon,
		MailIcon,
	},
	// data(): IData {
	// 	return {
	// 	}
	// },
	// mounted() {
	// },
	// methods: {
	// },
})
</script>
