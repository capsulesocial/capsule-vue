<template>
  <main>
    <section>
      <article class="flex justify-between mb-1 items-center mt-3">
        <h2 class="text-4xl font-bold">
          Featured Hashtags
        </h2>
        <select class="bg-white border border-gray3 text-gray4 rounded-lg text-lg px-2 py-2 focus:outline-none self-center">
          <option>Trending</option>
          <option>Top This Week</option>
          <option>All Time</option>
        </select>
      </article>
      <p class="text-gray4 mb-5 text-xl">
        Find and join conversations on any topic
      </p>
      <TagCard
        v-for="t in this.tags"
        :key="t"
        :tag="t"
      />
    </section>

    <section class="mt-3">
      <h2 class="text-4xl font-bold">
        Featured Categories
      </h2>
      <p class="text-gray4 mb-5 text-xl">
        Read more of what you love by browsing top categories
      </p>
      <div class="grid grid-cols-2 gap-4 md:grid-cols-4">
        <DiscoverCard
          v-for="c in this.categories"
          :key="c"
          :text="c"
          :bgImage="require('@/assets/images/discover/' + c + '/' + c + '.jpg')"
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
      tagCategory: 'trending',
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
        'US-world',
        'science',
        'environment',
        'food & drink',
        'culture',
        'education',
      ],
    }
  },
}
</script>
