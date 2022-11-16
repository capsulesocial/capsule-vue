<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
	>
		<!-- Container -->
		<section class="popup">
			<div
				v-if="author !== null"
				class="w-full lg:w-600 min-h-40 max-h-90 bg-lightBG dark:bg-darkBGStop card-animation z-10 overflow-y-auto rounded-lg px-6 pt-4 pb-6 shadow-lg"
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
				<!-- Step 0: Enter amount -->
				<article v-show="step === 0" class="modal-animation">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<input v-model.number="payAmount" type="number" min="1" max="10000" placeholder="Enter amount" />
					</div>

					<div class="flex flex-row-reverse">
						<button
							:class="payAmount !== null ? `` : `opacity-50 cursor-not-allowed`"
							class="bg-darkBG text-lightButtonText focus:outline-none transform rounded-lg font-bold transition duration-500 ease-in-out hover:bg-opacity-75"
							style="padding: 0.4rem 1.5rem"
							@click="showPaymentButtons()"
						>
							<span class="font-sans" style="font-size: 0.95rem"> Next </span>
						</button>
					</div>
				</article>
				<!-- Step 1: Payment method selection -->
				<article v-show="step === 1" class="modal-animation">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your order</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-2">
							Donation to
							<span class="font-semibold text-primary dark:text-secondary">{{ author.id }}</span>
						</p>
						<div v-if="payAmount !== null" class="font-semibold text-lg mb-4 dark:text-darkPrimaryText">
							{{ displayCurrency(paymentProfile.currency) }}{{ payAmount.toLocaleString() }}
						</div>
					</div>
					<!-- Payment Methods -->
					<div v-show="!isLoading" class="flex flex-col items-center px-10">
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
						<small v-show="cardErrorMessage !== null" style="color: #eb1c26" class="mb-5 modal-animation">{{
							cardErrorMessage
						}}</small>
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
							class="w-full mt-2 mb-5 p-4 bg-gray1 dark:bg-gray7 border border-lightBorder dark:border-darkBorder items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`card`)"
						>
							<CreditCardIcon class="text-gray5 dark:text-gray2 w-6 h-6" />
							<h6 class="text-gray5 dark:text-gray2 ml-2">Credit card</h6>
						</button>
						<p class="text-sm text-gray5 dark:text-gray3 mt-4 mb-1 italic">Cryptocurrency options coming soon</p>
					</div>
				</article>
				<!-- Step 2: Payment card info -->
				<article v-show="step === 2" class="modal-animation">
					<!-- Back button -->
					<div class="flex justify-between w-full mb-8 mt-8">
						<button class="flex items-center" @click="previousStep">
							<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
								<ChevronLeft />
							</div>
							<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
								>Payments methods</span
							>
						</button>
						<div class="flex items-center">
							<CreditCardIcon class="text-gray5 dark:text-gray2 w-6 h-6" />
							<h6 class="text-gray5 dark:text-gray2 ml-2">Credit card</h6>
						</div>
					</div>
					<!-- Payment infos -->
					<div>
						<div
							id="card-element"
							class="mb-2 rounded-lg p-4 border border-lightBorder bg-gray1 dark:bg-gray7 placeholder-gray5 dark:placeholder-gray3 py-5"
						/>
						<small v-show="cardErrorMessage !== null" style="color: #eb1c26" class="mb-5 modal-animation">{{
							cardErrorMessage
						}}</small>
						<div class="flex flex-row-reverse items-center mt-4">
							<SecondaryButton v-if="!isLoading" :text="`Pay`" :action="submitCardPayment" />
							<div class="w-full">
								<button class="text-primary self-center text-sm" @click="step = 5">Payment policy</button>
							</div>
						</div>
					</div>
				</article>
				<!-- Step 3: Pay (Stripe) -->
				<article v-if="step === 3" class="modal-animation">
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
				<article v-show="step === 4" class="flex flex-col items-center modal-animation">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Congrats!</h6>
						<p class="text-base text-center text-gray5 dark:text-gray3 mb-4">You successfully made a donation to:</p>
					</div>
					<!-- Premium profile preview -->
					<div class="flex flex-row items-center p-4 border border-neutral rounded-lg w-2/3">
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
					</div>
					<nuxt-img
						loading="lazy"
						:src="$colorMode.dark ? `/images/dark/subscriptions.webp` : `/images/light/subscriptions.webp`"
						class="h-auto rounded-lg"
					/>
				</article>
				<!-- Step 5: Payment policy page -->
				<article v-show="step === 5" class="modal-animation">
					<!-- back button -->
					<button class="flex items-center mb-4" @click="step = 2">
						<div class="bg-gray1 dark:bg-gray5 focus:outline-none rounded-full">
							<ChevronLeft />
						</div>
						<span class="pl-2 text-sm font-semibold dark:text-darkPrimaryText" style="margin-bottom: 2px"
							>Payments</span
						>
					</button>
					<!-- Page title -->
					<h1 class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl xl:text-3xl font-semibold">
						Renewal, Refund &amp; Cancellation Policy
					</h1>
					<h2 class="text-primary mb-2 mt-4 text-lg font-semibold">
						Blogchain provides a platform for authors to be paid directly by readers. Blogchain will not refund on
						behalf of authors. Authors can issue refunds to readers at their discretion.
					</h2>
					<article class="message w-full">
						<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-xl font-semibold py-2">
							How do I request a refund on my donation?
						</h2>
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm text-justify">
							Refunds are issued at the discretion of the Author. Please contact them directly.
						</p>
					</article>
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
import ChevronLeft from '@/components/icons/ChevronLeft.vue'
import CreditCardIcon from '@/components/icons/CreditCard.vue'
import AppleIcon from '@/components/icons/brands/Apple.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'

