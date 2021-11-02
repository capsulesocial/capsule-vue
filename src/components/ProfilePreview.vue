<template>
	<div class="flex">
		<Avatar :authorID="$props.profile.id" :avatar="avatar" size="w-12 h-12" />
		<div class="h-12 flex-grow px-4">
			<nuxt-link :to="`/` + $props.profile.id" class="flex flex-col">
				<h3 class="font-medium text-base">
					{{ $props.profile.name }}
					<span class="text-lightSecondaryText ml-2">@{{ $props.profile.id }}</span>
				</h3>
				<p class="">{{ $props.profile.bio }}</p>
			</nuxt-link>
		</div>
		<FriendButton
			v-if="$props.profile.id !== $store.state.session.id"
			:userIsFollowed="isFollowing"
			:toggleFriend="toggleFriend"
			class="justify-self-end"
		/>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	isFollowing: boolean
	avatar: string | null
}

export default Vue.extend({
	name: `ProfilePreview`,
	components: {
		Avatar,
		FriendButton,
	},
	props: {
		profile: {
			type: Object,
			default: null,
		},
		updateFollowers: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
	data(): IData {
		return {
			isFollowing: false,
			avatar: null,
		}
	},
	async created() {
		// fetch avatar
		if (this.$props.profile.avatar !== null && this.$props.profile.avatar !== ``) {
			this.avatar = await getPhotoFromIPFS(this.$props.profile.avatar)
		}
		// Check if I am following the listed person
		getFollowersAndFollowing(this.$props.profile.id, true).then(({ followers }) => {
			this.isFollowing = followers.has(this.$store.state.session.id)
		})
	},
	methods: {
		getPhotoFromIPFS,
		async toggleFriend() {
			if (this.$props.profile.id !== this.$store.state.session.id) {
				await followChange(
					this.isFollowing ? `UNFOLLOW` : `FOLLOW`,
					this.$store.state.session.id,
					this.$props.profile.id,
				)
				this.isFollowing = !this.isFollowing
				if (this.$props.updateFollowers) {
					this.updateFollowers()
				}
			}
		},
	},
})
</script>