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
				<!-- Tier list -->
				<div class="flex flex-col">
					<button
						v-for="t in this.$store.getters[`paymentProfile/getPaymentProfile`](this.$store.state.session.id).tiers"
						:key="t._id"
						class="border rounded-lg w-full flex flex-row justify-between p-5 my-2"
						:class="
							$store.state.draft.drafts[$store.state.draft.activeIndex].accessTiers.includes(t._id)
								? `border-neutral`
								: ``
						"
						@click="
							$store.state.draft.drafts[$store.state.draft.activeIndex].accessTiers.includes(t._id)
								? removeTier(t._id)
								: addTier(t._id)
						"
					>
						<div class="flex">
							<CircleCheck
								:isChecked="$store.state.draft.drafts[$store.state.draft.activeIndex].accessTiers.includes(t._id)"
								class="text-neutral w-6 h-6 flex items-center"
							/>
							<h2 class="font-semibold ml-4 text-xl">{{ t.name }}</h2>
						</div>
						<p>
							{{
								$store.state.draft.drafts[$store.state.draft.activeIndex].accessTiers.includes(t._id)
									? `Can see this post`
									: `Cannot see this post`
							}}
						</p>
					</button>
				</div>
			</div>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CircleCheck from '@/components/icons/CheckCircle.vue'
export default Vue.extend({
	components: {
		CircleCheck,
	},
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