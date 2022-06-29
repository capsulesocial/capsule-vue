<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r px-6 pt-4 pb-5 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<!-- Self-view -->
		<div v-if="$store.state.session.id === $route.params.id">
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email newsletter</h6>
			<p class="text-gray5 dark:text-gray3 text-sm mb-4">
				Display highlighted tags on your profile for readers to enable email newsletter to receive your posts:
			</p>
			<!-- IF No tags -->
			<button
				v-if="false"
				class="flex items-center text-primary text-sm focus:outline-none"
				@click="toggleNewsletterPopup"
			>
				<PlusIcon class="mr-1 p-1" />Add Tags
			</button>
			<!-- IF enabled tags -->
			<div v-else class="flex flex-row justify-between flex-wrap gap-y-2">
				<div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div>
				<button class="flex items-center text-primary text-sm focus:outline-none" @click="toggleNewsletterPopup">
					Manage
				</button>
			</div>
		</div>
		<!-- Public view -->
		<div v-else>
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email newsletter</h6>
			<p v-if="profile.name !== ``" class="text-gray5 dark:text-gray3 text-sm mb-4">
				{{ profile.name }} has enabled the option for future posts with these tags to be available for email delivery:
			</p>
			<p v-else class="text-gray5 dark:text-gray3 text-sm mb-4">
				{{ $route.params.id }} has enabled the option for future posts with these tags to be available for email
				delivery:
			</p>
			<div class="flex flex-row justify-between flex-wrap gap-y-2">
				<div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div>
				<button
					class="rounded-lg px-3 py-2 bg-black text-white focus:outline-none text-sm font-semibold"
					@click="toggleNewsletterPopup"
				>
					Create Newsletter
				</button>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import TagCard from '@/components/Tag.vue'
import PlusIcon from '@/components/icons/Plus.vue'
import { Profile } from '@/backend/profile'
interface IData {}
export default Vue.extend({
	components: {
		TagCard,
		PlusIcon,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
	},
	data(): IData {
		return {}
	},
	methods: {
		toggleNewsletterPopup() {
			this.$emit(`toggleNewsletterPopup`)
		},
	},
})
</script>