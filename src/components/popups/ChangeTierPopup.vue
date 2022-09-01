<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="author !== null"
				class="w-full lg:w-600 bg-lightBG dark:bg-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
			>
				<div class="sticky flex items-center justify-between mb-6">
					<!-- avatar, name, id -->
					<div v-if="step !== 3" class="flex flex-row">
						<Avatar
							class="flex-shrink-0"
							:authorID="author.id"
							:avatar="authorAvatar"
							:noClick="true"
							:size="`w-14 h-14`"
						/>
						<div class="flex flex-col ml-4">
							<h4 v-if="author.name !== ``" class="text-xl font-semibold dark:text-darkPrimaryText">
								{{ author.name }}
							</h4>
							<h4 v-else class="text-xl font-semibold text-gray5 dark:text-gray3">
								{{ author.id }}
							</h4>
							<h5 class="text-lg text-primary dark:text-secondary">@{{ author.id }}</h5>
						</div>
					</div>
					<div v-else></div>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<!-- Step 0: Change tier -->
				<article v-show="step === 0">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Change Tier</h6>
						<p v-if="canSwitchTier" class="text-base text-center text-gray5 dark:text-gray3 mb-4">
							Easily change your Tier access to
							<span v-if="author.name !== ``" class="font-semibold text-primary dark:text-secondary">{{
								author.name
							}}</span>
							<span v-else class="font-semibold text-primary dark:text-secondary">@{{ author.id }}</span>
							to access new content
						</p>
					</div>
					<div v-if="!canSwitchTier">
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-10 mt-2">
							You already switched Tiers for this author within the last 30 days. <br />
							You must wait for your next payment to process before changing the subscription tier again.
						</p>
						<div class="flex flex-row-reverse">
							<button
								class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
								style="padding: 0.4rem 1.5rem"
								@click="$emit(`close`)"
							>
								<span class="font-sans" style="font-size: 0.95rem"> Close </span>
							</button>
						</div>
					</div>
					<div v-else>
						<!-- Period switch -->
						<div class="w-full flex justify-center mt-1">
							<SwitchPeriod :period="this.selectedPeriod" @toggle="switchPeriod" />
						</div>
						<!-- Subscriptions list -->
						<div v-for="tier in paymentProfile.tiers" :key="tier._id">
							<button
								v-if="
									(tier.monthlyEnabled && selectedPeriod === `month`) ||
									(tier.yearlyEnabled && selectedPeriod === `year`)
								"
								class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out"
								:class="getStyles(tier)"
								:disabled="s.tier.id === tier._id || (enabledTiers.length > 0 && !enabledTiers.includes(tier._id))"
								@click="selectTier(tier)"
							>
								<!-- Check mark -->
								<div class="w-12 flex justify-center">
									<CheckCircleIcon
										v-if="s.tier.id !== tier._id"
										:isChecked="selectedTier !== null && selectedTier._id === tier._id"
										class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
									/>
									<CheckCircleIcon
										v-else
										:isChecked="true"
										class="text-gray5 w-6 h-6 flex items-center transition duration-500 ease-in-out"
									/>
								</div>
								<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
									<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ tier.name }}</h3>
									<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
										Get access to exclusive articles by subscribing to {{ tier.name }}
									</p>
								</div>
								<div v-if="s.tier.id !== tier._id">
									<div
										v-if="tier.monthlyEnabled && selectedPeriod === `month`"
										class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
									>
										{{ displayCurrency(paymentProfile.currency) }}{{ tier.monthlyPrice }}
										<span class="text-gray5 dark:text-gray3">/month</span>
									</div>
									<div
										v-if="tier.yearlyEnabled && selectedPeriod === `year`"
										class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
									>
										{{ displayCurrency(paymentProfile.currency) }}{{ tier.yearlyPrice }}
										<span class="text-gray5 dark:text-gray3">/year</span>
									</div>
								</div>
								<div v-else class="font-semibold text-lg mr-2 text-gray5">Current tier</div>
							</button>
						</div>
						<div class="flex flex-row-reverse">
							<button
								:class="selectedTier !== null ? `` : `opacity-50 cursor-not-allowed`"
								class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
								style="padding: 0.4rem 1.5rem"
								:disabled="this.selectedTier === null"
								@click="nextStep"
							>
								<span class="font-sans" style="font-size: 0.95rem"> Next </span>
							</button>
						</div>
					</div>
				</article>
				<!-- Step 1: Confirmation page -->
				<article v-show="step === 1" class="flex flex-col items-center">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Are you sure?</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3">
							You are about to change the Tier of subscription to
							<span v-if="author.name !== ``" class="font-semibold text-primary dark:text-secondary">{{
								author.name
							}}</span>
							<span v-else class="font-semibold text-primary dark:text-secondary">@{{ author.id }}</span>
						</p>
					</div>
					<!-- Tier change preview -->
					<div
						class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out opacity-100 border-gray5"
					>
						<!-- Check mark -->
						<div class="w-12 flex justify-center">
							<CheckCircleIcon
								:isChecked="true"
								class="text-gray5 w-6 h-6 flex items-center transition duration-500 ease-in-out"
							/>
						</div>
						<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
							<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ s.tier.name }}</h3>
							<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
								Get access to exclusive articles by subscribing to {{ s.tier.name }}
							</p>
						</div>
						<div class="font-semibold text-lg mr-2 text-gray5">Current tier</div>
					</div>
					<ChevronDownIcon class="w-5 h-5 text-gray5 dark:text-gray3" />
					<div
						class="flex flex-row items-center justify-between m-5 p-4 border shadow-sm rounded-lg bg-lightBG dark:bg-darkBG transition duration-500 ease-in-out opacity-100 border-neutral"
					>
						<!-- Check mark -->
						<div class="w-12 flex justify-center">
							<CheckCircleIcon
								:isChecked="true"
								class="text-neutral w-6 h-6 flex items-center transition duration-500 ease-in-out"
							/>
						</div>
						<div v-if="selectedTier" class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
							<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ selectedTier.name }}</h3>
							<p class="text-gray5 dark:text-gray3 text-left text-sm pr-2">
								Get access to exclusive articles by subscribing to {{ selectedTier.name }}
							</p>
						</div>
						<div
							v-if="selectedTier && selectedPeriod === `month`"
							class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
						>
							{{ displayCurrency(paymentProfile.currency) }}{{ selectedTier.monthlyPrice }}
							<span class="text-gray5 dark:text-gray3">/month</span>
						</div>
						<div
							v-if="selectedTier && selectedPeriod === `year`"
							class="font-semibold text-lg mr-2 dark:text-darkPrimaryText"
						>
							{{ displayCurrency(paymentProfile.currency) }}{{ selectedTier.yearlyPrice }}
							<span class="text-gray5 dark:text-gray3">/year</span>
						</div>
					</div>
					<p class="text-sm text-center text-negative px-8 mb-5 py-1">
						This change will be reflected on your next charge, using the same billing method previously setup on this
						subscription. Please note you can only change tiers once every 30 days. You can always manage your
						subscriptions on the
						<nuxt-link to="/subscriptions" class="underline">subscriptions page</nuxt-link>.
					</p>
					<div class="flex flex-row-reverse w-full">
						<button
							:class="selectedTier !== null ? `` : `opacity-50 cursor-not-allowed`"
							class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
							style="padding: 0.4rem 1.5rem"
							:disabled="this.selectedTier === null"
							@click="switchTier"
						>
							<SpinnerIcon v-if="isLoading" class="mx-2 p-1" />
							<span v-else class="font-sans" style="font-size: 0.95rem"> Confirm change </span>
						</button>
					</div>
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { mapGetters } from 'vuex'

