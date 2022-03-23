<template>
	<div
		class="bg-primary dark:bg-secondary modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
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
							<h4 class="text-xl font-semibold">{{ author.name }}</h4>
							<h5 class="text-lg text-secondary">@{{ author.id }}</h5>
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
						<h6 class="font-semibold text-neutral text-xl mb-2">Choose a subscription plan</h6>
						<p class="text-base text-center text-gray5 mb-4">
							Choose a subscription plan and a billing method to access subscribers-only content of
							<span class="font-semibold text-primary">{{ author.name }}</span>
						</p>
					</div>
					<!-- Subscriptions -->
					<button
						class="flex flex-row items-center justify-between mx-5 mb-5 p-4 border border-neutral shadow-lg rounded-lg"
						@click="isSelected = true"
					>
						<!-- Check mark -->
						<CheckCircleIcon :isChecked="isSelected" class="text-neutral w-8 h-8 mx-2" />
						<div class="flex flex-grow flex-col ml-4 mr-2">
							<h3 class="text-xl font-semibold">Monthly subscription</h3>
							<p class="text-gray5">Base monthly subscription to access this author's premium content</p>
						</div>
						<div class="font-semibold text-lg">$2<span class="text-gray5">/month</span></div>
					</button>
					<div class="flex flex-row-reverse my-4">
						<SecondaryButton :text="`Next`" :action="nextStep" :disabled="!isSelected" />
					</div>
				</article>
				<!-- Step 1: Payment -->
				<article v-show="step === 1">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Your order</h6>
						<p class="text-base text-center text-gray5 mb-2">
							Tier 1 monthly subscription plan to
							<span class="font-semibold text-primary">{{ author.name }}</span>
						</p>
						<div class="font-semibold text-lg mb-4">$2<span class="text-gray5">/month</span></div>
					</div>
					<!-- Payment Methods -->
					<div class="flex flex-col px-10">
						<!-- Apple pay -->
						<button
							class="w-full my-2 p-4 bg-black items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`apple_pay`)"
						>
							<AppleIcon class="text-white w-6 h-6" />
							<h6 class="text-white ml-2">Pay</h6>
						</button>
						<!-- Google pay -->
						<button
							class="w-full my-2 p-4 border border-black items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`google_pay`)"
						>
							<GoogleIcon class="w-6 h-6" />
							<h6 class="text-gray5 ml-2">Pay</h6>
						</button>
						<div class="my-6 flex w-full items-center justify-center">
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
							<p class="text-gray5 dark:text-gray3 px-4 text-xs">OR</p>
							<span class="border-gray5 dark:border-gray3 flex-grow rounded-lg border" style="height: 1px"></span>
						</div>
						<!-- Credit card -->
						<button
							class="w-full mt-2 mb-5 p-4 bg-gray1 items-center rounded-lg flex justify-center"
							@click="selectPaymentType(`credit_cart`)"
						>
							<CreditCardIcon class="text-gray5 w-6 h-6" />
							<h6 class="text-gray5 ml-2">Credit card</h6>
						</button>
					</div>
				</article>
				<!-- Step 2: Pay (Stripe) -->
				<article v-if="step === 2">
					STRIPE PAYMENT STUFF
					<SecondaryButton :text="Pay" :action="nextStep" />
				</article>
				<!-- Step 4: Confirmation page -->
				<article v-show="step === 3">
					<div class="w-full flex flex-col justify-center text-center px-10">
						<CrownIcon class="text-neutral stroke-neutral self-center w-12 h-12 mb-2" />
						<h6 class="font-semibold text-neutral text-xl mb-2">Congrats!</h6>
						<p class="text-base text-center text-gray5 mb-4">You are now subscribed to:</p>
					</div>
					<!-- Premium profile preview -->
					<div class="flex flex-row p-4 border border-neutral rounded-lg mx-10">
						<Avatar
							class="flex-shrink-0"
							:authorID="author.id"
							:avatar="authorAvatar"
							:noClick="true"
							:size="`w-14 h-14`"
						/>
						<div class="flex flex-col ml-4 flex-grow">
							<h4 class="text-xl font-semibold">{{ author.name }}</h4>
							<h5 class="text-lg text-secondary">@{{ author.id }}</h5>
						</div>
						<CrownIcon class="text-neutral stroke-neutral self-center w-10 h-10" />
					</div>
					<div class="w-full flex flex-col justify-center items-center text-center px-10 my-5">
						<p class="text-base text-center text-gray5 mb-4">
							All of their premium articles are now unlocked for your account
						</p>
						<button class="px-4 py-2 rounded-lg bg-neutral focus:outline-none text-white">Start reading</button>
					</div>
					ADD IMAGE FROM HENRY HERE
				</article>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import SecondaryButton from '@/components/SecondaryButton.vue'
import CloseIcon from '@/components/icons/X.vue'
import CrownIcon from '@/components/icons/Crown.vue'
import CheckCircleIcon from '@/components/icons/CheckCircle.vue'
import CreditCardIcon from '@/components/icons/CreditCard.vue'
import AppleIcon from '@/components/icons/brands/Apple.vue'
import GoogleIcon from '@/components/icons/brands/Google.vue'
import { Profile } from '@/backend/profile'

interface IData {
	step: number
	isSelected: boolean
	paymentType: string
}

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
	},
	props: {
		isSubscribed: {
			type: Boolean as PropType<Boolean>,
			default: false,
		},
		author: {
			type: Object as PropType<Profile | null>,
			default: null,
		},
		authorAvatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
	},
	data(): IData {
		return {
			step: 0,
			isSelected: false,
			paymentType: ``,
		}
	},
	created() {
		// Fetch subscription options
	},
	mounted() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	methods: {
		selectPaymentType(paymentType: string) {
			this.paymentType = paymentType
			this.nextStep()
		},
		nextStep(): void {
			this.step += 1
		},
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.firstChild.classList === undefined) {
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
