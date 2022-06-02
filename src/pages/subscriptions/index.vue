<template>
	<main>
		<h2 class="text-lightPrimaryText dark:text-darkPrimaryText mb-1 text-lg font-semibold xl:text-xl">
			My subscriptions
		</h2>
		<p class="text-gray5 dark:text-gray3">Manage your active subscriptions to your favorite content creators here:</p>
		<!-- subscriptions grid -->
		<div class="flex flex-wrap mt-4">
			<!-- Subscription card -->
			<SubCard v-for="s in activeSubs" :key="s.authorID" :s="s" @popup="$emit(`popup`, s)" />
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
