<template>
	<div class="border-t border-b p-5 my-5 flex flex-row justify-between">
		<div class="flex-shrink-0 flex">
			<img
				v-if="this.$props.authorAvatar !== ``"
				:src="this.$props.authorAvatar"
				class="w-12 h-12 rounded-lg object-cover"
			/>
			<ProfileIcon v-else class="w-10 h-10 border-2 rounded-full" />

			<div class="mx-4">
				<h6 class="text-sm uppercase text-lightSecondaryText">written by:</h6>
				<nuxt-link :to="'/' + this.$props.authorCID" class="text-2xl">
					{{ this.$props.authorName }}
				</nuxt-link>
				<p
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="italic text-sm"
				>
					{{ this.$props.authorBio }}
				</p>
			</div>
		</div>
		<div>
			<FriendButton class="justify-self-end" :authorID="this.$props.authorCID" :showIcons="true" />
		</div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import FriendButton from '@/components/FriendButton.vue'
import ProfileIcon from '@/components/icons/Person.vue'

export default Vue.extend({
	components: {
		FriendButton,
		ProfileIcon,
	},
	props: {
		authorCID: {
			type: String,
			default: null,
		},
		authorAvatar: {
			type: String,
			default: ``,
		},
		authorName: {
			type: String,
			default: ``,
		},
		authorId: {
			type: String,
			default: ``,
		},
		authorBio: {
			type: String,
			default: ``,
		},
	},
})
</script>
