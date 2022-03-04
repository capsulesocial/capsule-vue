<template>
	<div class="flex">
		<Avatar :authorID="profile.id" :avatar="avatar" size="w-12 h-12" />
		<div class="h-12 flex-grow px-4">
			<nuxt-link :to="`/id/` + profile.id" class="flex flex-col">
				<span v-if="profile.name != ``" class="text-base font-medium dark:text-darkPrimaryText">
					{{ profile.name }}
				</span>
				<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ profile.id }} </span>
				<span class="text-primary dark:text-secondary text-sm">@{{ profile.id }}</span>
			</nuxt-link>
		</div>
		<FriendButton
			v-if="profile.id !== $store.state.session.id"
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
		if (this.profile.avatar !== null && this.profile.avatar !== ``) {
			this.avatar = await getPhotoFromIPFS(this.profile.avatar)
		}
		// Check if I am following the listed person
		getFollowersAndFollowing(this.profile.id, true).then(({ followers }) => {
			this.isFollowing = followers.has(this.$store.state.session.id)
		})
	},
	methods: {
		getPhotoFromIPFS,
		async toggleFriend() {
			// Unauth
			if (this.$store.state.session.id === ``) {
				this.$store.commit(`settings/toggleUnauthPopup`)
				return
			}
			try {
				if (this.profile.id !== this.$store.state.session.id) {
					await followChange(this.isFollowing ? `UNFOLLOW` : `FOLLOW`, this.$store.state.session.id, this.profile.id)
					this.isFollowing = !this.isFollowing
					this.$toastSuccess(this.isFollowing ? `Followed ${this.profile.id}` : `Unfollowed ${this.profile.id}`)
					if (this.updateFollowers) {
						this.updateFollowers()
					}
				}
			} catch (err: any) {
				if (err.response) {
					this.$toastError(err.response.data.error)
					return
				}
				this.$toastError(err.message)
			}
		},
	},
})
</script>
