<template>
  <section>
    <!-- Header -->
    <article class="pb-5 flex justify-between">
      <div>
        <h1 class="text-3xl text-center">
          {{ this.currentUser.username }}
        </h1>
        <h3 class="text-xl text-center text-gray-800">
          @{{ this.currentUser.id }}
        </h3>
      </div>
      <button @click="toggleFriend" class="rounded-full focus:outline-none">
        <FriendButton
          :isFollowing="this.isFollowing"
          :userID="currentUser.id"
        />
      </button>
    </article>

    <nav class="flex flex-row justify-around py-2">
      <nuxt-link
        :to="'/' + this.currentUser.id"
        class="border-b border-primary"
      >
        Posts
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/bookmarks'"
        class="border-b border-primary"
        >Bookmarks</nuxt-link
      >
    </nav>

    <nuxt-child :currentUser="this.currentUser" />
  </section>
</template>

<script>
import FriendButton from "@/components/FriendButton";
export default {
  data() {
    return {
      currentUser: null,
      isFollowing: true
    };
  },
  components: {
    FriendButton
  },
  async created() {
    // The user in which I am currently viewing
    this.currentUser = this.$store.state.user;
  },
  methods: {
    toggleFriend: function() {
      this.isFollowing = !this.isFollowing;
    }
  }
};
</script>
