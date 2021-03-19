<template>
  <section class="flex justify-between p-4">
    <CapsuleIcon class="py-4" />

    <article class="rounded-full bg-gray-100 w-3/5 m-4 flex flex-start">
      <button type="submit" class="px-4">
        <SearchIcon />
      </button>
      <input
        type="search"
        placeholder="Type your keywords..."
        class="bg-gray-100 text-black focus:outline-none flex-grow mr-10"
      />
    </article>

    <nuxt-link to="/profile">
      Profile
    </nuxt-link>
  </section>
</template>

<script>
import CapsuleIcon from "@/components/icons/Capsule";
import SearchIcon from "@/components/icons/Search";
export default {
  setup() {},
  components: {
    CapsuleIcon,
    SearchIcon
  }
};
</script>
