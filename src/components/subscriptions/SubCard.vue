<template>
	<div class="flex flex-col border rounded-lg shadow shadow-lg items-center p-4">
		<Avatar :avatar="avatar" :authorID="s.id" />
		<h5 class="font-semibold text-lg">{{ s.name }}</h5>
		<h6 class="text-primary">@{{ s.id }}</h6>
		<!-- Crown with tier label -->
		<div
			class="border border-neutral rounded-lg border-2 flex flex-row items-center bg-neutral bg-opacity-25 p-2 my-2 max-w-full"
		>
			<CrownIcon class="text-neutral mr-2 w-5 h-5" /><span class="truncate">{{ s.tier }}</span>
		</div>
		<p class="text-gray5 text-sm w-full mb-2">
			Total number of months subscribed: <span class="font-semibold">{{ s.monthlySubs }}</span>
		</p>
		<p class="text-gray5 text-sm w-full">
			Renewal date: <span class="font-semibold">{{ s.renewDate }}</span>
		</p>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ISubCardData } from '@/backend/subscription'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import CrownIcon from '@/components/icons/Crown.vue'

interface IData {
	avatar: string | ArrayBuffer
}

export default Vue.extend({
	components: { Avatar, CrownIcon },
	props: {
		s: {
			type: Object as PropType<ISubCardData>,
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