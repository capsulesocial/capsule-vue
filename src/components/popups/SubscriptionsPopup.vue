<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="author !== null"
				style="backdrop-filter: blur(10px)"
				class="min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
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
				<!-- Step 0: Choose a subscription plan -->
				<article v-show="step === 0">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your subscription plan</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">
							Choose a subscription plan and a billing method to access subscribers-only content of
							<span class="font-semibold text-primary dark:text-secondary">{{ author.name }}</span>
						</p>
					</div>
					<!-- Period switch -->
					<div class="w-full flex justify-center">
						<SwitchPeriod :period="this.selectedPeriod" @toggle="switchPeriod" />
					</div>
					<!-- Subscriptions -->
					<button
						v-for="tier in paymentProfile.tiers"
						:key="tier._id"
						class="flex flex-row items-center justify-between m-5 p-4 border border-neutral shadow-lg rounded-lg"
						@click="selectTier(tier)"
					>
						<!-- Check mark -->
						<div class="w-12 flex justify-center">
							<CheckCircleIcon
								:isChecked="selectedTier !== null && selectedTier._id === tier._id"
								class="text-neutral w-6 h-6 flex items-center"
							/>
						</div>
						<div class="flex flex-grow flex-col items-start ml-4 mr-2 w-2/5">
							<h3 class="text-xl font-semibold dark:text-darkPrimaryText">{{ tier.name }}</h3>
							<p class="text-gray5 dark:text-gray3 text-left text-sm">
								Get access to exclusive articles by subscribing to {{ tier.name }}
							</p>
						</div>
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
					</button>
					<div class="flex flex-row-reverse">
						<!-- TODO: improve this UX of selecting monthly/yearly -->
						<SecondaryButton
							v-show="selectedTier !== null"
							:text="`Next`"
							:action="showPaymentButtons(selectedPeriod)"
						/>
					</div>
				</article>
				<!-- Step 1: Payment -->
				<article v-show="step === 1">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your order</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-2">
							{{ selectedTier ? selectedTier.name : `` }}
							{{ this.selectedPeriod === `month` ? 'monthly' : 'yearly' }} subscription plan to
							<span class="font-semibold text-primary dark:text-secondary">{{ author.name }}</span>
						</p>
						<div v-if="selectedTier !== null" class="font-semibold text-lg mb-4 dark:text-darkPrimaryText">
							{{ displayCurrency(paymentProfile.currency)
							}}{{ selectedPeriod === `month` ? selectedTier.monthlyPrice : selectedTier.yearlyPrice }}
							<span class="text-gray5 dark:text-gray3">/{{ selectedPeriod }}</span>
						</div>
					</div>
					<!-- Payment Methods -->
					<div v-show="!isLoading" class="flex flex-col px-10">
						<!-- Apple pay -->
						<button
							v-show="displayButtons.applePay"
							class="w-full my-2 p-4 bg-black items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`applePay`)"
						>
							<AppleIcon class="text-white w-6 h-6" />
							<h6 class="text-white ml-2">Pay</h6>
						</button>
						<!-- Google pay -->
						<button
							v-show="displayButtons.googlePay"
							class="w-full my-2 p-4 border border-black bg-white items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`googlePay`)"
						>
							<GoogleIcon class="w-6 h-6" />
							<h6 class="text-gray5 ml-2">Pay</h6>
						</button>
						<div
							v-show="displayButtons.googlePay || displayButtons.applePay"
							class="my-6 flex w-full items-center justify-center"
						>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
							<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
						</div>
						<!-- Credit card -->
						<button
							class="w-full mt-2 mb-5 p-4 bg-gray1 dark:bg-gray7 items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`card`)"
						>
							<CreditCardIcon class="text-gray5 dark:text-gray2 w-6 h-6" />
							<h6 class="text-gray5 dark:text-gray2 ml-2">Credit card</h6>
						</button>
						<div v-show="displayCardElement">
							<div class="mb-4 flex flex-col lg:flex-row">
								<input
									id="email"
									v-model="customerEmail"
									type="email"
									placeholder="Email"
									class="bg-gray1 dark:bg-gray7 dark:text-darkPrimaryText placeholder-gray5 dark:placeholder-gray3 focus:outline-none flex-grow rounded-lg px-4 py-3 text-black"
								/>
							</div>
							<div id="card-element" class="mb-2 rounded-lg p-4 border border-black" />
							<small v-show="cardErrorMessage !== null" style="color: #eb1c26" class="mb-5">{{
								cardErrorMessage
							}}</small>
							<div class="flex flex-row-reverse mt-4">
								<SecondaryButton :text="`Pay`" :action="submitCardPayment" />
							</div>
						</div>
					</div>
				</article>
				<!-- Step 2: Pay (Stripe) -->
				<article v-if="step === 2">
					<form id="payment-form">
						<div id="payment-element">
							<!--Stripe.js injects the Payment Element-->
						</div>
						<div class="mt-4 flex flex-row-reverse">
							<SecondaryButton :text="`Pay Now`" :action="submitCardPayment" />
						</div>
						<div id="payment-message" class="hidden"></div>
					</form>
				</article>
				<!-- Step 4: Confirmation page -->
				<article v-show="step === 3" class="flex flex-col items-center">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Congrats!</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">You are now subscribed to:</p>
					</div>
					<!-- Premium profile preview -->
					<div class="flex flex-row items-center p-4 border border-neutral rounded-lg max-w-md">
						<Avatar
							class="flex-shrink-0"
							:authorID="author.id"
							:avatar="authorAvatar"
							:noClick="true"
							:size="`w-14 h-14`"
						/>
						<div class="flex flex-col ml-4 flex-grow w-3/5">
							<h4 v-if="author.name !== ``" class="text-xl font-semibold dark:text-darkPrimaryText">
								{{ author.name }}
							</h4>
							<h4 v-else class="text-xl font-semibold text-gray5 dark:text-gray3">
								{{ author.id }}
							</h4>
							<h5
								class="text-lg text-primary dark:text-secondary w-full overflow-hidden"
								style="text-overflow: ellipsis"
							>
								@{{ author.id }}
							</h5>
						</div>
						<CrownIcon class="text-neutral stroke-neutral self-center w-9 h-9 ml-10" />
					</div>
					<div class="w-full flex flex-col justify-center items-center text-center px-10 mt-5">
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-4 max-w-md">
							All of their premium articles are now<br />
							unlocked for your account
						</p>
						<button
							class="px-5 py-2 rounded-lg bg-neutral focus:outline-none text-white mt-10 font-semibold"
							@click="$emit(`close`)"
						>
							Start reading
						</button>
					</div>
					<img
						:src="
							$colorMode.dark
								? require(`@/assets/images/brand/dark/subscriptions.webp`)
								: require(`@/assets/images/brand/light/subscriptions.webp`)
						"
						class="h-auto"
					/>
				</article>
				<div v-show="isLoading" class="modal-animation flex w-full justify-center z-20 mt-5">
					<div
						class="loader m-5 border-2 border-gray1 dark:border-gray7 h-8 w-8 rounded-3xl"
						:style="`border-top: 2px solid` + $color.hex"
					></div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import { Stripe, loadStripe, StripeElements, PaymentRequest, StripeCardElement, PaymentMethod } from '@stripe/stripe-js'
