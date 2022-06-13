<template>
	<div class="w-full flex flex-row justify-between mt-4 mb-1">
		<div class="flex flex-row">
			<!-- Avatar -->
			<Avatar :avatar="avatar" :authorID="s.authorID" :size="`w-12 h-12 xl:w-14 xl:h-14`" class="self-center" />
			<!-- Middle: name and id -->
			<div class="ml-4 self-center">
				<h5 v-if="s.name !== ``" class="text-lightPrimaryText dark:text-darkPrimaryText">
					{{ s.name }}
				</h5>
				<h5 v-else class="text-gray5 dark:text-gray3">{{ s.authorID }}</h5>
				<h6 class="text-primary text-sm">@{{ s.authorID }}</h6>
			</div>
		</div>
		<!-- Renew button -->
		<SubscribeButton
			class="self-center"
			:toggleSubscription="
				() => {
					toggleSubscription({ s, avatar })
				}
			"
			:userIsSubscribed="activeSubscription"
		/>
	</div>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import Avatar from '@/components/Avatar.vue'
import SubscribeButton from '@/components/SubscribeButton.vue'
import { ISubscriptionWithProfile } from '@/store/subscriptions'
import { ISubscriptionResponse } from '@/backend/subscription'

interface IData {
	avatar: string | ArrayBuffer
	showEdit: boolean
	showPopup: boolean
	activeSubscription: boolean
}

export default Vue.extend({
	components: { Avatar, SubscribeButton },
	props: {
		s: {
			type: Object as PropType<ISubscriptionWithProfile>,
			required: true,
		},
		toggleSubscription: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			avatar: ``,
			showEdit: false,
			showPopup: false,
			activeSubscription: false,
		}
	},
	async created() {
		if (this.s.avatar) {
			this.avatar = await getPhotoFromIPFS(this.s.avatar)
		}
		// Check if existing subscription
		this.$store.dispatch(`subscriptions/fetchSubs`, this.$store.state.session.id)
		this.$store.state.subscriptions.active.forEach((sub: ISubscriptionResponse) => {
			if (sub.authorID === this.$route.params.id) {
				this.activeSubscription = true
			}
		})
	},
	methods: {},
})
</script>
