<template>
	<div
		:class="this.$store.state.settings.darkMode ? 'bg-lightAuthorCard' : 'bg-darkAuthorCard'"
		class="border rounded-lg p-5 shadow-xl my-5 flex flex-row justify-between"
	>
		<div class="flex-shrink-0 flex">
			<img
				v-if="this.$props.authorAvatar !== ``"
				:src="this.$props.authorAvatar"
				class="w-12 h-12 rounded-lg object-cover"
			/>
			<ProfileIcon v-else class="w-10 h-10 border-2 rounded-full" />

			<div class="mx-4">
				<h6 class="text-sm italic">About the Author:</h6>
				<h4 class="text-lg inline">
					{{ this.$props.authorName }}
				</h4>
				<nuxt-link
					:to="'/' + this.$props.authorCID"
					:class="this.$store.state.settings.darkMode ? 'text-lightActive' : 'text-darkActive'"
					class="text-sm underline inline"
				>
					@{{ this.$props.authorId }}
				</nuxt-link>
				<p
					:class="this.$store.state.settings.darkMode ? 'text-lightSecondaryText' : 'text-darkSecondaryText'"
					class="italic text-sm"
				>
					{{ this.$props.authorBio }}
				</p>
			</div>
		</div>

		<FriendButton class="justify-self-end" :authorID="this.$props.authorCID" />
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
