<template>
	<article
		class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<h6 class="text-primary mb-2 font-semibold">Email notifications</h6>
		<p class="text-gray5 text-sm mb-2">
			{{ $route.params.id }} has enabled the option for future posts with these tags to be available for email delivery:
		</p>
		<div class="flex flex-row justify-between">
			<div class="flex flex-row flex-wrap">
				<TagCard :tag="`placeholder1`" class="mr-2 mb-2" />
				<TagCard :tag="`placeholder2`" class="mr-2 mb-2" />
				<TagCard :tag="`placeholder3`" class="mr-2 mb-2" />
			</div>
			<div>
				<button
					class="rounded-lg px-2 py-1 bg-black text-white focus:outline-none text-sm"
					@click="toggleNotificationsPopup"
				>
					Create Notification
				</button>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import TagCard from '@/components/Tag.vue'

interface IData {}

export default Vue.extend({
	components: {
		TagCard,
	},
	data(): IData {
		return {}
	},
	methods: {
		toggleNotificationsPopup() {
			this.$emit(`toggleNotificationsPopup`)
		},
	},
})
</script>