import { mapGetters } from 'vuex'
import Avatar from '@/components/Avatar.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import CloseIcon from '@/components/icons/X.vue'
import CrownIcon from '@/components/icons/Crown.vue'
import CheckCircleIcon from '@/components/icons/CheckCircle.vue'
import CreditCardIcon from '@/components/icons/CreditCard.vue'
import AppleIcon from '@/components/icons/brands/Apple.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import SwitchPeriod from '@/components/switch.vue'
import { Profile } from '@/backend/profile'
import { stripePublishableKey } from '@/backend/utilities/config'
import {
	createDefaultPaymentProfile,
	namespace as paymentProfileNamespace,
	PaymentProfile,
	SubscriptionTier,
} from '@/store/paymentProfile'
import {
	confirmSubscriptionPayment,
	getAmountFromTier,
	getCurrencySymbol,
	getZeroDecimalAmount,
	startSubscriptionPayment,
} from '@/backend/payment'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'

interface IData {
	step: number
	isSelected: boolean
	paymentType: string
	paymentProfile: PaymentProfile
	displayCardElement: boolean
	cardErrorMessage: string | null
	selectedTier: SubscriptionTier | null
	selectedPeriod: string
	customerEmail: string
	displayButtons: {
		applePay: boolean
		googlePay: boolean
	}
	isLoading: boolean
}