import { Profile } from '@/backend/profile'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { stripePublishableKey } from '@/backend/utilities/config'
import {
	createDefaultPaymentProfile,
	namespace as paymentProfileNamespace,
	PaymentProfile,
} from '@/store/paymentProfile'
import {
	confirmDonationPayment,
	getCurrencySymbol,
	getZeroDecimalAmount,
	startStripeDonationPayment,
} from '@/backend/payment'
import { HTMLInputEvent } from '@/interfaces/HTMLInputEvent'

interface IData {
	step: number
	isSelected: boolean
	paymentType: string
	paymentProfile: PaymentProfile
	displayCardElement: boolean
	cardErrorMessage: string | null
	payAmount: number | null
	selectedPeriod: string
	displayButtons: {
		applePay: boolean
		googlePay: boolean
	}
	isLoading: boolean
	userIsFollowed: boolean
	following: Set<string>
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
		CreditCardIcon,
		AppleIcon,
		GoogleIcon,
		ChevronLeft,
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
			payAmount: null,
			selectedPeriod: `month`,
			paymentProfile: createDefaultPaymentProfile(this.author.id),
			displayCardElement: false,
			cardErrorMessage: null,
			displayButtons: {
				applePay: false,
				googlePay: false,
			},
			isLoading: false,
			userIsFollowed: false,
			following: new Set(),
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
		// Get my followers
		getFollowersAndFollowing(this.$store.state.session.id).then((data) => {
			this.following = data.following
			this.userIsFollowed = data.following.has(this.author.id)
		})
		this.$store.dispatch(`paymentProfile/fetchProfile`, { username: this.author.id })
	},
	methods: {
		startReading() {
			this.$emit(`close`)
			if (this.$route.name === `post-post`) {
				location.reload()
			}
		},
		displayCurrency(currency: string) {
			return getCurrencySymbol(currency)
		},
		async stripeClient(connectId?: string): Promise<Stripe> {
			// Either connectId should be passed or Stripe should already be initialized
			if (!connectId && !_stripe) {
				throw new Error(`Stripe not initialized`)
			}
			// Always create a new instance if connectId is passed.
			if (connectId) {
				_stripe = await loadStripe(stripePublishableKey, {
					stripeAccount: connectId,
					apiVersion: `2022-08-01`,
				})
			}
			// If stripe is still not initialized at this point, throw an error.
			if (!_stripe) {
				throw new Error(`Network error: Could not initiate stripe`)
			}
			return _stripe
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
				this.$toastError(`Author payment profile is missing`)
				return
			}

			if (!this.paymentProfile.paymentsEnabled) {
				this.$toastError(`Author hasn't enabled payments`)
			}
		},
		showPaymentButtons() {
			this._showPaymentButtons()
		},
		async _showPaymentButtons() {
			this.nextStep()
			if (!this.payAmount || this.payAmount <= 0 || this.payAmount > 10000) {
				this.cardErrorMessage = `Invalid amount selected`
				return
			}

			const amount = getZeroDecimalAmount(this.paymentProfile.currency, this.payAmount)
			this.isLoading = true
			const stripe = await this.stripeClient(this.paymentProfile.stripeAccountId)
			const currency = this.paymentProfile.currency
			paymentRequest = stripe.paymentRequest({
				country: `US`,
				currency,
				total: {
					label: `Donation to ${this.paymentProfile.username}`,
					amount,
				},
				requestPayerName: true,
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
						ev.complete(`success`)
						return
					}
					await this.submitPayment(ev.paymentMethod)
					this.isLoading = false
					ev.complete(`success`)
				})
				return
			}

			if (!cardElement) {
				this.cardErrorMessage = `Couldn't load Stripe Card`
				return
			}
			cardElement.mount(`#card-element`)
			// this.displayCardElement = true
			this.nextStep()
		},
		nextStep(): void {
			this.step += 1
		},
		previousStep(): void {
			this.step -= 1
		},
		async submitPayment(paymentMethod: PaymentMethod): Promise<boolean> {
			if (!this.payAmount) {
				this.$toastError(`Invalid amount`)
				return false
			}
			const username = this.$store.state.session.id
			this.isLoading = true
			try {
				this.cardErrorMessage = null
				const { error, status, clientSecret, paymentAttemptId } = await startStripeDonationPayment(
					username,
					this.paymentProfile.username,
					this.payAmount,
					paymentMethod.id,
				)

				if (error) {
					this.cardErrorMessage = error.message
					this.isLoading = false
					return false
				}
				if (status === `requires_confirmation`) {
					this.isLoading = true
					const res = this.handleAuthenticatedPayment(paymentAttemptId, clientSecret)
					this.isLoading = false
					return res
				} else if (status !== `succeeded`) {
					this.cardErrorMessage = `Payment is in invalid state`
					this.isLoading = false
					return false
				}

				this.step = 4
				return true
			} catch (err) {
				this.cardErrorMessage = (err as Error).message ?? `Unknown error`
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
				const { error, status } = await confirmDonationPayment(
					this.$store.state.session.id,
					paymentAttemptId,
					paymentIntentId,
				)
				if (error) {
					this.cardErrorMessage = error.message ?? `Donation failed`
					return false
				}

				if (status !== `succeeded`) {
					this.cardErrorMessage = `This donation payment failed with an unknown error`
					return false
				}
				this.step = 4
				return true
			} catch (err) {
				this.cardErrorMessage = (err as Error).message ?? `Unknown error`
				return false
			}
		},
		async submitCardPayment(e: HTMLInputEvent): Promise<void> {
			this.isLoading = true
			e.preventDefault()
			const stripe = await this.stripeClient()
			if (!cardElement) {
				this.isLoading = false
				throw new Error(`Card elements is not initialized`)
			}

			const { error, paymentMethod } = await stripe.createPaymentMethod({
				type: `card`,
				card: cardElement,
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

			await this.submitPayment(paymentMethod)
			this.isLoading = false
		},
		async toggleFriend() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			try {
				await followChange(this.userIsFollowed ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, this.author.id)
				this.$toastSuccess(this.userIsFollowed ? `Unfollowed ${this.author.id}` : `Followed ${this.author.id}`)
				const { following } = await getFollowersAndFollowing(this.$store.state.session.id, true)
				this.userIsFollowed = following.has(this.author.id)
			} catch (err: unknown) {
				this.$handleError(err)
			}
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
