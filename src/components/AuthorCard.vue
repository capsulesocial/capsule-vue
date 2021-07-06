<template>
  <div class="border rounded-lg bg-gray-200 p-5 shadow-xl my-5 flex flex-row">
    <div class="flex-shrink-0">
      <ProfileIcon
        v-if="this.avatar === ``"
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
        {{ this.name }}
      </h4>
      <nuxt-link
        :to="'/' + this.$props.authorCID"
        class="text-sm text-primary underline inline"
      >
        @{{ this.id }}
      </nuxt-link>
      <p class="italic text-sm text-gray-700">
        {{ this.bio }}
      </p>
    </div>
    <FriendButton :authorID="this.$props.authorCID" />
    <span class="hidden"> {{ getProfileInfo() }}</span>
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
			name: ``,
			id: ``,
			bio: ``,
			avatar: ``,
		}
	},
	methods: {
		getProfileInfo () {
			this.$getProfile(this.$props.authorCID).then((p) => {
				p.cid = this.$props.authorCID
				this.name = p.name
				this.id = p.id
				this.bio = p.bio
			})
		},
	},
})
</script>
