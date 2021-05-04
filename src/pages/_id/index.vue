<template>
  <section>
    <!-- Name, socials, follow, bio -->
    <article class="flex flex-row justify-between">
      <div>
        <h3 class="text-3xl">{{ this.currentUser.username }}</h3>
        <h5 class="text-xl text-gray-700">@{{ this.currentUser.id }}</h5>
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

      <FriendButton :targetUser="currentUser" />
    </article>

    <article>
      <p class="text-sm italic py-2">{{ this.currentUser.bio }}</p>
    </article>

    <article class="font-sans flex flex-row justify-between">
      <nuxt-link
        :to="'/' + this.currentUser.id + '/followers'"
        class="border-b border-primary"
        >Followers: {{ this.currentUser.followers.length }}</nuxt-link
      >
      <nuxt-link
        :to="'/' + this.currentUser.id + '/following'"
        class="border-b border-primary"
        >Following: {{ this.currentUser.following.length }}</nuxt-link
      >
      <nuxt-link
        :to="'/' + this.currentUser.id + '/bookmarks'"
        class="border-b border-primary"
        >Bookmarks: {{ this.currentUser.bookmarks.length }}</nuxt-link
      >
    </article>
    <div class="mt-5">
      <nuxt-link :to="'/' + this.currentUser.id" class="text-xl">
        Posts
      </nuxt-link>
    </div>

    <article v-for="post in this.userPosts()" :key="post.id">
      <PostCard
        :post="post"
        :authorID="$route.params.id"
        :authorUsername="currentUser.username"
      />
    </article>
  </section>
</template>

<script>
import PostCard from "@/components/post/Card";
import AuthorCard from "@/components/AuthorCard";
import TwitterIcon from "@/components/icons/brands/Twitter";
import GitHubIcon from "@/components/icons/brands/GitHub";
import FriendButton from "@/components/FriendButton";
export default {
  data() {
    return {
      currentUser: null
    };
  },
  components: { PostCard, AuthorCard, TwitterIcon, GitHubIcon, FriendButton },
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
  },
  methods: {
    userPosts: function() {
      let posts = [];
      let p = this.$store.state.posts;
      for (let i = 0; i < p.length; i++) {
        if (p[i].authorID == this.currentUser.id) posts.push(p[i]);
      }
      return posts;
    },
    openWindow(url) {
      if (process.client) {
        window.open(url, "_blank");
      }
    }
  }
};
</script>
