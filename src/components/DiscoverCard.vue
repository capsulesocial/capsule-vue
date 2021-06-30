<template>
  <article
    class="flex items-end transition duration-500 ease-in-out transform hover:scale-110 overflow-hidden h-40 rounded-lg shadow-lg bg-primary"
  >
    <nuxt-link :to="'/discover/' + this.$props.text">
      <img
        :src="this.$props.bgImage"
        :alt="this.$props.text"
        class="opacity-75 absolute left-0 top-0 object-cover h-40 w-full "
      />
      <div class="flex flex-col font-sans p-4">
        <h4 class="text-lg text-white font-extrabold capitalize z-20">
          {{ this.$props.text }}
        </h4>
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
    },
  },
}
</script>
