<template>
  <button
    :class="this.size"
    class="transition duration-500 ease-in-out transform hover:scale-110 bg-primary hover:bg-green-600 text-white font-bold rounded-lg shadow-lg focus:outline-none"
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
    thin: {
      type: Boolean,
      default: false,
    },
    action: {
      type: Function,
      default () {
        // eslint-disable-next-line no-console
        console.log('Button Clicked')
      },
    },
  },
  data () {
    return {
      size: !this.$props.thin ? 'py-2 px-4' : 'py-1 px-2',
    }
  },
}
</script>
