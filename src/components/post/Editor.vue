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
        <div class="flex flex-col" v-if="this.mobileState === 'edit'">
          <label for="title" class="text-gray-800 italic">Title:</label>
          <input
            v-model="title"
            type="text"
            placeholder="Enter Title"
            class="border-b text-4xl focus:outline-none text-xl w-full placeholder-gray-800 pb-2"
          />
          <label for="subtitle" class="text-gray-800 italic">Subtitle:</label>
          <input
            v-model="subtitle"
            type="text"
            placeholder="Enter Subtitle"
            class="border-b text-2xl focus:outline-none text-xl w-full placeholder-gray-800 pb-2"
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
        <button @click="addMarkdown('**', true)"><BoldIcon /></button>
        <button @click="addMarkdown('*', true)"><ItalicIcon /></button>
        <button @click="addMarkdown('\n* ')"><ListIcon /></button>
        <button @click="addMarkdown('\n1. ')">1.</button>
        <button @click="addMarkdown('\n# ')">H1</button>
        <button @click="addMarkdown('\n## ')">H2</button>
        <button @click="addMarkdown('\n### ')">H3</button>
        <button @click="addMarkdown('\n> ')">
          <QuoteIcon />
        </button>
        <button @click="addMarkdown('\n```\n', true)"><CodeIcon /></button>
        <button @click="addMarkdown('[title](https://www.example.com)')">
          <LinkIcon />
        </button>
        <button @click="addMarkdown('![alt text](https://picsum.photos/200)')">
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
        <h2 class="text-4xl">{{ this.title }}</h2>
        <h4 class="text-2xl">{{ this.subtitle }}</h4>
        <h6 class="text-sm text-gray-500 py-4">
          By: {{ this.$store.state.user.username }}
        </h6>
        <div v-html="compiledMarkdown" class="prose"></div>
      </div>
    </article>

    <!-- Desktop Editor -->
    <article class="mt-5 hidden lg:grid grid-cols-2">
      <div class="px-5">
        <div class="w-full flex justify-around text-primary px-2">
          <button @click="addMarkdown('**', true)"><BoldIcon /></button>
          <button @click="addMarkdown('*', true)"><ItalicIcon /></button>
          <button @click="addMarkdown('\n* ')"><ListIcon /></button>
          <button @click="addMarkdown('\n1. ')">1.</button>
          <button @click="addMarkdown('\n# ')">H1</button>
          <button @click="addMarkdown('\n## ')">H2</button>
          <button @click="addMarkdown('\n### ')">H3</button>
          <button @click="addMarkdown('\n> ')">
            <QuoteIcon />
          </button>
          <button @click="addMarkdown('\n```\n', true)"><CodeIcon /></button>
          <button @click="addMarkdown('[title](https://www.example.com)')">
            <LinkIcon />
          </button>
          <button
            @click="addMarkdown('![alt text](https://picsum.photos/200)')"
          >
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
      <footer
        class="bottom-0 fixed m-5 p-5 w-full flex flex-row justify-between font-sans"
      >
        <div class="flex items-center border rounded-full border-primary">
          <span class=" rounded-full pl-4 bg-white shadow-lg text-primary">
            <label for="tag" class="hidden" value="Enter hashtags"></label
            >#<input
              v-model="tag"
              type="text"
              placeholder="tag"
              class="focus:outline-none w-32 pr-1 py-2"
            />
            <button
              @click="addTag"
              class="border border-white rounded-full px-4 py-2 bg-primary focus:outline-none"
            >
              <span class="text-white">+</span>
            </button>
          </span>
          <span v-for="t in this.tags" :key="t" class="mx-2">
            <h6 class="inline text-primary">#{{ t }}</h6>
            <button @click="removeTag(t)" class="text-red-600">x</button></span
          >
        </div>
        <BrandedButton text="Publish" :action="post" class="mr-10" />
      </footer>
    </article>

    <!-- Mobile Toggle for Edit / Preview -->
    <article class="lg:hidden fixed bottom-0 w-full pb-20 bg-white">
      <div class="px-5 py-2">
        <label for="tag" class="hidden" value="Enter hashtags"></label>#<input
          v-model="tag"
          type="text"
          placeholder="tag"
          class="focus:outline-none w-24 pr-1 py-2 border-b border-primary"
        />
        <button
          @click="addTag"
          class="focus:outline-none bg-primary rounded-full text-white px-2"
        >
          <span class="">+</span>
        </button>
        <span v-for="t in this.tags" :key="t" class="mx-2">
          <h6 class="inline text-primary">#{{ t }}</h6>
          <button @click="removeTag(t)" class="text-red-600">x</button></span
        >
      </div>

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
        <BrandedButton text="Publish" :action="post" />
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
import BrandedButton from "@/components/BrandedButton";
import markdown from "@/mixins/markdown.js";

export default {
  data() {
    return {
      title: this.$store.state.draft.title,
      subtitle: this.$store.state.draft.subtitle,
      input: this.$store.state.draft.content,
      mobileState: "edit",
      tags: [],
      tag: ""
    };
  },
  computed: {
    draft() {
      return this.$store.state.draft;
    },
    compiledMarkdown: function() {
      return this.compileMarkdown(this.input);
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
    QuoteIcon,
    BrandedButton
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
    addTag: function(tag) {
      if (this.tag !== "") {
        this.tags.push(this.tag);
        this.tag = "";
      }
    },
    removeTag: function(tag) {
      // Remove
      const index = this.tags.indexOf(tag);
      if (index > -1) {
        this.tags.splice(index, 1);
      }
    },
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
        tags: this.tags,
        comments: [],
        bookmarks: [],
        authorID: this.$store.state.user.id
      });
      this.toggle();
      this.title = "Title";
      this.subtitle = "Subtitle";
      this.input = "# Hello World";
      this.tags = [];
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
    addMarkdown: function(md, wrap) {
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
  },
  mixins: [markdown]
};
</script>
