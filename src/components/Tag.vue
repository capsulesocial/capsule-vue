<template>
  <button
    class=" focus:outline-none  mr-4 my-1 px-2 py-1 transition duration-500 ease-in-out transform hover:scale-110"
    :class="this.$props.theme === 'colors' ? 'bg-white shadow rounded-full' : 'bg-gray1 text-gray5 rounded-lg'"
    @click="$router.push('/tag/' + tag)"
  >
    <span
      class="font-bold"
      :class="this.$props.theme === 'colors' ? colors[getRandomColor()] : 'text-gray5'"
    >
      #{{ tag }}
    </span>
  </button>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: '',
    },
    theme: {
      type: String,
      default: 'colors',
    },
  },
  data () {
    return {
      colors: [
        'text-primary',
        'text-secondary',
        'text-teal',
        'text-ocean',
        'text-fourth',
        'text-fifth',
      ],
    }
  },
  methods: {
    getRandomColor () {
      let i = (Math.random() * 5) % 5
      i = Math.round(i)
      return i
    },
  },
}
</script>
