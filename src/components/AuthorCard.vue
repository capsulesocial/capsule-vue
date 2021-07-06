<template>
  <div
    v-if="this.author"
    class="border rounded-lg bg-gray-200 p-5 shadow-xl my-5 flex flex-row"
  >
    <div class="flex-shrink-0">
      <ProfileIcon
        v-if="this.author.avatar === '' || this.author.avatar === null"
        class="w-10 h-10 border-2 rounded-full"
      />
      <img
        v-else
        :src="this.avatar"
        class="w-12 h-12 rounded-lg object-cover"
      />
    </div>
    <div class="mx-4">
      <h6 class="text-sm italic">
        About the Author:
      </h6>
      <h4 class="text-lg inline">
        {{ this.author.name }}
      </h4>
      <nuxt-link
        :to="'/' + this.author.id"
        class="text-sm text-primary underline inline"
      >
        @{{ this.author.id }}
      </nuxt-link>
      <p class="italic text-sm text-gray-700">
        {{ this.author.bio }}
      </p>
    </div>
    <FriendButton :authorID="author.id" />
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
	},
	data () {
		return {
			author: {},
			avatar: ``,
		}
	},
	created () {
		// The user in which I am currently viewing
		// Check if this is my profile
		if (this.$props.authorCID === this.$store.state.session.cid) {
			this.author = this.$store.state.session
		}
		// Get user profile
		this.$getProfile(this.$props.authorCID).then((profile) => {
			this.author = profile
			// Get Author Avatar
			// @ts-ignore
			if (this.author.avatar !== ``) {
				// @ts-ignore
				this.$getPhoto(this.author.avatar).then((image) => {
					this.avatar = image
				})
			}
		})
	},
})
</script>
