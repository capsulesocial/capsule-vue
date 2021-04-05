<template>
  <section class="border p-2">
    <!-- Username, kebab -->
    <article class="mb-2 flex justify-between items-center">
      <h5 class="text-base">{{ this.username }}</h5>
      <div>
        <h6 class="text-sm text-gray-600">{{ this.timestamp }}</h6>
        <h6 class="text-xs text-gray-600 text-right">{{ this.views }} views</h6>
      </div>
    </article>

    <article>
      <h3 class="text-xl font-bold">{{ this.title }}</h3>
      <h4 class="text-lg italic">{{ this.subtitle }}</h4>
    </article>

    <article></article>
  </section>
</template>

<script>
export default {
  data() {
    return {};
  },
  props: {
    title: {
      type: String,
      default: "This will be where the title goes"
    },
    subtitle: {
      type: String,
      default:
        "This will be where the subtitle goes. When a user clicks on this, they will be redirected to /_user/postID to view the content of the article."
    },
    views: {
      type: Number,
      default: 0
    },
    username: {
      type: String,
      default: "Username"
    },
    timestamp: {
      Type: Date,
      default: function() {
        return new Date().toLocaleString();
      }
    }
  }
};
</script>
