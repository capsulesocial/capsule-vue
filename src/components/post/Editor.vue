<template>
  <section class="w-full h-screen bg-white">
    <!-- Header and close button -->
    <article class="flex items-center px-5 pt-5">
      <h3 class="text-center font-bold text-xl flex-grow pl-4 text-primary">
        Create Post
      </h3>
      <button @click="updateStore()" class="focus:outline-none flex-grow-0">
        <CloseIcon />
      </button>
    </article>

    <!-- Mobile Editor -->
    <article class="m-5 lg:hidden pb-32">
      <div class="w-full">
        <!-- Title declaration -->
        <div
          class="flex flex-col items-center"
          v-if="this.mobileState === 'edit'"
        >
          <label for="title" class="text-gray-800 italic">Title</label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter Title"
            class="border-b text-center text-4xl focus:outline-none text-xl w-full placeholder-gray-800 pb-2"
          />
          <label for="subtitle" class="text-gray-800 italic">Subtitle:</label>
          <input
            v-model="subtitle"
            type="text"
            placeholder="Enter Subtitle"
            class="border-b text-center text-2xl focus:outline-none text-xl w-full placeholder-gray-800 pb-2"
          />
          <p class="text-sm text-gray-500 py-4">
            By: {{ this.$store.state.user.username }}
          </p>
        </div>
      </div>
      <div
        class="w-full flex justify-around text-primary px-2"
        v-if="this.mobileState === 'edit'"
      >
        <button @click="testButton('**', true)"><BoldIcon /></button>
        <button @click="testButton('*', true)"><ItalicIcon /></button>
        <button @click="testButton('\n* ')"><ListIcon /></button>
        <button @click="testButton('\n1. ')">1.</button>
        <button @click="testButton('\n# ')">H1</button>
        <button @click="testButton('\n## ')">H2</button>
        <button @click="testButton('\n### ')">H3</button>
        <button @click="testButton('\n> ')">
          <QuoteIcon />
        </button>
        <button @click="testButton('\n```\n', true)"><CodeIcon /></button>
        <button @click="testButton('[title](https://www.example.com)')">
          <LinkIcon />
        </button>
        <button @click="testButton('![alt text](https://picsum.photos/200)')">
          <ImageIcon />
        </button>
      </div>

      <textarea
        ref="ta"
        v-if="this.mobileState === 'edit'"
        :value="input"
        @input="update"
        class="w-full border p-1 h-64"
      ></textarea>
      <div v-else>
        <h2 class="text-4xl text-center">{{ this.title }}</h2>
        <h4 class="text-2xl text-center">{{ this.subtitle }}</h4>
        <h6 class="text-sm text-gray-500 py-4 text-center">
          By: {{ this.$store.state.user.username }}
        </h6>
        <div v-html="compiledMarkdown" class="prose"></div>
      </div>
    </article>

    <!-- Desktop Editor -->
    <article class="mt-5 hidden lg:grid grid-cols-2">
      <div class="px-5">
        <div class="w-full flex justify-around text-primary px-2">
          <button @click="testButton('**', true)"><BoldIcon /></button>
          <button @click="testButton('*', true)"><ItalicIcon /></button>
          <button @click="testButton('\n* ')"><ListIcon /></button>
          <button @click="testButton('\n1. ')">1.</button>
          <button @click="testButton('\n# ')">H1</button>
          <button @click="testButton('\n## ')">H2</button>
          <button @click="testButton('\n### ')">H3</button>
          <button @click="testButton('\n> ')">
            <QuoteIcon />
          </button>
          <button @click="testButton('\n```\n', true)"><CodeIcon /></button>
          <button @click="testButton('[title](https://www.example.com)')">
            <LinkIcon />
          </button>
          <button @click="testButton('![alt text](https://picsum.photos/200)')">
            <ImageIcon />
          </button>
        </div>
        <textarea
          ref="ta"
          :value="input"
          @input="update"
          class="w-full border p-1 h-64"
        ></textarea>
      </div>

      <div class="border rounded-lg p-5 text-black m-5 shadow-lg">
        <!-- Title declaration -->
        <div class="flex flex-col items-center">
          <label for="title" class="hidden">Title</label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter Title"
            class="text-4xl focus:outline-none text-xl w-full placeholder-gray-500 pb-2"
          />
          <label for="subtitle" class="hidden">Subtitle:</label>
          <input
            v-model="subtitle"
            type="text"
            placeholder="Enter Subtitle"
            class="text-2xl focus:outline-none text-xl w-full placeholder-gray-500 pb-2"
          />
        </div>
        <h6 class="text-sm text-gray-500 pb-4">
          By: {{ this.$store.state.user.username }}
        </h6>
        <div v-html="compiledMarkdown" class="prose pl-4"></div>
      </div>
      <span class="bottom-0 fixed m-5 p-5 right-0">
        <button
          @click="post()"
          class="bg-primary w-48 mt-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        >
          Publish
        </button>
      </span>
    </article>

    <!-- Mobile Toggle for Edit / Preview -->
    <article class="lg:hidden fixed bottom-0 w-full pb-20 bg-white">
      <div class="grid grid-cols-3 px-2">
        <button @click="toggleComposeState('edit')" class="focus:outline-none">
          <span
            v-if="mobileState === 'edit'"
            class="font-bold text-primary text-xl"
            >Edit</span
          >
          <span v-else class="text-xl">Edit</span>
        </button>
        <button
          @click="toggleComposeState('preview')"
          class="focus:outline-none"
        >
          <span
            v-if="mobileState === 'preview'"
            class="font-bold text-primary text-xl"
            >Preview</span
          >
          <span v-else class="text-xl">Preview</span>
        </button>
        <button
          @click="post()"
          class="bg-primary w-24 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        >
          Publish
        </button>
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
      if (this.title === "") {
        alert("Missing title!");
        return;
      }
      let date = new Date().toLocaleString();
      this.sendPost({
        title: this.title,
        subtitle: this.subtitle,
        content: this.input,
        id: this.$store.state.posts.length.toString(),
        timestamp: date,
        comments: [],
        bookmarks: [],
        authorID: this.$store.state.user.id
      });
      this.toggle();
      this.title = "Title";
      this.subtitle = "Subtitle";
      this.input = "# Hello World";
      this.$router.push(this.$store.state.user.id);
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
