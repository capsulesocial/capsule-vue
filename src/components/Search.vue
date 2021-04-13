<template>
  <article class="rounded-full bg-gray-100 m-4 flex flex-start">
    <button type="submit" class="px-4">
      <SearchIcon />
    </button>
    <input
      v-model="keyword"
      type="search"
      placeholder="Type your keywords..."
      class="rounded-full bg-gray-100 text-black focus:outline-none flex-grow mr-10"
    />
  </article>
</template>

<script>
import SearchIcon from "@/components/icons/Search";

export default {
  data() {
    return {
      keyword: ""
    };
  },
  components: {
    SearchIcon
  }
};
</script>
