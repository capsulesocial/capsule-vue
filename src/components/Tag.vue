<template>
  <span>
    <button
      class="bg-white shadow focus:outline-none rounded-full mr-4 mb-2 p-2 transition duration-500 ease-in-out transform hover:scale-110"
      @click="$router.push('/tag/' + tag)"
    >
      <span
        class="text-lg font-bold"
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
