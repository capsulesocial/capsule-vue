<template>
	<div class="flex flex-col border rounded-lg shadow shadow-lg items-center">
		<Avatar :avatar="avatar" :authorID="s.id" />
		<h5 class="font-semibold text-lg">{{ s.name }}</h5>
		<h6 class="text-primary">@{{ s.id }}</h6>
		{{ s.tier }}
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { ISubCardData } from '@/backend/subscription'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'

interface IData {
	avatar: string | ArrayBuffer
}

export default Vue.extend({
	components: { Avatar },
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