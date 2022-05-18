<template>
	<main>
		<h2 class="text-primary dark:text-secondary mb-1 text-lg font-semibold xl:text-xl">My subscriptions</h2>
		<p class="text-gray5 dark:text-gray3">Manage your active subscriptions to your favorite content creators here:</p>
		<!-- subscriptions grid -->
		<div class="flex flex-wrap mt-4">
			<!-- Subscription card -->
			<SubCard v-for="s in subCards" :key="s.authorID" :s="s" />
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import SubCard from '@/components/subscriptions/SubCard.vue'
import { ISubscriptionResponse, ISubCardData } from '@/backend/subscription'
import { createDefaultProfile, getProfile } from '@/backend/profile'
import { namespace as SubscriptionsNamespace } from '@/store/subscriptions'
interface IData {
	subscriptions: ISubscriptionResponse[]
	subCards: ISubCardData[]
}

export default Vue.extend({
	components: { SubCard },
	layout: `subscriptions`,
	props: {},
	data(): IData {
		return {
			subscriptions: [],
			subCards: [],
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
	async created() {
		await this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
		try {
			this.activeSubs.forEach((s: ISubscriptionResponse) => {
				let profile = createDefaultProfile(s.authorID)
				getProfile(s.authorID).then((fetchedProfile) => {
					if (fetchedProfile.profile) {
						profile = fetchedProfile.profile
					}
					const newSubCard = {
						name: profile.name,
						id: s.authorID,
						subscriptionId: s.subscriptionId,
						tier: s.tier.name,
						monthlySubs: -1,
						renewDate: s.renewDate,
						avatar: profile.avatar,
					}
					this.subCards.push(newSubCard)
				})
			})
		} catch {
			this.$toastError(`Error fetching subscriptions`)
		}
	},
	methods: {},
})
</script>
