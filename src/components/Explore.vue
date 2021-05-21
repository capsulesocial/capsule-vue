<template>
  <aside class="fixed right-0 pr-10 w-1/4">
    <div
      class="font-sans mx-4"
    >
      <h3 class="font-serif text-2xl underline italic p-2">
        Trending Tags
      </h3>
      <TagCard
        v-for="t in this.$store.state.tags.tags"
        :key="t.tag"
        :tag="t.tag"
      />
    </div>
  </aside>
</template>

<script>
import TagCard from '@/components/Tag'

export default {
  components: {
    TagCard,
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
        'bg-green-500',
      ],
    }
  },
  methods: {
    getRandomColor () {
      let i = (Math.random() * 6) % 6
      i = Math.round(i)
      return i
    },
  },
}
</script>
