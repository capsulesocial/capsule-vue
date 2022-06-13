<template>
	<main>
		<div class="px-6 pt-4">
			<h2 class="text-lightPrimaryText dark:text-darkPrimaryText mb-1 text-lg font-semibold xl:text-xl">
				My subscriptions
			</h2>
			<p class="text-gray5 dark:text-gray3">Here you can manage your active subscriptions to your favorite authors</p>
		</div>
		<!-- subscriptions grid -->
		<div v-if="activeSubs.length > 0" class="flex flex-wrap mt-4" style="padding-right: 1.45rem; padding-left: 1.45rem">
			<!-- Subscription card -->
			<SubCard v-for="s in activeSubs" :key="s.authorID" :s="s" @popup="$emit(`popup`, s)" />
		</div>
		<div v-else class="mt-5">
			<div v-if="this.$store.state.session.id !== ``" class="flex flex-col items-center">
				<p class="text-gray5 dark:text-gray3 align-end mb-1 flex items-end text-sm w-3/4 text-center">
					It seems like you don't currently have any active subscriptions. Browse Blogchain and subscribe to authors to
					view them here
				</p>
				<img
					:src="
						$colorMode.dark
							? require(`@/assets/images/brand/dark/subscriptions.webp`)
							: require(`@/assets/images/brand/light/subscriptions.webp`)
					"
					class="h-auto"
				/>
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SubCard from '@/components/subscriptions/SubCard.vue'
import { ISubscriptionResponse } from '@/backend/subscription'
import { namespace as SubscriptionsNamespace } from '@/store/subscriptions'
interface IData {
	subscriptions: ISubscriptionResponse[]
}

export default Vue.extend({
	components: { SubCard },
	layout: `subscriptions`,
	props: {},
	data(): IData {
		return {
			subscriptions: [],
		}
	},
	head() {
		return {
			title: `Active subscriptions - Blogchain`,
			meta: [{ hid: `subscriptions`, name: `subscriptions`, content: `Manage subscriptions on Blogchain` }],
		}
	},
	computed: {
		...mapGetters(SubscriptionsNamespace, [`activeSubs`, `inactiveSubs`]),
	},
	async mounted() {
		await this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
	},
	methods: {},
})
</script>
