<template>
  <section class="w-full h-screen bg-white lg:rounded-lg lg:shadow-xl p-5">
    <article class="flex items-center p-5">
      <h3 class="text-center font-bold text-xl flex-grow pl-4">Create Post</h3>
      <button @click="toggle()" class="focus:outline-none flex-grow-0">
        <CloseIcon />
      </button>
    </article>
    <article class="border rounded-lg p-5 text-black">
      <div class="pb-2">
        <input
          v-model="title"
          type="text"
          placeholder="Enter Title"
          class="focus:outline-none text-xl w-full placeholder-gray-800"
        />
      </div>
      <div>
        <input
          v-model="subtitle"
          type="text"
          placeholder="Enter Subtitle"
          class="focus:outline-none text-lg w-full placeholder-gray-600"
        />
      </div>
    </article>
  </section>
</template>

<script>
import { mapMutations } from "vuex";

import CloseIcon from "@/components/icons/Close";

export default {
  data() {
    return {
      title: "",
      subtitle: ""
    };
  },
  components: {
    CloseIcon
  },
  methods: {
    ...mapMutations({
      toggle: "toggleCompose"
    })
  }
};
</script>
