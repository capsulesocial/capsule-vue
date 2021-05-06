<template>
  <main>
    <h1 class="text-4xl">Categories</h1>

    <section class="grid grid-cols-1 gap-5 md:grid-cols-2 m-5">
      <DiscoverCard
        text="technology"
        :bgImage="require('@/assets/images/discover/technology.png')"
      />
      <DiscoverCard
        text="crypto"
        :bgImage="require('@/assets/images/discover/crypto.png')"
      />
      <DiscoverCard
        text="politics"
        :bgImage="require('@/assets/images/discover/politics.jpeg')"
      />
      <DiscoverCard
        text="US-World"
        :bgImage="require('@/assets/images/discover/us-world.jpeg')"
      />
      <DiscoverCard
        text="science"
        :bgImage="require('@/assets/images/discover/science.png')"
      />
      <DiscoverCard
        text="environment"
        :bgImage="require('@/assets/images/discover/environment.png')"
      />
      <DiscoverCard
        text="food & drink"
        :bgImage="require('@/assets/images/discover/food-drink.jpeg')"
      />
      <DiscoverCard
        text="culture"
        :bgImage="require('@/assets/images/discover/culture.jpeg')"
      />
      <DiscoverCard />
      <DiscoverCard />
    </section>
  </main>
</template>

<script>
import DiscoverCard from "@/components/DiscoverCard";
export default {
  components: {
    DiscoverCard
  }
};
</script>
