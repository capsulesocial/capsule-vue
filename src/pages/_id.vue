<template>
  <main>
    <!-- Header -->
    <header class="pb-5 flex justify-between">
      <div>
        <h1 class="text-3xl text-center">
          {{ this.currentUser.username }}
        </h1>
        <h3 class="text-xl text-center text-gray-800">
          @{{ this.currentUser.id }}
        </h3>
      </div>
      <div class="flex items-center">
        <span
          v-for="s in this.currentUser.socials"
          :key="s.platform"
          class="px-2"
        >
          <!-- Twitter -->
          <button
            v-if="s.platform === 'twitter'"
            @click="openWindow('https://twitter.com/' + s.username)"
            class="focus:outline-none text-primary"
          >
            <TwitterIcon />
          </button>
          <!-- GitHub -->
          <button
            v-if="s.platform === 'github'"
            @click="openWindow('https://github.com/' + s.username)"
            class="focus:outline-none text-primary"
          >
            <GitHubIcon v-if="s.platform === 'github'" />
          </button>
        </span>
      </div>
      <button
        v-if="this.$store.state.user.id !== currentUser.id"
        @click="toggleFriend"
        class="rounded-full focus:outline-none"
      >
        <FriendButton
          :isFollowing="this.isFollowing"
          :userID="currentUser.id"
        />
      </button>
    </header>

    <div>
      <p class="italic text-gray-700">
        {{ this.currentUser.bio }}
      </p>
    </div>

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
  </main>
</template>

<script>
import FriendButton from "@/components/FriendButton";
import TwitterIcon from "@/components/icons/brands/Twitter";
import GitHubIcon from "@/components/icons/brands/GitHub";

export default {
  data() {
    return {
      currentUser: null,
      isFollowing: false
    };
  },
  components: {
    FriendButton,
    TwitterIcon,
    GitHubIcon
  },
  async created() {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.user.id) {
      this.currentUser = this.$store.state.user;
    }
    // Get user profile
    // this.currentUser = this.$api.profile.getProfile(this.$route.params.id)
    let l = this.$store.state.userList;
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$route.params.id) {
        this.currentUser = l[p];
      }
    }
    // Check if I am following currentUser
    let followingList = this.$store.state.user.following;
    for (let i = 0; i < followingList.length; i++) {
      if (followingList[i] === this.$store.state.user.id) {
        this.isFollowing = true;
        break;
      }
    }
  },
  methods: {
    toggleFriend: function() {
      this.isFollowing = !this.isFollowing;
      this.$store.commit("handleFollow", this.currentUser.id);
    },
    openWindow(url) {
      if (process.client) {
        window.open(url, "_blank");
      }
    }
  }
};
</script>
