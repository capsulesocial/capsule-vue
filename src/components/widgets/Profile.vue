<template>
	<article
		class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<h6 class="text-primary mb-2 font-semibold">About</h6>
		<div v-if="location === `` && email === `` && website === ``">
			<p class="text-gray5 text-sm">
				<span v-if="$route.params.id === $store.state.session.id">
					You can display more informations about you by editing your profile!
				</span>
				<span v-else> {{ $route.params.id }} hasn't updated their bio yet</span>
			</p>
		</div>
		<div v-else>
			<div v-if="location !== ``" class="flex flex-row items-center">
				<PinIcon class="text-primary mr-3 h-4 w-4" /> {{ location }}
			</div>
			<div v-if="website !== `` && location !== ``" class="mb-2"></div>
			<div v-if="website !== ``" class="text-secondary flex flex-row items-center">
				<LinkIcon class="text-primary mr-3 h-4 w-4" /><button @click="redirectWebsite">{{ website }}</button>
			</div>
			<div v-if="email !== `` && (location !== `` || website !== ``)" class="mb-2"></div>
			<div v-if="email !== ``" class="flex flex-row items-center">
				<MailIcon class="text-primary mr-3 h-4 w-4" /><a :href="`mailto:` + email" target="_blank">{{ email }}</a>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PinIcon from '@/components/icons/Pin.vue'
import LinkIcon from '@/components/icons/Link.vue'
import MailIcon from '@/components/icons/Mail.vue'

export default Vue.extend({
	components: {
		PinIcon,
		LinkIcon,
		MailIcon,
	},
	props: {
		location: {
			type: String,
			default: ``,
		},
		email: {
			type: String,
			default: ``,
		},
		website: {
			type: String,
			default: ``,
		},
	},
	methods: {
		redirectWebsite(): void {
			if (this.website.substr(0, 7) !== `http://` && this.website.substr(0, 8) !== `https://`) {
				window.open(`https://` + this.website, `_blank`)
				return
			}
			window.open(this.website, `_blank`)
		},
	},
})
</script>
