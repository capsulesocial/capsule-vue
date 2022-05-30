<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation mb-5 w-full rounded-lg border bg-gradient-to-r px-6 py-4 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 font-semibold">Contact Support</h6>
		<p class="text-gray5 dark:text-gray3 mb-6 text-sm">
			Do you need any help with your Blogchain experience ? If you face any technical difficulties, you can contact the
			team on Discord, or directly send us an email:
		</p>
		<div class="mb-12 flex items-center justify-center xl:px-6">
			<a href="https://discord.gg/sZWjf3E6bY" target="_blank">
				<button
					style="padding: 0.8rem 1.7rem; background-color: #7289da"
					class="focus:outline-none mx-4 flex transform items-center justify-between rounded-lg font-bold transition duration-500 ease-in-out hover:shadow-xl"
				>
					<DiscordIcon class="icon text-lightOnPrimaryText h-6 w-6 fill-current" />
					<span class="text-lightOnPrimaryText ml-2 font-sans" style="font-size: 0.95rem"> Discord </span>
				</button>
			</a>
			<a href="mailto:support@capsule.social" target="_blank">
				<button
					style="padding: 0.8rem 1.7rem"
					class="focus:outline-none mx-4 bg-lightBG border-lightBorder flex transform items-center justify-between rounded-lg font-bold shadow-lg transition duration-500 ease-in-out hover:shadow-xl"
				>
					<MailIcon class="icon h-5 w-5 fill-current" />
					<span class="text-lightPrimaryText ml-2 font-sans" style="font-size: 0.95rem"> Email </span>
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
