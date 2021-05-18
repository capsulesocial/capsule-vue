<template>
  <span>
    <button
      class="text-white uppercase focus:outline-none rounded-lg m-1 p-2 transition duration-500 ease-in-out transform hover:scale-110"
      :class="colors[getRandomColor()]"
      @click="$router.push('/tag/' + tag)"
    >
      {{ tag }}
    </button>
  </span>
</template>

<script>
export default {
  props: {
    tag: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      colors: [
        'bg-red-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
        'bg-gray-500',
      ],
    }
  },
  methods: {
    getRandomColor () {
      let i = ((Math.random() * 6) % 6)
      i = Math.round(i)
      return i
    },
  },
}
</script>
