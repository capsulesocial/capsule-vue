<template>
  <article
    class="transition duration-500 ease-in-out transform hover:scale-110 relative overflow-hidden h-40 rounded-lg shadow-lg"
  >
    <nuxt-link :to="'/discover/' + this.$props.text">
      <img
        :src="this.$props.bgImage"
        :alt="this.$props.text"
        class="opacity-50 absolute left-0 top-0 width-full height-auto object-fill"
      />
      <h4 class="text-xl relative p-5">
        <span
          class="font-extrabold bg-primary rounded-full px-4 py-1 text-white capitalize"
          >{{ this.$props.text }}</span
        >
      </h4>
    </nuxt-link>
  </article>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "No Title"
    },
    bgImage: {
      type: String,
      default: require("@/assets/images/discover/404.jpeg")
    }
  }
};
</script>
