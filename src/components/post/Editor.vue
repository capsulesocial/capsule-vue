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
    <article class="m-5 lg:hidden pb-48">
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
          <!-- Upload Featured Image -->
          <button class="pb-2" @click="$refs.featuredPhoto.click()">
            <input
              id="featured-photo"
              ref="featuredPhoto"
              class="hidden"
              name="photo"
              type="file"
              accept="image/*"
              @change="handleImage"
            >
            <img
              v-if="this.featuredPhoto !== null"
              :src="this.featuredPhoto"
            />
            <div
              v-else
              class="flex justify-center items-center text-gray5"
            >
              <CameraIcon class="mr-2" />
              Featured Photo
            </div>
          </button>
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
        <!-- Upload Featured Image -->
        <button @click="$refs.featuredPhoto.click()">
          <input
            id="featured-photo"
            ref="featuredPhoto"
            class="hidden"
            name="photo"
            type="file"
            accept="image/*"
            @change="handleImage"
          >
          <img
            v-if="this.featuredPhoto !== null"
            :src="this.featuredPhoto"
          />
          <div
            v-else
            class="flex justify-center items-center text-gray5"
          >
            <CameraIcon class="mr-2" />
            Featured Photo
          </div>
        </button>
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

<script lang="ts">
import Vue from 'vue'
import { mapMutations, mapActions } from 'vuex'
import { actionType, namespace as settingStoreNamespace, SettingState } from '~/store/settings'
import { MutationType, namespace as sessionStoreNamespace, SessionState } from '~/store/session'
// import { postsMutationType, namespace as postsStoreNamespace, Posts} from '~/store/posts'

import _ from 'lodash'
import DOMPurify from 'dompurify'
import marked from 'marked'
import CloseIcon from '@/components/icons/Close.vue'
import CameraIcon from '@/components/icons/Camera.vue'
import BoldIcon from '@/components/icons/md/Bold.vue'
import CodeIcon from '@/components/icons/md/Code.vue'
import ItalicIcon from '@/components/icons/md/Italic.vue'
import ListIcon from '@/components/icons/md/List.vue'
import LinkIcon from '@/components/icons/md/Link.vue'
import ImageIcon from '@/components/icons/md/Image.vue'
import QuoteIcon from '@/components/icons/md/Quote.vue'
import BrandedButton from '@/components/BrandedButton.vue'
import markdown from '@/mixins/markdown.js'
import { Post } from '@/interfaces/Post'

export default Vue.extend({
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
    CameraIcon,
  },
  mixins: [markdown],
  data () {
    let input: string
    if (this.$store.state.draft.content !== '') {
      input = this.$store.state.draft.content
    } else {
      input = ''
    }
    let tags: string[] = []
    return {
      title: this.$store.state.draft.title,
      subtitle: this.$store.state.draft.subtitle,
      input,
      mobileState: 'edit',
      tags,
      tag: '',
      featuredPhoto: null,
      featuredPhotoCID: '',
    }
  },
  computed: {
    compiledMarkdown (): string {
      const md = marked(this.input)
      return md
    },
  },
  methods: {
    ...mapActions(settingStoreNamespace, {
      toggleDraftMode: actionType.TOGGLE_DRAFT_MODE
    }),
    ...mapMutations({
      toggle: 'draft/toggleCompose',
      updateDraft: 'draft/updateDraft',
    }),
    ...mapMutations(sessionStoreNamespace, {
      addPost: MutationType.ADD_POST,
      changeCID: MutationType.CHANGE_CID,
    }),
    // ...mapMutations(postsStoreNamespace, {
    //   addTag: postsMutationType.ADD_TAG,
    // }),
    toggleComposeState (state): void {
      this.mobileState = state
    },
    update: _.debounce(function (this: any, e): void {
      const clean: string = DOMPurify.sanitize(e.target.value, {
        USE_PROFILES: { html: true, svg: true },
      })
      this.input = clean
    }, 300),
    addTag (tag): void {
      if (this.tag === '' || !this.$qualityText(this.tag)) {
        alert('Invalid tag!')
      } else {
        this.tags.push(this.tag)
        this.tag = ''
      }
    },
    removeTag (tag): void {
      // Remove
      const index = this.tags.indexOf(tag)
      if (index > -1) {
        this.tags.splice(index, 1)
      }
    },
    handleImage (e): void {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = (i) => {
        if (i.target !== null) {
          this.uploadImage(i.target.result)
        }
      }
    },
    uploadImage (image): void {
      this.$sendPhoto(image).then((cid) => {
        this.featuredPhotoCID = cid
        this.downloadImage(cid)
      })
    },
    downloadImage (cid): void {
      this.$getPhoto(cid).then((image) => {
        this.featuredPhoto = image
      })
    },
    post (): void {
      if (this.title === '' || !this.$qualityText(this.title)) {
        alert('Invalid title!')
      } else if (this.subtitle === '' || !this.$qualityText(this.subtitle)) {
        alert('Invalid subtitle!')
      } else {
        const date = new Date()
        const p = {
          title: this.title,
          subtitle: this.subtitle,
          content: this.input,
          cid: '',
          timestamp: date,
          tags: this.tags,
          comments: [],
          bookmarks: [],
          authorID: this.$store.state.session.id,
          authorCID: this.$store.state.session.cid,
          featuredPhotoCID: this.featuredPhotoCID,
        }
        this.$sendPost(p).then((cid) => {
          console.log('Post CID: ', cid)
          p.cid = cid
          // this.$store.commit('posts/sendPost', p.id)
          this.$store.commit('posts/sendPost', p.cid)
          this.$store.commit('tags/sendPost', p)
          // this.$store.commit('posts/addTag', p.tags)
          this.addTag(p.tags)
          this.addPost(cid)
          let profile = this.$store.state.session
          this.$sendProfile(profile).then((pcid) => {
            this.changeCID(pcid)
          })
        })
        this.toggleDraftMode()
        this.title = 'Title'
        this.subtitle = 'Subtitle'
        this.input = '# Hello World'
        this.tags = []
        this.$router.push(this.$store.state.session.cid)
      }
    },
    updateStore (): void {
      this.$store.commit('draft/updateDraft', {
        title: this.title,
        subtitle: this.subtitle,
        content: this.input,
        tags: this.tags,
      })
      this.toggleDraftMode()
    },
    addMarkdown (md, wrap): void {
      if (this.$refs.ta !== undefined) {
        const ta = this.$refs.ta as HTMLInputElement
        const cursorStart: number | null = ta.selectionStart
        const cursorEnd: number | null = ta.selectionEnd
        if (cursorStart !== null && cursorEnd !== null) {
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
        }
      }
    },
  },
})
</script>
