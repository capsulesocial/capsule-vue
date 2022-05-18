<template>
	<main>
		<!-- Mobile back button -->
		<button class="mb-4 flex items-center xl:hidden focus:outline-none" @click="$router.go(-1)">
			<span class="bg-gray1 mr-2 rounded-full p-1"><ChevronLeft /></span>
			<h6 class="font-semibold">Back</h6>
		</button>
		<!-- Network Tab -->
		<h2 class="text-primary dark:text-secondary mb-1 text-lg font-semibold xl:text-xl">My subscriptions</h2>
		<p class="text-gray5 dark:text-gray3">Manage your active subscriptions to your favorite content creators here:</p>
		<!-- subscriptions grid -->
		<div class="grid grid-cols-3 gap-3">
			<!-- Subscription card -->
			<div v-for="s in subCards" :key="s.authorID">
				<SubCard :s="s" />
			</div>
		</div>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import { mapGetters } from 'vuex'
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import SubCard from '@/components/subscriptions/SubCard.vue'
import { ISubscriptionResponse, ISubCardData } from '@/backend/subscription'
import { createDefaultProfile, getProfile } from '@/backend/profile'
import { namespace as SubscriptionsNamespace } from '@/store/subscriptions'
interface IData {
	subscriptions: ISubscriptionResponse[]
	subCards: ISubCardData[]
}

export default Vue.extend({
	components: { ChevronLeft, SubCard },
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
