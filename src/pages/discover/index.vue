<template>
  <main>
    <section>
      <div class="flex justify-between mb-1">
        <h2 class="text-4xl font-sans">
          Featured Hashtags
        </h2>
        <select class="bg-white mb-5">
          <option>Trending</option>
          <option>Top This Week</option>
          <option>All Time</option>
        </select>
      </div>
      <p class="text-gray-600 mb-5">
        Find and join conversations on any topic.
      </p>
      <TagCard
        v-for="t in this.tags"
        :key="t"
        :tag="t"
      />
    </section>

    <section class="mt-5">
      <h2 class="text-4xl font-sans mb-1">
        Featured Categories
      </h2>
      <p class="text-gray-600 mb-5">
        Read more of what you love by browsing top categories.
      </p>
      <div class="grid grid-cols-2 gap-5 md:grid-cols-4">
        <DiscoverCard
          v-for="c in this.categories"
          :key="c"
          :text="c"
        />
      </div>
    </section>
  </main>
</template>

<script>
import DiscoverCard from '@/components/DiscoverCard'
import TagCard from '@/components/Tag'

export default {
  components: {
    DiscoverCard,
    TagCard,
  },
  layout: 'Extended',
  data () {
    return {
      tags: [
        'jack',
        'pancakes',
        'biking',
        'reddit',
        'crypto',
        'lizardpeople',
        'LEGOs',
        'aspen',
        'clock',
        'sunset',
        'beef',
      ],
      categories: [
        'technology',
        'crypto',
        'politics',
        'US-World',
        'science',
        'environment',
        'food & drink',
        'culture',
      ],
    }
  },
}
</script>
