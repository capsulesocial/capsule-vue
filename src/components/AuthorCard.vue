<template>
	<div class="border-t border-b p-5 my-5 flex flex-row justify-between">
		<div class="flex">
			<Avatar :avatar="authorAvatar" :authorID="authorID" size="w-16 h-16" />
			<div class="mx-4">
				<h6 class="text-sm uppercase text-lightSecondaryText">written by:</h6>
				<nuxt-link :to="'/' + authorID" class="text-2xl">
					{{ authorName }}
				</nuxt-link>
				<p
					:class="$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="italic text-sm w-full"
				>
					{{ authorBio }}
				</p>
			</div>
		</div>
		<div>
			<FriendButton
				v-if="authorID !== $store.state.session.id"
				class="justify-self-end"
				:following="isFollowed"
				:toggleFriend="toggleFriend"
				:showIcons="true"
			/>
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import FriendButton from '@/components/FriendButton.vue'
import Avatar from '@/components/Avatar.vue'

export default Vue.extend({
	components: {
		FriendButton,
		Avatar,
	},
	props: {
		authorAvatar: {
			type: String as PropType<ArrayBuffer | string | null>,
			default: null,
		},
		authorName: {
			type: String,
			required: true,
		},
		authorID: {
			type: String,
			required: true,
		},
		authorBio: {
			type: String,
			required: true,
		},
		isFollowed: {
			type: Boolean,
			required: true,
		},
		toggleFriend: {
			type: Function as PropType<() => void>,
			required: true,
		},
	},
})
</script>
