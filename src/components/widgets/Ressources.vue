<template>
	<article
		class="w-full rounded-lg shadow-lg bg-gradient-to-r from-lightBGStart to-lightBGStop border border-lightBorder modal-animation mb-5 p-4"
	>
		<h6 class="font-semibold text-primary mb-4">Ressources</h6>
		<button class="flex flex-row items-center text-secondary focus:outline-none" @click="openOnboarding">
			<LinkIcon class="w-4 h-4 mr-3 text-primary" />
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
