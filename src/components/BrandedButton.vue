<template>
  <button
    @click="this.$props.action"
    class="transition duration-500 ease-in-out transform hover:scale-110 bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
  >
    {{ this.$props.text }}
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: "Text"
    },
    action: {
      type: Function,
      default: function() {
        console.log("Button Clicked");
      }
    }
  }
};
</script>
