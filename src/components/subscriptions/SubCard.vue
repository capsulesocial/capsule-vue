<template>
	<div
		class="w-full sm:w-56 mr-2 mb-4 flex flex-col border border-lightBorder dark:border-darkBorder shadow-sm rounded-lg from-lightBGStart to-lightBGStop dark:from-darkBG dark:to-darkBG bg-gradient-to-r items-center p-4"
	>
		<Avatar
			:avatar="avatar"
			:authorID="s.authorID"
			:size="`w-12 h-12 xl:w-14 xl:h-14`"
			class="mb-4 border border-lightBorder dark:border-darkBorder"
		/>
		<h5 v-if="s.name !== ``" class="font-semibold text-lg text-lightPrimaryText dark:text-darkPrimaryText">
			{{ s.name }}
		</h5>
		<h5 v-else class="font-semibold text-lg text-gray5 dark:text-gray3">{{ s.authorID }}</h5>
		<h6 class="text-primary">@{{ s.authorID }}</h6>
		<!-- Crown with tier label -->
		<div
			class="w-full border border-neutral rounded-lg flex flex-row justify-center items-center bg-neutral bg-opacity-25 p-2 my-4 max-w-full"
		>
			<CrownIcon class="text-neutral mr-2 w-5 h-5" /><span class="truncate text-neutral">{{ s.tier.name }}</span>
		</div>
		<p class="text-gray5 dark:text-gray3 text-sm w-full mb-2">
			Total number of months subscribed: <span class="font-semibold">{{ s.monthsSubbed }}</span>
		</p>
		<p class="text-gray5 dark:text-gray3 text-sm w-full">
			Renewal date: <span class="font-semibold">{{ $formatDate(s.renewalDate) }}</span>
		</p>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import CrownIcon from '@/components/icons/Crown.vue'
import { ISubscriptionWithProfile } from '@/store/subscriptions'

interface IData {
	avatar: string | ArrayBuffer
}

export default Vue.extend({
	components: { Avatar, CrownIcon },
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
})
</script>