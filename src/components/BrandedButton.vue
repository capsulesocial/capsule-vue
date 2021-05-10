<template>
  <button
    class="transition duration-500 ease-in-out transform hover:scale-110 bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
    @click="this.$props.action"
  >
    <span class="font-sans">
      {{ this.$props.text }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    text: {
      type: String,
      default: 'Text',
    },
    action: {
      type: Function,
      default () {
        // eslint-disable-next-line no-console
        console.log('Button Clicked')
      },
    },
  },
}
</script>
