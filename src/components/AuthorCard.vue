<template>
	<div class="border-t border-b py-5 my-5">
		<div class="flex flex-col xl:flex-row justify-between items-center">
			<div>
				<h6 class="text-sm text-gray6 mb-4 font-sans">Written By:</h6>
				<div class="flex pr-5">
					<Avatar :avatar="authorAvatar" :authorID="authorID" size="w-16 h-16" class="flex-shrink-0 self-start" />
					<div class="mx-4">
						<nuxt-link v-if="authorName != ``" :to="'/id/' + authorID" class="text-2xl">
							{{ authorName }}
						</nuxt-link>
						<nuxt-link v-else :to="'/id/' + authorID" class="text-2xl text-gray5"> {{ authorID }} </nuxt-link>
						<p class="w-full text-gray6">
							{{ authorBio }}
						</p>
					</div>
				</div>
			</div>
			<div class="mr-5 mt-3 xl:mt-0">
				<FriendButton
					v-if="authorID !== $store.state.session.id"
					class="justify-self-end hidden xl:block"
					:userIsFollowed="isFollowed"
					:toggleFriend="toggleFriend"
				/>
			</div>
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
