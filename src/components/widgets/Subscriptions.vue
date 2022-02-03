<template>
	<article
		class="from-lightBGStart to-lightBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r p-4 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<!-- Self-view -->
		<div v-if="$store.state.session.id === $route.params.id">
			<h6 class="text-primary mb-4 font-semibold">Email notifications</h6>
			<p class="text-gray5 text-sm mb-2">
				Display highlighted tags on your profile for readers to enable email notifications to receive your posts:
			</p>
			<!-- IF No tags -->
			<button v-if="false" class="flex items-center text-primary focus:outline-none" @click="toggleNotificationsPopup">
				<PlusIcon class="mr-2" />Add Tags
			</button>
			<!-- IF enabled tags -->
			<div v-else class="grid grid-cols-5">
				<div class="flex flex-row flex-wrap col-span-4">
					<TagCard :tag="`green`" :noClick="true" class="mr-2 mb-2" />
					<TagCard :tag="`eggs`" :noClick="true" class="mr-2 mb-2" />
					<TagCard :tag="`ham`" :noClick="true" class="mr-2 mb-2" />
				</div>
				<div>
					<button class="flex items-center text-primary text-sm focus:outline-none" @click="toggleNotificationsPopup">
						Manage
					</button>
				</div>
			</div>
		</div>
		<!-- Public view -->
		<div v-else>
			<h6 class="text-primary mb-2 font-semibold">Email notifications</h6>
			<p class="text-gray5 text-sm mb-2">
				{{ $route.params.id }} has enabled the option for future posts with these tags to be available for email
				delivery:
			</p>
			<div class="flex flex-row justify-between">
				<div class="flex flex-row flex-wrap">
					<TagCard :tag="`green`" class="mr-2 mb-2" />
					<TagCard :tag="`eggs`" class="mr-2 mb-2" />
					<TagCard :tag="`ham`" class="mr-2 mb-2" />
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
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import TagCard from '@/components/Tag.vue'
import PlusIcon from '@/components/icons/Plus.vue'

interface IData {}

export default Vue.extend({
	components: {
		TagCard,
		PlusIcon,
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