import Avatar from '@/components/Avatar.vue'
import CloseIcon from '@/components/icons/X.vue'
import CrownIcon from '@/components/icons/Crown.vue'
import CheckCircleIcon from '@/components/icons/CheckCircle.vue'
import ChevronDownIcon from '@/components/icons/ChevronDown.vue'
import SpinnerIcon from '@/components/icons/SpinnerIcon.vue'
import SwitchPeriod from '@/components/ToggleSwitch.vue'

import { Profile } from '@/backend/profile'
import {
	createDefaultPaymentProfile,
	namespace as paymentProfileNamespace,
	PaymentProfile,
	SubscriptionTier,
} from '@/store/paymentProfile'
import { canSwitchSubscription, getCurrencySymbol, switchSubscriptionTier } from '@/backend/payment'
import { ISubscriptionWithProfile } from '@/store/subscriptions'

interface IData {
	step: number
	paymentProfile: PaymentProfile
	selectedTier: SubscriptionTier | null
	selectedPeriod: string
	isLoading: boolean
	canSwitchTier: boolean
}

export default Vue.extend({
	components: {
		Avatar,
		CloseIcon,
		CrownIcon,
		CheckCircleIcon,
		SwitchPeriod,
		ChevronDownIcon,
		SpinnerIcon,
	},
	props: {
		author: {
			type: Object as PropType<Profile>,
			required: true,
		},
		s: {
			type: Object as PropType<ISubscriptionWithProfile>,
			required: true,
		},
		authorAvatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
		toPreSelectTier: {
			type: Object as PropType<SubscriptionTier>,
			default: null,
		},
		enabledTiers: {
			type: Array as PropType<string[]>,
			default: () => {
				return []
			},
		},
	},
	data(): IData {
		return {
			step: 0,
			selectedTier: null,
			selectedPeriod: `month`,
			paymentProfile: createDefaultPaymentProfile(this.author.id),
			isLoading: false,
			canSwitchTier: false,
		}
	},
	computed: {
		...mapGetters(paymentProfileNamespace, [`getPaymentProfile`]),
	},
	created() {
		this.initializeProfile()
	},
	async mounted() {
		window.addEventListener(`click`, this.handleCloseClick, false)
		// Get my followers
		this.$store.dispatch(`paymentProfile/fetchProfile`, { username: this.author.id })
		// prefill selected tier
		if (this.toPreSelectTier) {
			this.selectedTier = this.toPreSelectTier
		}

		try {
			const canSwitchResponse = await canSwitchSubscription(this.$route.params.id, this.s.subscriptionId)
			this.canSwitchTier = canSwitchResponse
		} catch (err) {
			this.$handleError(err)
		}
	},
	methods: {
		displayCurrency(currency: string) {
			return getCurrencySymbol(currency)
		},
		initializeProfile() {
			if (!this.author) {
				this.$toastError(`Author profile is missing`)
				return
			}
			this.paymentProfile = this.getPaymentProfile(this.author.id)
			if (!this.paymentProfile) {
				this.$toastError(`Payment profile of author is missing`)
				return
			}

			if (!this.paymentProfile.stripeAccountId) {
				this.$toastError(`Author subscription profile is missing`)
				return
			}

			if (!this.paymentProfile.paymentsEnabled) {
				this.$toastError(`Author hasn't enabled subscriptions`)
				return
			}

			if (!this.paymentProfile.tiers) {
				this.$toastError(`Author hasn't set-up subscriptions`)
			}
		},
		selectTier(tier: SubscriptionTier) {
			this.selectedTier = tier
		},
		switchPeriod() {
			if (this.selectedPeriod === `month`) {
				this.selectedPeriod = `year`
			} else {
				this.selectedPeriod = `month`
			}
		},
		nextStep(): void {
			this.step += 1
		},
		async switchTier(): Promise<void> {
			if (this.selectedTier === null) {
				return
			}
			try {
				const selectedTier = this.selectedTier
				const selectedPeriod = this.selectedPeriod

				this.isLoading = true

				const response = await switchSubscriptionTier(
					this.$store.state.session.id,
					this.s.subscriptionId,
					selectedTier,
					selectedPeriod,
				)
				if (response.status !== `succeeded`) {
					this.$toastError(`Switching tier failed`)
					return
				} else {
					this.$toastSuccess(`Switched tiers successfully!`)
					this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
					this.$emit(`close`)
				}
			} catch (err) {
				this.$handleError(err)
			}
			this.isLoading = false
		},
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.firstChild?.classList === undefined) {
				return
			}
			if (e.target.firstChild.classList[0] === `popup`) {
				this.closeDraftsPopup()
			}
		},
		closeDraftsPopup(): void {
			this.$emit(`close`)
		},
		getStyles(DisplayedTier: SubscriptionTier): String {
			let res: string = ``
			if (this.s.tier.id === DisplayedTier._id) {
				// current tier
				res = `opacity-75 cursor-not-allowed border-gray5`
			} else if (this.enabledTiers.length > 0 && !this.enabledTiers.includes(DisplayedTier._id)) {
				// not in enabled tiers for this post
				res = `opacity-75 cursor-not-allowed border-lightBorder dark:border-darkBorder`
			} else if (this.selectedTier?._id === DisplayedTier._id) {
				// in enabled tier and selected
				res = `opacity-100 cursor-pointer border-neutral`
			} else {
				// in enabled tier but not selected
				res = `opacity-100 cursor-pointer border-lightBorder dark:border-darkBorder`
			}
			return res
		},
	},
})
</script>
