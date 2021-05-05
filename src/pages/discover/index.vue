<template>
  <main>
    <h1 class="text-4xl">Discover Categories</h1>

    <section class="grid grid-cols-1 gap-4 lg:grid-cols-2">
      <DiscoverCard
        text="Technology"
        :bgImage="require('@/assets/images/discover/technology.png')"
      />
      <DiscoverCard
        text="Crypto"
        :bgImage="require('@/assets/images/discover/crypto.jpeg')"
      />
      <DiscoverCard
        text="Politics"
        :bgImage="require('@/assets/images/discover/politics.jpeg')"
      />
      <DiscoverCard
        text="US / World"
        :bgImage="require('@/assets/images/discover/us-world.jpeg')"
      />
      <DiscoverCard
        text="Science"
        :bgImage="require('@/assets/images/discover/science.png')"
      />
      <DiscoverCard
        text="Environment"
        :bgImage="require('@/assets/images/discover/environment.png')"
      />
      <DiscoverCard
        text="Food & Drink"
        :bgImage="require('@/assets/images/discover/food-drink.png')"
      />
      <DiscoverCard
        text="Culture"
        :bgImage="require('@/assets/images/discover/culture.jpeg')"
      />
      <DiscoverCard
        text="TBD"
        :bgImage="require('@/assets/images/discover/404.jpeg')"
      />
      <DiscoverCard
        text="TBD"
        :bgImage="require('@/assets/images/discover/404.jpeg')"
      />
      <DiscoverCard
        text="TBD"
        :bgImage="require('@/assets/images/discover/404.jpeg')"
      />
      <DiscoverCard
        text="TBD"
        :bgImage="require('@/assets/images/discover/404.jpeg')"
      />
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
