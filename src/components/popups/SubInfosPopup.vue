<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<div
			style="backdrop-filter: blur(10px)"
			class="w-full lg:w-600 min-h-40 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-5 shadow-lg"
		>
			<BasicConfirmAlert
				v-if="showAlert"
				:text="`Are you sure you want to cancel this subscription? You can still re-subscribe to this author later`"
				@close="showAlert = false"
				@confirm="cancelSubscription"
			/>
			<!-- popup title -->
			<div class="sticky flex items-center justify-between mb-6">
				<div class="flex items-center">
					<h2 v-if="s.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						{{ s.name }}
					</h2>
					<h2 v-else class="text-lightSecondaryText dark:text-darkPrimaryText text-2xl font-semibold">
						{{ s.authorID }}
					</h2>
					<!-- tier -->
					<div class="bg-neutral ml-4 bg-opacity-25 rounded-3xl border border-neutral px-3 py-1 text-neutral text-xs">
						{{ s.tier.name }}
					</div>
				</div>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<!-- sub infos -->
			<div class="flex justify-between items-center">
				<!-- avatar/name -->
				<div class="flex items-center">
					<Avatar :avatar="avatar" :authorID="s.authorID" :size="`w-12 h-12 xl:w-14 xl:h-14`" class="mr-4" />
					<div class="flex flex-col">
						<span v-if="s.name !== ``" class="text-base font-medium dark:text-darkPrimaryText">
							{{ s.name }}
						</span>
						<span v-else class="text-gray5 dark:text-gray3 text-base font-medium">{{ s.authorID }}</span>
						<p class="text-primary text-sm mb-1">@{{ s.authorID }}</p>
					</div>
				</div>
				<!-- infos -->
				<div class="flex flex-col mr-1 text-xs text-gray5 dark:text-gray3">
					<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
						Subscribed since <span class="font-semibold">{{ $formatDate(s.createdAt, true) }}</span>
					</p>
					<p
						v-if="s.renewalInfo && s.renewalInfo.status === 'cancelled' && s.renewalInfo.dueDate"
						class="text-negative text-sm w-full"
					>
						Cancels on <span class="font-semibold">{{ $formatDate(s.renewalInfo.dueDate, true) }}</span>
					</p>
					<p v-else-if="s.expiredAt" class="text-gray5 dark:text-gray3 text-sm w-full">
						Next Renewal on <span class="font-semibold">{{ $formatDate(s.expiredAt, true) }}</span>
					</p>
				</div>
			</div>
			<!-- actions -->
			<div class="flex flex-col lg:flex-row justify-between items-center my-4">
				<button class="text-primary py-2 text-sm flex flex-row items-center" @click="manageBilling">
					<CardIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">Change billing method</p>
				</button>
				<button
					v-if="s.isActive && (!s.renewalInfo || s.renewalInfo.status !== 'cancelled')"
					class="text-neutral px-2 py-2 text-sm flex flex-row items-center"
					@click="switchTier"
				>
					<CheckCircleStaticIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">Change tier</p>
				</button>
				<button
					v-if="s.isActive && (!s.renewalInfo || s.renewalInfo.status !== 'cancelled')"
					class="text-negative py-2 text-sm flex flex-row items-center"
					@click="toggleCancelAlert"
				>
					<CancelIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">Cancel my subscription</p>
				</button>
			</div>
			<!-- divider -->
			<div class="bg-gray1 dark:bg-darkBorder w-full rounded-lg" style="height: 1px"></div>
			<!-- payment history -->
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold my-4">Payment history</h3>
			<div class="flex flex-row justify-start mb-2 text-gray5 dark:text-gray3">
				<h4 class="text-sm font-semibold w-40">Date</h4>
				<h4 class="text-sm font-semibold w-40">Amount</h4>
				<h4 class="text-sm font-semibold w-32">Status</h4>
				<h4 class="text-sm font-semibold">Actions</h4>
			</div>
			<div
				v-for="transaction in transactions"
				:key="transaction.transactionId"
				class="text-sm flex flex-row justify-start items-center py-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
			>
				<h4 class="w-40">{{ $formatDate(transaction.createdAt) }}</h4>
				<h4 class="w-40 uppercase">{{ transaction.currency }} {{ transaction.amount }}</h4>
				<div class="w-32">
					<h4
						class="text-positive bg-positive bg-opacity-10 border border-positive px-3 py-1 text-sm rounded-3xl w-min"
					>
						{{ transaction.status }}
					</h4>
				</div>
				<button
					class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center"
					@click="downloadReceipt(transaction.receiptUrl)"
				>
					<DownloadIcon class="h-5 w-5 mr-1" />
					<p class="focus:outline-none text-sm">Receipt</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { mapActions, mapGetters } from 'vuex'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
