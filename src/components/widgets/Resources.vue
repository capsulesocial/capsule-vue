<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder modal-animation mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
	>
		<h6 class="text-primary dark:text-secondary mb-4 font-semibold">Resources</h6>
		<button class="text-secondary focus:outline-none flex flex-row items-center" @click="openOnboarding">
			<LinkIcon class="text-primary dark:text-secondary mr-3 h-4 w-4" />
			<p>onboarding process</p>
		</button>
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
