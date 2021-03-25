<template>
  <section class="w-full h-screen bg-white lg:rounded-lg lg:shadow-xl">
    <!-- Header and close button -->
    <article class="flex items-center px-5 pt-5">
      <h3 class="text-center font-bold text-xl flex-grow pl-4">Create Post</h3>
      <button @click="updateStore()" class="focus:outline-none flex-grow-0">
        <CloseIcon />
      </button>
    </article>

    <!-- Title declaration -->
    <article class="border rounded-lg p-5 text-black m-5 shadow-lg">
      <input
        v-model="title"
        type="text"
        placeholder="Enter Title"
        class="focus:outline-none text-xl w-full placeholder-gray-800 pb-2"
      />

      <input
        v-model="subtitle"
        type="text"
        placeholder="Enter Subtitle"
        class="focus:outline-none text-lg w-full placeholder-gray-600 pb-2"
      />
      <p class="text-sm text-gray-500">By Username</p>
    </article>

    <!-- Mobile Editor -->
    <article class="m-5 lg:hidden">
      <textarea
        v-if="this.mobileState === 'edit'"
        :value="input"
        @input="update"
        class="w-full border p-1"
      ></textarea>
      <div v-else v-html="compiledMarkdown" class="prose"></div>
    </article>

    <!-- Desktop Editor -->
    <article class="mt-5 hidden lg:grid grid-cols-2">
      <textarea
        :value="input"
        @input="update"
        class="w-full border p-1"
      ></textarea>
      <div v-html="compiledMarkdown" class="prose text-black pl-4"></div>
      <span class="bottom-0 fixed m-5 p-5 right-0">
        <button
          @click="post()"
          class="bg-primary w-48 mt-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        >
          Publish
        </button>
      </span>
    </article>

    <article class="lg:hidden fixed bottom-0 w-full">
      <div class="grid grid-cols-3">
        <button @click="toggleComposeState('edit')">Edit</button>
        <button @click="toggleComposeState('preview')">Preview</button>
        <button @click="post()">Publish</button>
      </div>
    </article>
  </section>
</template>

<script>
import { mapMutations } from "vuex";
import _ from "lodash";
import DOMPurify from "dompurify";
import CloseIcon from "@/components/icons/Close";

export default {
  data() {
    return {
      title: this.$store.state.draft.title,
      subtitle: this.$store.state.draft.subtitle,
      input: this.$store.state.draft.content,
      mobileState: "edit"
    };
  },
  computed: {
    draft() {
      return this.$store.state.draft;
    },
    compiledMarkdown: function() {
      return marked(this.input);
    }
  },
  components: {
    CloseIcon
  },
  methods: {
    ...mapMutations({
      toggle: "toggleCompose",
      updateDraft: "updateDraft"
    }),
    toggleComposeState: function(state) {
      this.mobileState = state;
    },
    update: _.debounce(function(e) {
      let clean = DOMPurify.sanitize(e.target.value, {
        USE_PROFILES: { html: true, svg: true }
      });
      this.input = clean;
    }, 300),
    post: function() {
      console.log("title: " + this.title);
      console.log("subtitle: " + this.subtitle);
      console.log("content: " + this.input);
    },
    updateStore: function() {
      this.$store.commit("updateDraft", {
        title: this.title,
        subtitle: this.subtitle,
        content: this.input
      });
      this.toggle();
    }
  }
};
</script>
