<template>
  <section class="w-full h-screen bg-white">
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

    <div class="w-full lg:w-1/2 flex justify-around text-primary px-2">
      <button @click="testButton('\n* ')"><ListIcon /></button>
      <button @click="testButton('**', true)"><BoldIcon /></button>
      <button @click="testButton('*', true)"><ItalicIcon /></button>
      <button @click="testButton('\n```\n', true)"><CodeIcon /></button>
      <button @click="testButton('\n# ')">H1</button>
      <button @click="testButton('\n## ')">H2</button>
      <button @click="testButton('\n### ')">H3</button>
      <button @click="testButton('\n> ')">
        <QuoteIcon />
      </button>
      <button @click="testButton('\n1. ')">1.</button>
      <button @click="testButton('[title](https://www.example.com)')">
        <LinkIcon />
      </button>
      <button @click="testButton('![alt text](https://picsum.photos/200)')">
        <ImageIcon />
      </button>
    </div>

    <!-- Mobile Editor -->
    <article class="m-5 lg:hidden">
      <textarea
        ref="ta"
        v-if="this.mobileState === 'edit'"
        :value="input"
        @input="update"
        class="w-full border p-1 h-64"
      ></textarea>
      <div v-else v-html="compiledMarkdown" class="prose"></div>
    </article>

    <!-- Desktop Editor -->
    <article class="mt-5 hidden lg:grid grid-cols-2">
      <textarea
        ref="ta"
        :value="input"
        @input="update"
        class="w-full border p-1 h-64"
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

    <article class="lg:hidden fixed bottom-0 w-full pb-20">
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
import BoldIcon from "@/components/icons/md/Bold";
import CodeIcon from "@/components/icons/md/Code";
import ItalicIcon from "@/components/icons/md/Italic";
import ListIcon from "@/components/icons/md/List";
import LinkIcon from "@/components/icons/md/Link";
import ImageIcon from "@/components/icons/md/Image";
import QuoteIcon from "@/components/icons/md/Quote";

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
    CloseIcon,
    BoldIcon,
    CodeIcon,
    ItalicIcon,
    ListIcon,
    LinkIcon,
    ImageIcon,
    QuoteIcon
  },
  mounted() {},
  methods: {
    ...mapMutations({
      toggle: "toggleCompose",
      updateDraft: "updateDraft",
      sendPost: "sendPost"
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
      let date = new Date().toLocaleString();
      this.sendPost({
        title: this.title,
        subtitle: this.subtitle,
        content: this.input,
        id: this.$store.state.posts.length.toString(),
        timestamp: date,
        comments: [],
        likes: [],
        authorID: this.$store.state.user.id
      });
      this.toggle();
      this.title = "";
      this.subtitle = "";
      this.input = "# Hello World";
    },
    updateStore: function() {
      this.$store.commit("updateDraft", {
        title: this.title,
        subtitle: this.subtitle,
        content: this.input
      });
      this.toggle();
    },
    testButton: function(md, wrap) {
      let ta = this.$refs.ta,
        cursorStart = ta.selectionStart,
        cursorEnd = ta.selectionEnd,
        selectedText = this.input.substring(cursorStart, cursorEnd);
      if (wrap) {
        this.input =
          this.input.substring(0, cursorStart) +
          md +
          selectedText +
          md +
          this.input.substring(cursorEnd);
      } else {
        this.input =
          this.input.substring(0, cursorStart) +
          md +
          selectedText +
          this.input.substring(cursorEnd);
      }
    }
  }
};
</script>
