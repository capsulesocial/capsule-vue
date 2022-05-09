<template>
	<div
		class="bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<section class="popup">
			<div
				style="backdrop-filter: blur(10px)"
				class="min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
			>
				<h2 class="text-lightPrimaryText dark:text-darkPrimaryText text-3xl font-semibold">
					Manage access to this post
				</h2>
				<button
					v-for="t in this.$store.getters[`paymentProfile/getPaymentProfile`](this.$store.state.session.id).tiers"
					:key="t._id"
					class="border border-neutral rounded-lg"
					@click="addTier(t.name)"
				>
					{{ t.name }}
				</button>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	methods: {
		addTier(t: string) {
			this.$store.commit(`draft/addAccessTier`, t)
		},
		removeTier(t: string) {
			// TODO: Implement this button
			this.$store.commit(`draft/removeAccessTier`, t)
		},
	},
})
</script>