let _stripe: Stripe | null = null
let paymentRequest: PaymentRequest | null = null
let elements: StripeElements | null = null
let cardElement: StripeCardElement | null = null

export default Vue.extend({
	components: {
		Avatar,
		CloseIcon,
		SecondaryButton,
		CrownIcon,
		CheckCircleIcon,
		CreditCardIcon,
		AppleIcon,
		GoogleIcon,
		SwitchPeriod,
	},
	props: {
		isSubscribed: {
			type: Boolean as PropType<Boolean>,
			default: false,
		},
		author: {
			type: Object as PropType<Profile>,
			required: true,
		},
		authorAvatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
	},
	data(): IData {
		return {
			step: 0,
			isSelected: true,
			paymentType: ``,
			selectedTier: null,
			selectedPeriod: `month`,
			paymentProfile: createDefaultPaymentProfile(this.author.id),
			displayCardElement: false,
			cardErrorMessage: null,
			customerEmail: ``,
			displayButtons: {
				applePay: false,
				googlePay: false,
			},
			isLoading: false,
		}
	},
	computed: {
		...mapGetters(paymentProfileNamespace, [`getPaymentProfile`]),
	},
	created() {
		this.initializeProfile()
	},
	mounted() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	methods: {
		displayCurrency(currency: string) {
			return getCurrencySymbol(currency)
		},
		async stripeClient(connectId?: string): Promise<Stripe> {
			if (!_stripe) {
				if (!connectId) {
					throw new Error(`Stripe not initialized`)
				}
				_stripe = await loadStripe(stripePublishableKey, {
					stripeAccount: connectId,
					apiVersion: `2020-08-27`,
				})
			}
			if (!_stripe) {
				throw new Error(`Network error: Could not initiate stripe`)
			}
			return _stripe
		},
		initializeProfile() {
			if (!this.author) {
				this.cardErrorMessage = `Author profile is missing`
				return
			}
			this.$store.dispatch(`paymentProfile/fetchProfile`, { username: this.author.id })
			this.paymentProfile = this.getPaymentProfile(this.author.id)
			if (!this.paymentProfile) {
				this.cardErrorMessage = `Payment profile of author is missing`
				return
			}

			if (!this.paymentProfile.stripeAccountId) {
				this.cardErrorMessage = `Author subscription profile is missing`
				return
			}

			if (!this.paymentProfile.paymentsEnabled) {
				this.cardErrorMessage = `Author haven't enabled subscriptions`
				return
			}

			if (!this.paymentProfile.tiers) {
				this.cardErrorMessage = `Author haven't set-up subscriptions`
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
		showPaymentButtons(period: string) {
			return () => this._showPaymentButtons(period)
		},
		async _showPaymentButtons(period: string) {
			this.nextStep()
			this.selectedPeriod = period
			if (!this.selectedTier || !period) {
				this.cardErrorMessage = `Invalid tier selected`
				return
			}

			const selectedAmount = getAmountFromTier(period, this.selectedTier)
			const amount = getZeroDecimalAmount(this.paymentProfile.currency, selectedAmount)
			// TODO: Start a loading spinner here
			this.isLoading = true
			const stripe = await this.stripeClient(this.paymentProfile.stripeAccountId)
			const currency = this.paymentProfile.currency
			paymentRequest = stripe.paymentRequest({
				country: `US`,
				currency,
				total: {
					label: `Subscription to ${this.selectedTier.name}`,
					amount,
				},
				requestPayerName: true,
				requestPayerEmail: true,
			})
			this.isLoading = false
			elements = stripe.elements()
			paymentRequest.canMakePayment().then((result) => {
				if (!result) {
					return
				}

				this.displayButtons.applePay = result.applePay
				this.displayButtons.googlePay = result.googlePay
			})

			cardElement = elements.create(`card`, {
				iconStyle: `solid`,
				style: {
					base: {
						color: `#000000`,
						fontSize: `16px`,
						fontSmoothing: `antialiased`,
						fontWeight: 500,
						'::placeholder': {
							color: `#CFD7DF`,
						},
					},
					invalid: {
						color: `#FF4433`,
					},
				},
			})
			cardElement.on(`change`, (event) => {
				if (event.error) {
					this.cardErrorMessage = event.error.message
					return
				}

				this.cardErrorMessage = null
			})
		},
		selectPaymentType(paymentType: string) {
			if (!paymentRequest) {
				this.cardErrorMessage = `Unexpected error with payment request`
				return
			}
			if (paymentType !== `card`) {
				paymentRequest.show()
				paymentRequest.on(`paymentmethod`, async (ev) => {
					if (!ev.paymentMethod.id) {
						this.cardErrorMessage = `Invalid payment method`
						ev.complete(`fail`)
						return
					}
					if (!ev.payerEmail) {
						this.cardErrorMessage = `Please provide your email`
						ev.complete(`fail`)
						return
					}
					const paymentSuccess = await this.submitPayment(ev.paymentMethod, ev.payerEmail)
					if (!paymentSuccess) {
						ev.complete(`fail`)
						return
					}
					ev.complete(`success`)
				})
				return
			}

			if (!cardElement) {
				this.cardErrorMessage = `Couldn't load Stripe Card`
				return
			}
			cardElement.mount(`#card-element`)
			this.displayCardElement = true
		},
		nextStep(): void {
			this.step += 1
		},
		async submitPayment(paymentMethod: PaymentMethod, email: string): Promise<boolean> {
			if (!this.selectedTier) {
				throw new Error(`Tier not selected. Invalid state`)
			}

			const username = this.$store.state.session.id
			this.isLoading = true
			try {
				this.cardErrorMessage = null
				const { error, status, clientSecret, paymentAttemptId } = await startSubscriptionPayment(
					username,
					this.selectedTier,
					this.selectedPeriod,
					paymentMethod.id,
					email,
				)

				if (error) {
					this.cardErrorMessage = error.message
					this.isLoading = false
					return false
				}
				if (status === `requires_action`) {
					// TODO hide the payment form here and show a spinner according to https://stripe.com/docs/js/payment_intents/confirm_card_payment
					this.isLoading = true
					const res = this.handleAuthenticatedPayment(paymentAttemptId, clientSecret)
					this.isLoading = false
					return res
				} else if (status !== `succeeded`) {
					this.cardErrorMessage = `Payment is in invalid state`
					this.isLoading = false
					return false
				}

				this.step = 3
				return true
			} catch (err) {
				this.cardErrorMessage = (err as Error).message ?? `Unkwon error`
				return false
			}
		},
		async handleAuthenticatedPayment(paymentAttemptId: string, clientSecret: string): Promise<boolean> {
			const stripe = await this.stripeClient()
			const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret)

			if (error) {
				this.cardErrorMessage = error.message ?? `Unknown error when confirming payment`
				return false
			}

			if (!paymentIntent?.id) {
				this.cardErrorMessage = `Invalid payment intent`
				return false
			}

			return this.confirmAuthenticatedPayment(paymentAttemptId, paymentIntent.id)
		},
		async confirmAuthenticatedPayment(paymentAttemptId: string, paymentIntentId: string): Promise<boolean> {
			try {
				this.cardErrorMessage = null
				const { error, status } = await confirmSubscriptionPayment(
					this.$store.state.session.id,
					paymentAttemptId,
					paymentIntentId,
				)
				if (error) {
					this.cardErrorMessage = error.message ?? `Subscription failed`
					return false
				}

				if (status !== `succeeded`) {
					this.cardErrorMessage = `This subscription payment failed with an unknown error`
					return false
				}
				this.step = 3
				return true
			} catch (err) {
				this.cardErrorMessage = (err as Error).message ?? `Unkwon error`
				return false
			}
		},
		async submitCardPayment(e: HTMLInputEvent): Promise<void> {
			// TODO Start loader for `Pay Now` button here
			this.isLoading = true
			e.preventDefault()
			const stripe = await this.stripeClient()
			if (!cardElement) {
				this.isLoading = false
				throw new Error(`Card elements is not initialized`)
			}

			if (!this.customerEmail) {
				this.cardErrorMessage = `Invalid email address`
				this.isLoading = false
				return
			}
			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: `card`,
				card: cardElement,
				billing_details: {
					email: this.customerEmail,
				},
			})

			if (error) {
				this.cardErrorMessage = error.message ?? `An unknown error happened`
				this.isLoading = false
				return
			}

			if (!paymentMethod) {
				this.cardErrorMessage = `Invalid payment method`
				this.isLoading = false
				return
			}

			await this.submitPayment(paymentMethod, this.customerEmail)
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
	},
})
</script>
