<template>
	<main class="xl:w-750 w-full">
		<section>
			<!-- Page title -->
			<article class="px-4 py-4 xl:px-6 xl:py-5">
				<h1 class="text-primary dark:text-secondary text-3xl font-semibold xl:text-4xl">Need Some Help?</h1>
			</article>
			<div class="container px-4 pb-6 xl:px-6">
				<h3 class="text-primary dark:text-secondary mb-6 mt-4 text-xl font-semibold">Frequently Asked Questions</h3>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion1">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How is Blogchain different from other social networks?
						</h4>
						<Plus
							:class="isOpen1 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen1 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen1 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Our platform is proudly a Web3 ecosystem, built upon the core principle of decentralization. We strongly
							believe this is the best way to empower writers both creatively and economically.
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							By contrast, existing Web2 systems like Facebook and Twitter essentially act as centralized middlemen who
							insinuate themselves between creators and their audience as a way to extract
							<a
								href="https://corporatefinanceinstitute.com/resources/knowledge/economics/rent-seeking/"
								target="_blank"
								class="text-secondary"
								>rent-seeking</a
							>
							profits.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion2">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How does Blogchain use blockchain technology?
						</h4>
						<Plus
							:class="isOpen2 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen2 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen2 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Blockchain is an important tool used to implement our broader idea of decentralization, which ultimately
							enhances the independence and freedom of speech for writers.
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							We use the NEAR protocol to manage the flow of user activity on the platform. User content is stored to
							OrbitDB, which is a decentralized database that ensures immutability across multiple nodes. This ensures a
							greater resistance against censorship often found on centralized platforms. Such social network platforms
							use company controlled servers that ultimately give them sole authority on who gets to post what and when.
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							In the future, we also plan to implement blockchain-based features that enable payments to creators for
							their work, as well as community-based governance of the Blogchain platform.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion3">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Do I need a crypto wallet to use the platform?
						</h4>
						<Plus
							:class="isOpen3 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen3 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen3 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Technically, yes. But if you don’t have one, we make setup really easy for newbies:
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							Simply sign in with your existing Google or Discord identity, and the software will automatically create a
							wallet for you on the NEAR network, which Blogchain uses to handle on-chain transactions. That’s it.
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							Of course, if you <b>do</b> already have a NEAR-compatible wallet, no need to set up a new one. Just use
							your your existing wallet to sign up.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion4">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I post to Blogchain for free?
						</h4>
						<Plus
							:class="isOpen4 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen4 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen4 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Yes. We want this to always be the case, so our social network can be used by a wide variety of writers in
							different fields to share their ideas.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion5">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							But then how do you make money on the platform?
						</h4>
						<Plus
							:class="isOpen5 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen5 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen5 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<p class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Blogchain is created and operated by
							<a href="http://capsule.social" target="_blank" class="text-secondary">Capsule Social</a>. We are working
							to add new payment features soon that will allow writers to get paid for the content they create, minus a
							small transaction fee.
						</p>
						<p class="message-content text-gray5 dark:text-gray3 pb-2 text-sm">
							What we will <b>not</b> do, however, is sell ads or user information to third parties. We want to
							implement a business model for ourselves and our creators that is truly a win-win proposition, contrary to
							the exploitation that has become par for the course on other social networks.
						</p>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion6">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							How does the platform use my personal data?
						</h4>
						<Plus
							:class="isOpen6 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen6 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen6 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<div class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Unlike traditional social networks, Blogchain does not algorithmically profile users, track you around the
							web, or sell ads to target your interests. If you share your email address or other information with us,
							we only use it to send you updates about Blogchain. That’s it.
						</div>
					</div>
				</article>
				<article class="message mb-4 w-full xl:w-10/12">
					<div class="message-header relative flex items-center justify-between" @click="toggleAccordion7">
						<h4 class="text-lightPrimaryText dark:text-darkPrimaryText w-10/12 text-base font-semibold">
							Can I share my Blogchain content on other platforms?
						</h4>
						<Plus
							:class="isOpen7 ? `plus0` : `plus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
						<Minus
							:class="!isOpen7 ? `minus0` : `minus1`"
							class="icon absolute right-0 h-5 w-5 fill-current dark:text-darkPrimaryText"
						/>
					</div>
					<div :class="isOpen7 ? `` : `is-closed`" class="message-body w-full xl:w-10/12">
						<div class="message-content text-gray5 dark:text-gray3 py-2 text-sm">
							Yes. Each post on our platform generates a hyperlink that is usable anywhere on the web, including for
							purposes of sharing to other social networks. We even integrate Blogchain with a few of the more popular
							third-party services, like Twitter, to make sharing as easy as clicking a button.
						</div>
					</div>
				</article>
			</div>
		</section>
	</main>
</template>

<script lang="ts">
import Vue from 'vue'

import Plus from '@/components/icons/Plus.vue'
import Minus from '@/components/icons/Minus.vue'

interface IData {
	isOpen1: boolean
	isOpen2: boolean
	isOpen3: boolean
	isOpen4: boolean
	isOpen5: boolean
	isOpen6: boolean
	isOpen7: boolean
}

export default Vue.extend({
	components: {
		Plus,
		Minus,
	},
	layout: `help`,
	data(): IData {
		return {
			isOpen1: true,
			isOpen2: false,
			isOpen3: false,
			isOpen4: false,
			isOpen5: false,
			isOpen6: false,
			isOpen7: false,
		}
	},
	head() {
		return {
			title: `Help - Capsule Social`,
			meta: [
				{
					hid: `help`,
					name: `help`,
					content: `Help - Capsule Social`,
				},
			],
		}
	},
	methods: {
		toggleAccordion1() {
			this.isOpen1 = !this.isOpen1
		},
		toggleAccordion2() {
			this.isOpen2 = !this.isOpen2
		},
		toggleAccordion3() {
			this.isOpen3 = !this.isOpen3
		},
		toggleAccordion4() {
			this.isOpen4 = !this.isOpen4
		},
		toggleAccordion5() {
			this.isOpen5 = !this.isOpen5
		},
		toggleAccordion6() {
			this.isOpen6 = !this.isOpen6
		},
		toggleAccordion7() {
			this.isOpen7 = !this.isOpen7
		},
	},
})
</script>
<style>
.message-header {
	cursor: pointer;
}

.message-header .icon {
	transition: all 0.6s;
}

.message-body {
	padding: 0;
	max-height: 20em;
	overflow: hidden;
	transition: all 0.6s;
}

.plus0 {
	opacity: 0;
}

.plus1 {
	opacity: 1;
}

.minus0 {
	opacity: 0;
}

.minus1 {
	opacity: 1;
}

.is-closed {
	max-height: 0;
}
</style>
