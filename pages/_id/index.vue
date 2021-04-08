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
        <FriendButton :isFollowing="this.isFollowing" />
      </button>
    </article>

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
import FriendButton from "@/components/FriendButton";
export default {
  data() {
    return {
      currentUser: null,
      isFollowing: true
    };
  },
  components: {
    PostCard,
    FriendButton
  },
  async created() {
    // The user in which I am currently viewing
    this.currentUser = this.$store.state.user;
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
    toggleFriend: function() {
      this.isFollowing = !this.isFollowing;
    }
  }
};
</script>
