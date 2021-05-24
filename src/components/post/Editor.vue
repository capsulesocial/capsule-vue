<template>
  <section class="w-full h-auto bg-white">
    <!-- Header and close button -->
    <article class="flex items-center px-5 pt-5">
      <h3 class="text-center font-bold text-xl flex-grow pl-4 text-primary">
        Create Post
      </h3>
      <button class="focus:outline-none flex-grow-0" @click="updateStore()">
        <CloseIcon />
      </button>
    </article>

    <!-- Mobile Editor -->
    <article class="m-5 lg:hidden pb-32">
      <div class="w-full">
        <!-- Title declaration -->
        <div v-if="this.mobileState === 'edit'" class="flex flex-col">
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
            By: {{ this.$store.state.me.username }}
          </p>
        </div>
      </div>
      <div
        v-if="this.mobileState === 'edit'"
        class="w-full flex justify-around text-primary px-2"
      >
        <button @click="addMarkdown('**', true)">
          <BoldIcon />
        </button>
        <button @click="addMarkdown('*', true)">
          <ItalicIcon />
        </button>
        <button @click="addMarkdown('\n* ')">
          <ListIcon />
        </button>
        <button @click="addMarkdown('\n1. ')">
          1.
        </button>
        <button @click="addMarkdown('\n# ')">
          H1
        </button>
        <button @click="addMarkdown('\n## ')">
          H2
        </button>
        <button @click="addMarkdown('\n### ')">
          H3
        </button>
        <button @click="addMarkdown('\n> ')">
          <QuoteIcon />
        </button>
        <button @click="addMarkdown('\n```\n', true)">
          <CodeIcon />
        </button>
        <button @click="addMarkdown('[title](https://www.example.com)')">
          <LinkIcon />
        </button>
        <button @click="addMarkdown('![alt text](https://picsum.photos/200)')">
          <ImageIcon />
        </button>
      </div>

      <textarea
        v-if="this.mobileState === 'edit'"
        ref="ta"
        :value="input"
        class="w-full border p-1 h-64"
        @input="update"
      ></textarea>
      <div v-else>
        <h2 class="text-4xl">
          {{ this.title }}
        </h2>
        <h4 class="text-2xl">
          {{ this.subtitle }}
        </h4>
        <h6 class="text-sm text-gray-500 py-4">
          By: {{ this.$store.state.me.username }}
        </h6>
        <div class="prose" v-html="compiledMarkdown"></div>
      </div>
    </article>

    <!-- Desktop Editor -->
    <article class="mt-5 hidden lg:grid grid-cols-2">
      <div class="px-5">
        <div class="w-full flex justify-around text-primary px-2">
          <button @click="addMarkdown('**', true)">
            <BoldIcon />
          </button>
          <button @click="addMarkdown('*', true)">
            <ItalicIcon />
          </button>
          <button @click="addMarkdown('\n* ')">
            <ListIcon />
          </button>
          <button @click="addMarkdown('\n1. ')">
            1.
          </button>
          <button @click="addMarkdown('\n# ')">
            H1
          </button>
          <button @click="addMarkdown('\n## ')">
            H2
          </button>
          <button @click="addMarkdown('\n### ')">
            H3
          </button>
          <button @click="addMarkdown('\n> ')">
            <QuoteIcon />
          </button>
          <button @click="addMarkdown('\n```\n', true)">
            <CodeIcon />
          </button>
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
          class="w-full border p-1 h-64"
          @input="update"
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
          By: {{ this.$store.state.me.username }}
        </h6>
        <div class="prose pl-4" v-html="compiledMarkdown"></div>
      </div>
      <footer
        class="bottom-0 fixed m-5 p-5 w-full flex flex-row justify-between font-sans"
      >
        <div class="flex items-center border rounded-full border-primary">
          <span class=" rounded-full pl-4 bg-white shadow-lg text-primary">
            <label for="tag" class="hidden" value="Enter hashtags"></label>
            #<input
              v-model="tag"
              type="text"
              placeholder="tag"
              class="focus:outline-none w-32 pr-1 py-2"
            />
            <button
              class="border border-white rounded-full px-4 py-2 bg-primary focus:outline-none"
              @click="addTag"
            >
              <span class="text-white">+</span>
            </button>
          </span>
          <span v-for="t in this.tags" :key="t" class="mx-2">
            <h6 class="inline text-primary">#{{ t }}</h6>
            <button @click="removeTag(t)">❌</button></span>
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
          class="focus:outline-none bg-primary rounded-full text-white px-2"
          @click="addTag"
        >
          <span class="">+</span>
        </button>
        <span v-for="t in this.tags" :key="t" class="mx-2">
          <h6 class="inline text-primary">#{{ t }}</h6>
          <button @click="removeTag(t)">❌</button></span>
      </div>

      <div class="grid grid-cols-3 px-2">
        <button class="focus:outline-none" @click="toggleComposeState('edit')">
          <span
            v-if="mobileState === 'edit'"
            class="font-bold text-primary text-xl"
          >Edit</span>
          <span v-else class="text-xl">Edit</span>
        </button>
        <button
          class="focus:outline-none"
          @click="toggleComposeState('preview')"
        >
          <span
            v-if="mobileState === 'preview'"
            class="font-bold text-primary text-xl"
          >Preview</span>
          <span v-else class="text-xl">Preview</span>
        </button>
        <BrandedButton text="Publish" :action="post" />
      </div>
    </article>
  </section>