import CardIcon from '@/components/icons/CardIcon.vue'
import CloseIcon from '@/components/icons/X.vue'
import CheckCircleStaticIcon from '@/components/icons/CheckCircleStatic.vue'
import DownloadIcon from '@/components/icons/Download.vue'
import BasicConfirmAlert from '@/components/popups/BasicConfirmAlert.vue'
import { ActionType, ISubscriptionWithProfile, namespace as subscriptionNamespace } from '@/store/subscriptions'
import { getSubscriptionTransactions, SubsTransaction } from '@/backend/subscription'
import { getBillingPortalUrl, switchSubscriptionTier } from '@/backend/payment'
import {
	createDefaultPaymentProfile,
	namespace as paymentProfileNamespace,
	PaymentProfile,
} from '@/store/paymentProfile'

interface IData {
	avatar: string | ArrayBuffer
	transactions: Array<SubsTransaction>
	showAlert: boolean
	paymentProfile: PaymentProfile
}

export default Vue.extend({
	components: { Avatar, CancelIcon, CardIcon, CloseIcon, DownloadIcon, BasicConfirmAlert, CheckCircleStaticIcon },
	props: {
		s: {
			type: Object as PropType<ISubscriptionWithProfile>,
			required: true,
		},
	},
	data(): IData {
		return {
			avatar: ``,
			transactions: [],
			showAlert: false,
			paymentProfile: createDefaultPaymentProfile(this.s.authorID),
		}
	},
	computed: {
		...mapGetters(paymentProfileNamespace, [`getPaymentProfile`]),
	},
	async created() {
		if (this.s.avatar) {
			this.avatar = await getPhotoFromIPFS(this.s.avatar)
		}
	},
	mounted() {
		getSubscriptionTransactions(this.$store.state.session.id, this.s.subscriptionId)
			.then((transactions) => {
				this.transactions = transactions
			})
			.catch((err) => {
				this.$handleError(err)
			})
		this.paymentProfile = this.getPaymentProfile(this.s.authorID)
	},
	methods: {
		downloadReceipt(url: string) {
			window.open(url, `_blank`, `noopener,noreferrer`)
		},
		async manageBilling(): Promise<void> {
			try {
				const portalUrl = await getBillingPortalUrl(this.$store.state.session.id, this.s.subscriptionId)
				window.open(portalUrl, `_blank`)
			} catch (ex) {
				this.$handleError(ex)
			}
		},
		toggleCancelAlert() {
			this.showAlert = !this.showAlert
		},
		async cancelSubscription(): Promise<void> {
			try {
				await this.deleteSubscription({ username: this.$store.state.session.id, id: this.s.subscriptionId })
				this.$emit(`close`)
			} catch (ex) {
				this.$handleError(ex)
			}
		},
		async switchTier(): Promise<void> {
			try {
				// TODO the selected tier and period should come from a popup of all the tiers except current one
				const selectedTier = this.paymentProfile.tiers[1]
				const selectedPeriod = `month`

				// TODO maybe a loader here?
				const response = await switchSubscriptionTier(
					this.$store.state.session.id,
					this.s.subscriptionId,
					selectedTier,
					selectedPeriod,
				)
				if (response.status !== `succeeded`) {
					this.$toastError(`Switching tier failed`)
					return
				}

				this.$toastSuccess(`Switched tiers successfully!`)
				this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
				this.$emit(`close`)
			} catch (err) {
				this.$handleError(err)
			}
		},
		...mapActions(subscriptionNamespace, {
			deleteSubscription: ActionType.DELETE_SUB,
		}),
	},
})
</script>