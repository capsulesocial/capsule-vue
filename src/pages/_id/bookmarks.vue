<template>
  <section>
    <article>
      <PageTitle :title="'Bookmarks of ' + this.$route.params.id" />
    </article>
    <div v-for="p in this.getBookmarkList()" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from "@/components/post/Card";
import PageTitle from "@/components/PageTitle";

export default {
  data() {
    return {};
  },
  components: {
    PostCard,
    PageTitle
  },
  methods: {
    getBookmarkList: function() {
      let res = [];
      // Get list of bookmarked posts by visited profile
      // let targetProfile = this.$api.profile.getProfile(this.$route.params.id)
      let targetProfile = {};
      if (this.$route.params.id === this.$store.state.user.id) {
        targetProfile = this.$store.state.user;
      } else {
        for (let p = 0; p < this.$store.state.userList.length; p++) {
          if (this.$store.state.userList[p].id === this.$route.params.id) {
            targetProfile = this.$store.state.userList[p];
            break;
          }
        }
      }

      let bookmarkList = targetProfile.bookmarks;
      let postList = this.$store.state.posts;
      // Loop through list of bookmarks on a profile
      for (let i = 0; i < bookmarkList.length; i++) {
        // Find post object and add it to result
        for (let j = 0; j < postList.length; j++) {
          if (postList[j].id === bookmarkList[i]) {
            res.push(postList[j]);
          }
        }
      }
      return res;
    }
  }
};
</script>
