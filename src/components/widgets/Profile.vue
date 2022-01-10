<template>
	<article class="w-full rounded-lg shadow-lg bg-white mb-5 p-4">
		<h6 class="font-semibold text-primary mb-2">About</h6>
		<div v-if="location === `` && email === `` && website === ``">
			<p class="text-sm text-gray5">
				<span v-if="$route.params.id === $store.state.session.id">
					You can display more informations about you by editing your profile!
				</span>
				<span v-else> {{ $route.params.id }} didn't updated any informations about him yet</span>
			</p>
		</div>
		<div v-else>
			<div v-if="location !== ``" class="flex flex-row items-center">
				<PinIcon class="w-4 h-4 mr-3 text-primary" /> {{ location }}
			</div>
			<div v-if="website !== `` && location !== ``" class="mb-2"></div>
			<div v-if="website !== ``" class="flex flex-row items-center text-secondary">
				<LinkIcon class="w-4 h-4 mr-3 text-primary" /><a :href="website" target="_blank">{{ website }}</a>
			</div>
			<div v-if="email !== `` && (location !== `` || website !== ``)" class="mb-2"></div>
			<div v-if="email !== ``" class="flex flex-row items-center">
				<MailIcon class="w-4 h-4 mr-3 text-primary" /><a :href="`mailto:` + email" target="_blank">{{ email }}</a>
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
})
</script>
