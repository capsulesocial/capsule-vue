<template>
	<div class="border-t border-b p-5 my-5 flex flex-row justify-between">
		<div class="flex">
			<img
				v-if="authorAvatar !== `` && authorAvatar !== null"
				:src="authorAvatar"
				class="w-12 h-12 rounded-lg object-cover"
			/>
			<ProfileIcon v-else class="w-10 h-10 border rounded-full" />

			<div class="mx-4">
				<h6 class="text-sm uppercase text-lightSecondaryText">written by:</h6>
				<nuxt-link :to="'/' + authorID" class="text-2xl">
					{{ authorName }}
				</nuxt-link>
				<p
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="italic text-sm w-full"
				>
					{{ authorBio }}
				</p>
			</div>
		</div>
		<div>
			<FriendButton class="justify-self-end" :authorID="authorID" :showIcons="true" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import type { PropType } from 'vue'
import FriendButton from '@/components/FriendButton.vue'
import ProfileIcon from '@/components/icons/Person.vue'

export default Vue.extend({
	components: {
		FriendButton,
		ProfileIcon,
	},
	props: {
		authorAvatar: {
			type: Object as PropType<ArrayBuffer | string | null>,
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
	},
})
</script>
