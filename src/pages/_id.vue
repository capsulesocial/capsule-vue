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
      <button @click="toggleFriend" class="rounded-full focus:outline-none">
        <FriendButton
          :isFollowing="this.isFollowing"
          :userID="currentUser.id"
        />
      </button>
    </article>

    <article>
      <p class="italic text-gray-700 px-5 text-center">
        {{ this.currentUser.bio }}
      </p>
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
import TwitterIcon from "@/components/icons/brands/Twitter";
import GitHubIcon from "@/components/icons/brands/GitHub";

export default {
  data() {
    return {
      currentUser: null,
      isFollowing: true
    };
  },
  components: {
    FriendButton,
    TwitterIcon,
    GitHubIcon
  },
  async created() {
    // The user in which I am currently viewing
    this.currentUser = this.$store.state.user;
  },
  methods: {
    toggleFriend: function() {
      this.isFollowing = !this.isFollowing;
    },
    openWindow(url) {
      if (process.client) {
        window.open(url, "_blank");
      }
    }
  }
};
</script>
