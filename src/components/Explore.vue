<template>
  <aside class="fixed right-0 pr-10 w-1/4">
    <div
      class="font-sans mx-4"
    >
      <h3 class="font-serif text-2xl underline italic p-2">
        Trending Tags
      </h3>
      <button
        v-for="t in this.$store.state.tags"
        :key="t.tag"
        class="text-white uppercase focus:outline-none rounded m-1 p-2 transition duration-500 ease-in-out transform hover:scale-110"
        :class="colors[$store.state.tags.indexOf(t) % 6]"
        @click="$router.push('/tag/' + t.tag)"
      >
        {{ t.tag }}
      </button>
    </div>
  </aside>
</template>

<script>
export default {
  data () {
    return {
      colors: [
        'bg-red-500',
        'bg-yellow-500',
        'bg-blue-500',
        'bg-indigo-500',
        'bg-purple-500',
        'bg-pink-500',
      ],
    }
  },
}
</script>
