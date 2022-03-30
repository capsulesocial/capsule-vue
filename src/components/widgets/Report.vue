<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
	>
		<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-4 font-semibold">Send us feedback</h6>
		<a href="https://xc633ok49p2.typeform.com/to/v5Xrfcpp" target="_blank">
			<button class="text-primary dark:text-secondary text-left focus:outline-none flex flex-row items-center">
				<LinkIcon class="mr-3 h-4 w-4" />
				<p>Share your ideas for improvement here</p>
			</button>
		</a>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

import LinkIcon from '@/components/icons/Link.vue'

interface IData {
	displayOnboarding: boolean
}

export default Vue.extend({
	components: {
		LinkIcon,
	},
	data(): IData {
		return {
			displayOnboarding: false,
		}
	},
	// mounted() {
	// },
	methods: {
		openOnboarding() {
			this.displayOnboarding = !this.displayOnboarding
			this.$emit(`overlay`)
		},
	},
})
</script>
