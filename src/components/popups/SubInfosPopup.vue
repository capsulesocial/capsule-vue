<template>
	<div
		class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		@click.self="$emit(`close`)"
	>
		<!-- Container -->
		<div
			style="backdrop-filter: blur(10px)"
			class="w-full lg:w-600 min-h-40 max-h-90 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation z-10 overflow-y-auto rounded-lg bg-gradient-to-r p-6 pt-5 shadow-lg"
		>
			<!-- popup title -->
			<div class="sticky flex items-center justify-between mb-6">
				<div class="flex items-center">
					<h2 v-if="s.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText text-2xl font-semibold">
						{{ s.name }}
					</h2>
					<h2 v-else class="text-lightSecondaryText dark:text-darkPrimaryText text-2xl font-semibold">
						{{ s.authorID }}
					</h2>
					<!-- tier -->
					<div class="bg-neutral ml-4 bg-opacity-25 rounded-3xl border border-neutral px-3 py-1 text-neutral text-xs">
						{{ s.tier.name }}
					</div>
				</div>
				<button class="focus:outline-none bg-gray1 dark:bg-gray5 rounded-full p-1" @click="$emit(`close`)">
					<CloseIcon />
				</button>
			</div>
			<!-- sub infos -->
			<div class="flex justify-between items-center">
				<!-- avatar/name -->
				<div class="flex items-center">
					<Avatar :avatar="avatar" :authorID="s.authorID" :size="`w-12 h-12 xl:w-14 xl:h-14`" class="mr-4" />
					<div class="flex flex-col">
						<span v-if="s.name !== ``" class="text-base font-medium dark:text-darkPrimaryText">
							{{ s.name }}
						</span>
						<span v-else class="text-gray5 dark:text-gray3 text-base font-medium">{{ s.authorID }}</span>
						<p class="text-primary text-sm mb-1">@{{ s.authorID }}</p>
					</div>
				</div>
				<!-- infos -->
				<div class="flex flex-col mr-1 text-xs text-gray5 dark:text-gray3">
					<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
						Subscribed since: <span class="font-semibold">March, 2021</span>
					</p>
					<p class="text-gray5 dark:text-gray3 text-sm w-full">
						Renewal date: <span class="font-semibold">{{ $formatDate(s.renewalDate) }}</span>
					</p>
				</div>
			</div>
			<!-- actions -->
			<div class="flex items-center my-4">
				<button class="text-primary py-2 text-sm flex flex-row items-center mr-10">
					<CardIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">change billing method/period</p>
				</button>
				<button class="text-negative py-2 text-sm flex flex-row items-center">
					<CancelIcon class="h-5 w-5 mr-2" />
					<p class="focus:outline-none text-sm">Cancel my subscription</p>
				</button>
			</div>
			<!-- divider -->
			<div class="bg-gray1 dark:bg-darkBorder w-full rounded-lg" style="height: 1px"></div>
			<!-- payment history -->
			<h3 class="text-lightPrimaryText dark:text-darkPrimaryText text-base font-semibold my-4">Payment history</h3>
			<div class="flex flex-row justify-start mb-2 text-gray5 dark:text-gray3">
				<h4 class="text-sm font-semibold w-40">Date</h4>
				<h4 class="text-sm font-semibold w-40">Amount</h4>
				<h4 class="text-sm font-semibold w-32">Status</h4>
				<h4 class="text-sm font-semibold">Actions</h4>
			</div>
			<div
				v-for="t in 9"
				:key="t"
				class="text-sm flex flex-row justify-start items-center py-4 border-b border-lightBorder dark:border-darkBorder text-lightPrimaryText dark:text-darkPrimaryText"
			>
				<h4 class="w-40">15th April 2022</h4>
				<h4 class="w-40">USD 376.20</h4>
				<div class="w-32">
					<h4
						class="text-positive bg-positive bg-opacity-10 border border-positive px-3 py-1 text-sm rounded-3xl w-min"
					>
						Paid
					</h4>
				</div>
				<button class="text-gray5 dark:text-gray3 py-2 text-sm flex flex-row items-center">
					<DownloadIcon class="h-5 w-5 mr-1" />
					<p class="focus:outline-none text-sm">Receipt</p>
				</button>
			</div>
		</div>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import CancelIcon from '@/components/icons/CancelIcon.vue'
import CardIcon from '@/components/icons/CardIcon.vue'
import CloseIcon from '@/components/icons/X.vue'
import DownloadIcon from '@/components/icons/Download.vue'
import { ISubscriptionWithProfile } from '@/store/subscriptions'

interface IData {
	avatar: string | ArrayBuffer
}

export default Vue.extend({
	components: { Avatar, CancelIcon, CardIcon, CloseIcon, DownloadIcon },
	props: {
		s: {
			type: Object as PropType<ISubscriptionWithProfile>,
			required: true,
		},
	},
	data(): IData {
		return {
			avatar: ``,
		}
	},
	async created() {
		if (this.s.avatar) {
			this.avatar = await getPhotoFromIPFS(this.s.avatar)
		}
	},
	methods: {},
})
</script>