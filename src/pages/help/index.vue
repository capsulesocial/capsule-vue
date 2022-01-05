<template>
	<main style="width: 750px; height: calc(100vh - 95px)">
		<section>
			<!-- Page title -->
			<article class="px-6 py-5">
				<h1 class="font-semibold text-primary" style="font-size: 2.6rem">Need Some Help?</h1>
			</article>
			<div class="container px-6">
				<h3 class="text-primary text-xl font-semibold mb-6 mt-4">Frequently Asked Questions</h3>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion1">
						<h4 class="text-lightPrimaryText text-base font-semibold">Are my personal data used by Capsule ?</h4>
						<Plus :class="isOpen1 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen1 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen1 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion2">
						<h4 class="text-lightPrimaryText text-base font-semibold">Do I need a crypto-wallet to use Capsule ?</h4>
						<Plus :class="isOpen2 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen2 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen2 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion3">
						<h4 class="text-lightPrimaryText text-base font-semibold">Can I post on Capsule for free ?</h4>
						<Plus :class="isOpen3 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen3 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen3 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion4">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							Can I share my Capsule content on other platforms ?
						</h4>
						<Plus :class="isOpen4 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen4 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen4 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion5">
						<h4 class="text-lightPrimaryText text-base font-semibold">How can I delete my Capsule account ?</h4>
						<Plus :class="isOpen5 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen5 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen5 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
						</div>
					</div>
				</article>
				<article class="message w-10/12 mb-4">
					<div class="message-header flex justify-between items-center relative" @click="toggleAccordion6">
						<h4 class="text-lightPrimaryText text-base font-semibold">
							How to Signal inappropriate Content on Capsule ?
						</h4>
						<Plus :class="isOpen6 ? `plus0` : `plus1`" class="icon fill-current w-5 h-5 absolute right-0" />
						<Minus :class="!isOpen6 ? `minus0` : `minus1`" class="icon fill-current w-5 h-5 absolute right-0" />
					</div>
					<div :class="isOpen6 ? `` : `is-closed`" class="message-body w-10/12">
						<div class="message-content py-2 text-gray5 text-sm">
							Capsule is a decentralized discourse platform. We don’t collect any data of any kind from you and respect
							our users values.
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
	max-height: 10em;
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