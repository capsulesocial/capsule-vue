<template>
	<article
		class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop border-lightBorder mb-5 w-full rounded-lg border bg-gradient-to-r px-6 pt-4 pb-5 shadow-lg"
		style="backdrop-filter: blur(10px)"
	>
		<!-- Public view -->
		<div v-if="$store.state.session.id !== $route.params.id">
			<h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email newsletters</h6>
			<p class="text-gray5 dark:text-gray3 text-sm mb-4">
				Create email newsletters to be aware of <b>{{ profile.name ? profile.name : `@${profile.id}` }}</b
				>'s new posts directly in your inbox:
			</p>
			<NewsletterPreview
				v-for="n in newsletters"
				:key="n.email"
				:newsletter="n"
				@subscriptionDeleted="fetchNewsletters"
			/>
			<div class="flex flex-row justify-between flex-wrap gap-y-2">
				<!-- <div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div> -->
				<button
					v-if="newsletters.length > 0"
					class="rounded-lg px-3 py-2 bg-black text-white focus:outline-none text-sm font-semibold mt-2"
					@click="toggleNewsletterPopup"
				>
					Create another Newsletter
				</button>
				<button
					v-else
					class="rounded-lg px-3 py-2 bg-black text-white focus:outline-none text-sm font-semibold mt-2"
					@click="toggleNewsletterPopup"
				>
					Create Newsletter
				</button>
			</div>
		</div>
		<!-- Self-view -->
		<div v-else>
			<!-- <h6 class="text-lightPrimaryText dark:text-darkPrimaryText mb-3 font-semibold">Email newsletter</h6>
			<p class="text-gray5 dark:text-gray3 text-sm mb-4">
				Display highlighted tags on your profile for readers to enable email newsletter to receive your posts:
			</p> -->
			<!-- IF No tags -->
			<!-- <button
				v-if="false"
				class="flex items-center text-primary text-sm focus:outline-none"
				@click="toggleNewsletterPopup"
			>
				<PlusIcon class="mr-1 p-1" />Add Tags
			</button> -->
			<!-- IF enabled tags -->
			<!-- <div v-else class="flex flex-row justify-between flex-wrap gap-y-2">
				<div class="flex flex-row items-center text-lg">
					<TagCard :tag="`green`" class="mr-2" />
					<TagCard :tag="`eggs`" class="mr-2" />
					<TagCard :tag="`ham`" class="mr-2" />
				</div>
				<button class="flex items-center text-primary text-sm focus:outline-none" @click="toggleNewsletterPopup">
					Manage
				</button>
			</div> -->
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
// import TagCard from '@/components/Tag.vue'
// import PlusIcon from '@/components/icons/Plus.vue'
import { Profile } from '@/backend/profile'
import NewsletterPreview from '@/components/NewsletterPreview.vue'
import { IEmailSubscription } from '@/backend/emails'

export default Vue.extend({
	components: {
		// TagCard,
		// PlusIcon,
		NewsletterPreview,
	},
	props: {
		profile: {
			type: Object as PropType<Profile>,
			default: null,
		},
		newsletters: {
			type: Object as PropType<Array<IEmailSubscription>>,
			required: true,
		},
	},
	methods: {
		toggleNewsletterPopup() {
			this.$emit(`toggleNewsletterPopup`)
		},
		fetchNewsletters() {
			this.$emit(`fetchNewsletters`)
		},
	},
})
</script>