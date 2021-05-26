<template>
  <article
    class="flex items-end transition duration-500 ease-in-out transform hover:scale-110 overflow-hidden h-40 rounded-lg shadow-lg bg-gray-900"
  >
    <nuxt-link :to="'/discover/' + this.$props.text">
      <!-- <img
        :src="this.$props.bgImage"
        :alt="this.$props.text"
        class="opacity-50 absolute left-0 top-0 width-full height-auto object-fill"
      /> -->
      <div class="flex flex-col font-sans p-4">
        <h4 class="text-lg text-white font-extrabold capitalize">
          {{ this.$props.text }}
        </h4>
        <h6 class="text-white">
          4k Posts
        </h6>
      </div>
    </nuxt-link>
  </article>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'No Title',
    },
    bgImage: {
      type: String,
      default: require('@/assets/images/discover/404.jpeg'),
    },
  },
}
</script>
