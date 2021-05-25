<template>
  <main>
    <h2 class="text-4xl font-sans">
      Featured Categories
    </h2>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-2 m-5">
      <DiscoverCard text="technology" />
      <DiscoverCard text="crypto" />
      <DiscoverCard text="politics" />
      <DiscoverCard text="US-World" />
      <DiscoverCard text="science" />
      <DiscoverCard text="environment" />
      <DiscoverCard text="food & drink" />
      <DiscoverCard text="culture" />
    </section>

    <h2 class="text-4xl font-sans">
      Tags
    </h2>
    <section>
      <TagCard
        v-for="t in this.tags"
        :key="t"
        :tag="t"
      />
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
    }
  },
}
</script>
