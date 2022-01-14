<template>
	<main style="width: 750px; height: calc(100vh - 95px)">
		<section>
			<!-- Page title -->
			<article class="px-6 py-5">
				<h1 class="font-semibold text-primary" style="font-size: 2.6rem">Need Some Help?</h1>
			</article>
			<div class="container px-6 pb-6">
				<h3 class="text-primary text-xl font-semibold mb-6 mt-4">Frequently Asked Questions</h3>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion1">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							How is Blogchain different from other social networks?
						</h4>
						<Plus :class="isOpen1 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen1 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen1 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Our platform is proudly a Web3 ecosystem, built upon the core principle of decentralization. We strongly
							believe this is the best way to empower writers both creatively and economically. <br /><br />
							By contrast, existing Web2 systems like Facebook and Twitter essentially act as centralized middlemen who
							insinuate themselves between creators and their audience as a way to extract
							<a
								href="https://corporatefinanceinstitute.com/resources/knowledge/economics/rent-seeking/"
								target="_blank"
								class="text-secondary"
								>rent-seeking</a
							>
							profits.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion2">
						<h4 class="text-lightPrimaryText text-base font-semibold">How does Blogchain use blockchain technology?</h4>
						<Plus :class="isOpen2 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen2 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen2 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							It’s the main way we implement our broader idea of decentralization. <br />
							At present, we use the NEAR protocol to host users’ content on-chain, which makes the information more
							resistant to censorship and thus enhances free speech. On a public chain like NEAR’s, no one company
							(including us) can take down a user’s content, since other nodes that maintain the chain will continue to
							verify new information to be posted. <br /><br />
							This is a fundamental change from existing social networks’ use of company-controlled servers that
							ultimately give those companies say in who gets to post what, and when. <br /><br />
							In the future, we also plan to add blockchain-based features to enable payments to creators for their work
							and transparent, community-based governance of the Blogchain platform.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion3">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							Do I need a crypto wallet to use the platform?
						</h4>
						<Plus :class="isOpen3 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen3 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen3 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							To post to the platform or make comments, yes, you will need a NEAR wallet. But to simply read posts, you
							do <b>not</b> need a wallet. Links to articles on Blogchain can be shared across the internet like any
							other web page. <br /><br />

							This structure is roughly comparable to that of Twitter, where you need to have a membership to post
							updates. But anyone on the internet, regardless of whether they’re a Twitter member, can read tweets that
							have been posted publicly.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion4">
						<h4 class="text-lightPrimaryText text-base font-semibold">Can I post to Blogchain for free?</h4>
						<Plus :class="isOpen4 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen4 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen4 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Yes. We want this to always be the case, so our social network can be used by a wide variety of writers in
							different fields to share their ideas.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion5">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							But then how do you make money on the platform?
						</h4>
						<Plus :class="isOpen5 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen5 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen5 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Blogchain is created and operated by
							<a href="http://capsule.social" target="_blank" class="text-secondary">Capsule Social</a>. We are working
							to add new payment features soon that will allow writers to get paid for the content they create, minus a
							small transaction fee. <br /><br />

							What we will <b>not</b> do, however, is sell ads or users’ information to third parties. We want to
							implement a business model for ourselves and our creators that is truly a win-win proposition, contrary to
							exploitation that has become par for the course on other social networks.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion6">
						<h4 class="text-lightPrimaryText text-base font-semibold">How does the platform use my personal data?</h4>
						<Plus :class="isOpen6 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen6 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen6 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Unlike traditional social networks, Blogchain does not algorithmically profile users, track you around the
							web, or sell ads to target your interests. If you share your email address or other information with us,
							we only use it to send you updates about Blogchain. That’s it.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion7">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							Can I share my Blogchain content on other platforms?
						</h4>
						<Plus :class="isOpen7 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen7 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen7 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
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