<template>
  <span>
    <button
      class="bg-white shadow focus:outline-none rounded-lg mr-4 mb-2 p-2 transition duration-500 ease-in-out transform hover:scale-110"
      @click="$router.push('/tag/' + tag)"
    >
      <span
        class="text-lg"
        :class="colors[getRandomColor()]"
      >
        #{{ tag }}
      </span>
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
        'text-red-500',
        'text-yellow-500',
        'text-blue-500',
        'text-indigo-500',
        'text-purple-500',
        'text-pink-500',
        'text-gray-500',
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
