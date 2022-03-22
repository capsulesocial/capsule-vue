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
					<div class="flex flex-row">
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
					<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
						<CloseIcon />
					</button>
				</div>
				<!-- Choose a subscription plan -->
				<div class="w-full flex flex-col justify-center text-center">
					<CrownIcon class="fill-neutral stroke-neutral self-center" />
					<h6 class="font-semibold text-neutral">Choose a subscription plan</h6>
				</div>
			</div>
			<SecondaryButton />
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
import { Profile } from '@/backend/profile'

interface IData {
	isLoading: boolean
}

export default Vue.extend({
	components: { Avatar, CloseIcon, SecondaryButton, CrownIcon },
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
			isLoading: true,
		}
	},
	created() {
		// Fetch subscription options
	},
	mounted() {
		window.addEventListener(`click`, this.handleCloseClick, false)
	},
	methods: {
		handleCloseClick(e: any): void {
			if (!e.target || e.target.parentNode === null || e.target.parentNode.classList === undefined) {
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
