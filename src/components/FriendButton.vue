<template>
  <button @click="handleFollow" class="focus:outline-none rounded-full">
    <div
      v-if="isFollowing"
      class="bg-white self-center rounded-full shadow-lg p-4 border border-primary"
    >
      <span class="text-primary text-bold"><UnfollowIcon /></span>
    </div>
    <div v-else class="bg-primary self-center rounded-full shadow-lg p-4">
      <span class="text-white text-bold"><FollowIcon /></span>
    </div>
  </button>
</template>

<script>
import FollowIcon from "@/components/icons/Follow";
import UnfollowIcon from "@/components/icons/Unfollow";

export default {
  props: {
    isFollowing: {
      type: Boolean,
      default: false
    },
    userID: {
      type: String,
      default: null
    }
  },
  components: {
    FollowIcon,
    UnfollowIcon
  },
  methods: {
    handleFollow: function() {
      if (this.userID) {
        this.$store.commit("handleFollow", this.userID);
      }
    }
  }
};
</script>
