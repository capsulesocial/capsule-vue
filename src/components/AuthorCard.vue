<template>
  <div class="border rounded-lg bg-gray-200 p-5 shadow-xl my-5 flex flex-row">
    <div class="flex-shrink-0">
      <img
        v-if="this.$props.authorAvatar !== ``"
        :src="this.$props.authorAvatar"
        class="w-12 h-12 rounded-lg object-cover"
      />
      <ProfileIcon
        v-else
        class="w-10 h-10 border-2 rounded-full"
      />
    </div>
    <div class="mx-4">
      <h6 class="text-sm italic">
        About the Author:
      </h6>
      <h4 class="text-lg inline">
        {{ this.$props.authorName }}
      </h4>
      <nuxt-link
        :to="'/' + this.$props.authorCID"
        class="text-sm text-primary underline inline"
      >
        @{{ this.$props.authorId }}
      </nuxt-link>
      <p class="italic text-sm text-gray-700">
        {{ this.$props.authorBio }}
      </p>
    </div>
    <FriendButton :authorID="this.$props.authorCID" />
  </div>
</template>

<script lang="ts">
import Vue from "vue"
import FriendButton from "@/components/FriendButton.vue"
import ProfileIcon from "@/components/icons/Person.vue"

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
