<template>
  <div
    v-if="this.author"
    class="border rounded-lg bg-gray-200 p-5 shadow-xl my-5 flex flex-row"
  >
    <div class="flex-shrink-0">
      <img
        v-if="this.author.avatar !== null"
        :src="this.avatar"
        class="w-12 h-12 rounded-lg"
      />
      <ProfileIcon v-else class="w-10 h-10 border-2 rounded-full" />
    </div>
    <div class="mx-4">
      <h6 class="text-sm italic">
        About the Author:
      </h6>
      <h4 class="text-lg inline">
        {{ this.author.username }}
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
    <FriendButton :targetUser="author" />
  </div>
</template>

<script>
import FriendButton from '@/components/FriendButton'
import ProfileIcon from '@/components/icons/Person'

export default {
  components: {
    FriendButton,
    ProfileIcon,
  },
  props: {
    authorID: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      author: null,
      avatar: null,
    }
  },
  created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$props.authorID === this.$store.state.me.id) {
      this.author = this.$store.state.me
    }
    // Get user profile
    // this.author = this.$api.profile.getProfile(this.$props.authorID)
    const l = this.$store.state.authors
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$props.authorID) {
        this.author = l[p]
      }
    }
    // Get Author Avatar
    if (this.author.avatar !== null) {
      this.$api.settings.downloadAvatar(this.author.avatar).then((image) => {
        this.avatar = image
      })
    }
  },
}
</script>
