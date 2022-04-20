<template>
	<div class="flex items-center">
		<Avatar :authorID="profile.id" :avatar="avatar" size="w-12 h-12" />
		<div class="h-12 flex-grow px-4">
			<nuxt-link :to="`/id/` + profile.id" class="flex flex-col">
				<span v-if="profile.name != ``" class="text-base font-medium dark:text-darkPrimaryText">
					{{ profile.name }}
				</span>
				<span v-else class="text-gray5 dark:text-gray3 text-base font-medium"> {{ profile.id }} </span>
				<span class="text-gray5 dark:text-gray3 text-sm">@{{ profile.id }}</span>
			</nuxt-link>
		</div>
		<FriendButton
			v-if="profile.id !== $store.state.session.id"
			:userIsFollowed="isFollowing"
			:toggleFriend="toggleFriend"
			class="justify-self-end"
		/>
		<span
			v-else
			class="bg-darkBG dark:bg-lightBG dark:text-darkPrimaryText rounded-2xl bg-opacity-25 dark:bg-opacity-25 py-1 px-2 text-xs"
		>
			You
		</span>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import { followChange, getFollowersAndFollowing } from '@/backend/following'
import { Profile } from '@/backend/profile'

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
			type: Object as PropType<Profile>,
			default: null,
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
					this.$emit(`updateFollowers`)
				}
			} catch (err: unknown) {
				this.$handleError(err)
			}
		},
	},
})
</script>
