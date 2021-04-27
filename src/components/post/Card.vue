<template>
  <article class="border">
    <!-- Post Preview Link -->
    <div class="mb-2 flex justify-between items-center p-2">
      <nuxt-link :to="'/' + this.authorID">
        <h5 class="text-base hover:text-primary">{{ this.authorUsername }}</h5>
        <h6 class="text-sm text-gray-600">
          {{ this.post.timestamp.toLocaleString() }}
        </h6>
      </nuxt-link>
      <div class="flex">
        <span v-if="this.showMoreMenu">
          <button @click="handleShare()" class="flex focus:outline-none">
            <ShareIcon class="mr-2" /></button
        ></span>
        <button @click="toggleMoreMenu" class="hover:text-primary">
          <MoreIcon />
        </button>
      </div>
    </div>

    <div class="p-2 hover:text-primary">
      <nuxt-link :to="'/' + this.authorID + '/' + this.post.id">
        <h3 class="text-xl font-bold">{{ this.post.title }}</h3>
        <h4 class="text-lg italic">{{ this.post.subtitle }}</h4>
      </nuxt-link>
    </div>

    <div>
      <PostActions :post="this.post" :authorID="this.authorID" />
    </div>
  </article>
</template>

<script>
import PostActions from "@/components/post/Actions";
import MoreIcon from "@/components/icons/More";
import ShareIcon from "@/components/icons/Share";

export default {
  data() {
    return {
      showMoreMenu: false
    };
  },
  props: {
    post: {
      type: Object,
      default: null
    },
    authorID: {
      type: String,
      default: null
    },
    authorUsername: {
      type: String,
      default: null
    }
  },
  components: {
    PostActions,
    MoreIcon,
    ShareIcon
  },
  methods: {
    toggleMoreMenu: function() {
      this.showMoreMenu = !this.showMoreMenu;
    },
    handleShare() {
      var url = document.getElementById(this.$props.post.id);
      url.type = "text";
      url.value =
        document.location.origin + "/" + this.authorID + "/" + this.post.id;
      url.select();
      url.setSelectionRange(0, 99999);
      document.execCommand("copy");
      url.type = "hidden";
      alert("URL Copied to Clipboard!");
    }
  }
};
</script>
