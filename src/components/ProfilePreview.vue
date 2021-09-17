<template>
	<div class="flex">
		<Avatar :authorID="$props.profile.id" :avatar="$props.profile.avatar" size="w-12 h-12" :getPhotoFromIPFS="true" />
		<div class="h-12">
			<nuxt-link :to="`/` + $props.profile.id" class="flex flex-col">
				<h3>
					{{ $props.profile.name }}
					<span class="text-lightSecondaryText">{{ $props.profile.id }}</span>
				</h3>
				<p>{{ $props.profile.bio }}</p>
			</nuxt-link>
		</div>
		<FriendButton
			v-if="$props.profile.id !== $store.state.session.id"
			:following="isFollowing"
			:toggleFriend="toggleFriend"
		/>
		<!-- {{ $props.profile }} -->
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import Avatar from '@/components/Avatar.vue'
import FriendButton from '@/components/FriendButton.vue'
import { getPhotoFromIPFS } from '@/backend/photos'
import { followChange, getFollowersAndFollowing } from '@/backend/following'

interface IData {
	isFollowing: boolean
}

export default Vue.extend({
	components: {
		Avatar,
		FriendButton,
	},
	props: {
		profile: {
			type: Object,
			default: null,
		},
	},
	data(): IData {
		return {
			isFollowing: false,
		}
	},
	created() {
		// Check if I am following the listed person
		getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
			this.isFollowing = following.has(this.$props.profile.id)
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
			}
			getFollowersAndFollowing(this.$store.state.session.id).then(({ following }) => {
				this.isFollowing = following.has(this.$props.profile.id)
			})
		},
	},
})
</script>