</template>

<script>
import { mapMutations } from 'vuex'
import _ from 'lodash'
import DOMPurify from 'dompurify'
import CloseIcon from '@/components/icons/Close'
import BoldIcon from '@/components/icons/md/Bold'
import CodeIcon from '@/components/icons/md/Code'
import ItalicIcon from '@/components/icons/md/Italic'
import ListIcon from '@/components/icons/md/List'
import LinkIcon from '@/components/icons/md/Link'
import ImageIcon from '@/components/icons/md/Image'
import QuoteIcon from '@/components/icons/md/Quote'
import BrandedButton from '@/components/BrandedButton'
import markdown from '@/mixins/markdown.js'

export default {
  components: {
    CloseIcon,
    BoldIcon,
    CodeIcon,
    ItalicIcon,
    ListIcon,
    LinkIcon,
    ImageIcon,
    QuoteIcon,
    BrandedButton,
  },
  mixins: [markdown],
  data () {
    return {
      title: this.$store.state.draft.title,
      subtitle: this.$store.state.draft.subtitle,
      input: this.$store.state.draft.content,
      mobileState: 'edit',
      tags: [],
      tag: '',
    }
  },
  computed: {
    compiledMarkdown () {
      return this.compileMarkdown(this.input)
    },
  },
  methods: {
    ...mapMutations({
      toggle: 'draft/toggleCompose',
      updateDraft: 'draft/updateDraft',
    }),
    toggleComposeState (state) {
      this.mobileState = state
    },
    update: _.debounce(function (e) {
      const clean = DOMPurify.sanitize(e.target.value, {
        USE_PROFILES: { html: true, svg: true },
      })
      // eslint-disable-next-line no-invalid-this
      this.input = clean
    }, 300),
    addTag (tag) {
      if (this.tag !== '') {
        this.tags.push(this.tag)
        this.tag = ''
      }
    },
    removeTag (tag) {
      // Remove
      const index = this.tags.indexOf(tag)
      if (index > -1) {
        this.tags.splice(index, 1)
      }
    },
    post () {
      if (this.title === '') {
        alert('Missing title!')
        return
      }
      const date = new Date()
      const p = {
        title: this.title,
        subtitle: this.subtitle,
        content: this.input,
        id: null,
        timestamp: date,
        tags: this.tags,
        comments: [],
        bookmarks: [],
        authorID: this.$store.state.me.id,
        views: 0,
        shares: 0,
      }
      this.$api.post.sendPost(p).then((cid) => {
        p.id = cid
        this.$store.commit('posts/sendPost', p)
        this.$store.commit('tags/sendPost', p)
        this.$store.commit('me/sendPost', p.id)
      })
      this.toggle()
      this.title = 'Title'
      this.subtitle = 'Subtitle'
      this.input = '# Hello World'
      this.tags = []
      this.$router.push(this.$store.state.me.id)
    },
    updateStore () {
      this.$store.commit('draft/updateDraft', {
        title: this.title,
        subtitle: this.subtitle,
        content: this.input,
        tags: this.tags,
      })
      this.toggle()
    },
    addMarkdown (md, wrap) {
      const ta = this.$refs.ta
      const cursorStart = ta.selectionStart
      const cursorEnd = ta.selectionEnd
      const selectedText = this.input.substring(cursorStart, cursorEnd)
      if (wrap) {
        this.input =
          this.input.substring(0, cursorStart) +
          md +
          selectedText +
          md +
          this.input.substring(cursorEnd)
      } else {
        this.input =
          this.input.substring(0, cursorStart) +
          md +
          selectedText +
          this.input.substring(cursorEnd)
      }
    },
  },
}
</script>
