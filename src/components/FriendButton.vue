<template>
  <div class="rounded-full">
    <button
      v-if="$store.state.user.id !== targetUser.id"
      @click="toggleFriend"
      class="rounded-full focus:outline-none"
    >
      <div
        v-if="iFollow()"
        class="bg-white self-center rounded-full shadow-lg p-4 border border-primary"
      >
        <span class="text-primary text-bold"><UnfollowIcon /></span>
      </div>
      <div v-else class="bg-primary self-center rounded-full shadow-lg p-4">
        <span class="text-white text-bold"><FollowIcon /></span>
      </div>
    </button>
  </div>
</template>

<script>
import FollowIcon from "@/components/icons/Follow";
import UnfollowIcon from "@/components/icons/Unfollow";

export default {
  props: {
    targetUser: {
      type: Object,
      default: null
    }
  },
  components: {
    FollowIcon,
    UnfollowIcon
  },
  methods: {
    iFollow: function() {
      // Check if I am following currentUser
      let followingList = this.$store.state.user.following;
      for (let i = 0; i < followingList.length; i++) {
        if (followingList[i] === this.$route.params.id) {
          return true;
        }
      }
      return false;
    },
    toggleFriend: function() {
      this.$store.commit("handleFollow", this.targetUser.id);
    }
  }
};
</script>
