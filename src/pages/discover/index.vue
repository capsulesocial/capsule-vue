<template>
  <main>
    <h1 class="text-4xl">
      Categories
    </h1>

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
  </main>
</template>

<script>
import DiscoverCard from '@/components/DiscoverCard'
export default {
  components: {
    DiscoverCard,
  },
}
</script>
