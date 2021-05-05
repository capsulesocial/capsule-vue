<template>
  <!-- <article
    class=" rounded-lg h-32 p-5 bg-contain bg-center bg-no-repeat shadow-lg bg-opacity-50"
    :style="{ backgroundImage: `url(${this.$props.bgImage})` }"
  >
    <h4 class="text-xl text-white">
      <span class="bg-primary rounded-full px-2 py-1">{{
        this.$props.text
      }}</span>
    </h4>
  </article> -->
  <article
    class="transition duration-500 ease-in-out transform hover:scale-110 relative overflow-hidden h-40 rounded-lg shadow-lg"
  >
    <img
      :src="this.$props.bgImage"
      :alt="this.$props.text"
      class="opacity-50 absolute left-0 top-0 width-full height-auto"
    />
    <h4 class="text-2xl relative p-5">
      <span class="bg-primary rounded-full px-4 py-1 text-white">{{
        this.$props.text
      }}</span>
    </h4>
  </article>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Text"
    },
    bgImage: {
      type: String,
      default: require("@/assets/images/discover/404.jpeg")
    }
  }
};
</script>
