<template>
	<div class="popup flex w-full justify-center">
		<!-- Container -->
		<section>
			<div
				style="width: 600px; backdrop-filter: blur(5px)"
				class="from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 mr-5 max-h-90 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
			>
				<div class="sticky flex items-center justify-between">
					<h2 class="text-primary dark:text-secondary text-2xl font-semibold">Sign Up Methods</h2>
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<div class="text-sm">
					<div class="flex flex-col my-4">
						<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Google</h4>
						<p class="my-2 text-gray5 dark:text-gray3">
							Signing up on Blogchain requires writing data on the blockchain through transactions on a smart contract
							with small amounts of NEAR token. You’ll need to provide your phone number to verify your human identity
							and enable Capsule Social to sponsor you with NEAR tokens. Blogchain and Capsule Social will not store or
							track any information from your phone number or Google account. To log in, use your Google account or
							import your Blogchain private key under “Import private key”.
						</p>
					</div>
					<div class="flex flex-col my-4">
						<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Discord</h4>
						<p class="my-2 text-gray5 dark:text-gray3">
							Signing up on Blogchain requires writing data on the blockchain through transactions on a smart contract
							with small amounts of NEAR token. You’ll need to provide your phone number for verifying your human
							identity and enable Capsule Social to sponsor you with NEAR tokens. Blogchain and Capsule Social will not
							store or track information on your accounts. To log in, use your Discord account or import your Blogchain
							private key under “Import private key”.
						</p>
					</div>
					<div class="flex flex-col my-4">
						<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with NEAR</h4>
						<p class="my-2 text-gray5 dark:text-gray3">
							Create an account using your NEAR wallet. In case of insufficient funds, you will be sponsored with NEAR
							tokens for running the transaction on the smart contract and registering your account on the blockchain.
							By signing up with NEAR, you need to download your Blogchain private key and use it to log in under
							“Import private key”. Your phone number verification is not needed for account sign up with NEAR if you
							have the necessary funds to complete the registration.
						</p>
					</div>
					<div class="flex flex-col my-4">
						<h4 class="text-lg font-semibold dark:text-darkPrimaryText">Sign up with Implicit Account</h4>
						<p class="my-2 text-gray5 dark:text-gray3">
							Create an account where you self manage your account keys. You’ll need to provide your phone number to
							verify your human identity and enable Capsule Social to sponsor you with NEAR tokens. These NEAR tokens
							are used for performing transactions on a smart contract and registering your account on the blockchain.
							By signing up with this method, you’ll need to download your Blogchain private key and use it to log in
							under “Import Blogchain private key”.
						</p>
					</div>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'

interface IData {
	showInfoBubble: boolean
}

export default Vue.extend({
	components: { CloseIcon },
	data(): IData {
		return {
			showInfoBubble: false,
		}
	},
	created() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	destroyed() {
		window.removeEventListener(`click`, this.handleCloseClick)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
				return
			}
			if (e.target.parentNode.classList[0] === `popup`) {
				this.$emit(`close`)
			}
		},
	},
})
</script>
<style>
.dropdownInfoOpen::before {
	content: '';
	position: absolute;
	top: -0.5rem;
	left: 0.95rem;
	transform: rotate(45deg);
	width: 1rem;
	height: 1rem;
	background-color: #fff;
	border-radius: 2px;
	z-index: 1;
}
</style>
