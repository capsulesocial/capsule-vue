<template>
  <section>
    <h1 class="text-3xl py-2">
      Library of Bookmarks by {{ this.$route.params.id }}
    </h1>

    <div v-for="p in this.getBookmarkList()" :key="p.id">
      <PostCard :post="p" :authorID="p.authorID" :authorUsername="p.authorID" />
    </div>
  </section>
</template>

<script>
import PostCard from "@/components/post/Card";

export default {
  data() {
    return {};
  },
  components: {
    PostCard
  },
  methods: {
    getBookmarkList: function() {
      let res = [];
      let bookmarkList = this.$store.state.user.bookmarks;
      let postList = this.$store.state.posts;
      // Loop through list of bookmarks on a profile
      for (let i = 0; i < bookmarkList.length; i++) {
        // console.log(bookmarkList[i]);
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
