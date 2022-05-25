<template>
	<button class="focus:outline-none block rounded-lg" @click="toggleSubscription">
		<div v-if="userIsSubscribed">
			<!-- Desktop -->
			<div
				class="friendbtn text-grey5 hidden rounded-lg bg-white px-5 text-sm font-semibold text-neutral shadow-sm border border-lightBorder transition duration-300 ease-in-out hover:text-negative hover:border-negative xl:block"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<span class="following">Subscribed</span>

				<span class="unfollow" style="padding-right: 0.15rem; padding-left: 0.15rem">Unsubscribe</span>
			</div>
			<!-- Mobile -->
			<div
				class="friendbtn dark:bg-darkBG dark:text-gray3 text-grey5 rounded-lg p-1 shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
			>
				<CrownIcon class="m-1 h-5 w-5" />
			</div>
		</div>
		<div v-else>
			<!-- Desktop -->
			<div
				class="bg-neutral hover:bg-primary hidden rounded-lg px-5 text-sm font-semibold text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:flex flex-row items-center"
				style="padding-top: 0.4rem; padding-bottom: 0.4rem"
			>
				<p class="self-center">Subscribe</p>
				<CrownIcon class="ml-2 h-4 w-4 self-center" />
			</div>
			<!-- Mobile -->
			<div
				class="bg-neutral rounded-lg p-1 text-white shadow-sm border border-lightBorder transition duration-300 ease-in-out xl:hidden"
			>
				<CrownIcon class="m-1 h-5 w-5" />
			</div>
		</div>
	</button>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import CrownIcon from '@/components/icons/Crown.vue'

export default Vue.extend({
	components: {
		CrownIcon,
	},
	props: {
		userIsSubscribed: {
			type: Boolean,
			required: true,
		},
		toggleSubscription: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
})
</script>

<style scoped>
div.friendbtn span.following {
	display: block;
}
div.friendbtn:hover span.following {
	display: none;
}
div.friendbtn span.unfollow {
	display: none;
}
div.friendbtn:hover span.unfollow {
	display: block;
}
</style>
