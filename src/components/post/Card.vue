<template>
  <article class="border rounded-lg my-2 card">
    <!-- Post Preview Link -->
    <div class="mb-2 flex justify-between items-center pt-4 px-8">
      <nuxt-link :to="'/' + this.authorID">
        <div class="flex items-center">
          <h4 class="text-bold text-lg">
            {{ getFullName(this.authorID) }}
          </h4>
          <h5 class="text-base hover:text-primary mx-2 text-gray-700">
            @{{ this.authorUsername }}
          </h5>
        </div>
        <h6 class="text-sm text-gray-600">
          {{ this.$helpers.formatDate(this.post.timestamp) }}
        </h6>
      </nuxt-link>
      <div class="flex">
        <span v-if="this.showMoreMenu">
          <button class="flex focus:outline-none" @click="handleShare()">
            <ShareIcon class="mr-2" />
          </button>
        </span>
        <button class="hover:text-primary" @click="toggleMoreMenu">
          <MoreIcon />
        </button>
      </div>
    </div>

    <div class="pb-2 px-8 hover:text-primary">
      <nuxt-link :to="'/' + this.authorID + '/' + this.post.id">
        <h3 class="text-lg font-bold">
          {{ this.post.title }}
        </h3>
        <h4 class="text-sm italic">
          {{ this.post.subtitle }}
        </h4>
      </nuxt-link>
    </div>

    <div>
      <PostActions :post="this.post" :authorID="this.authorID" />
    </div>
  </article>
</template>

<script>
import PostActions from '@/components/post/Actions'
import MoreIcon from '@/components/icons/More'
import ShareIcon from '@/components/icons/Share'

export default {
  components: {
    PostActions,
    MoreIcon,
    ShareIcon,
  },
  props: {
    post: {
      type: Object,
      default: null,
    },
    authorID: {
      type: String,
      default: null,
    },
    authorUsername: {
      type: String,
      default: null,
    },
  },
  data () {
    return {
      showMoreMenu: false,
    }
  },
  methods: {
    toggleMoreMenu () {
      this.showMoreMenu = !this.showMoreMenu
    },
    handleShare () {
      const url = document.getElementById(this.$props.post.id)
      url.type = 'text'
      url.value =
        document.location.origin + '/' + this.authorID + '/' + this.post.id
      url.select()
      url.setSelectionRange(0, 99999)
      document.execCommand('copy')
      url.type = 'hidden'
      alert('URL Copied to Clipboard!')
    },
    getFullName (id) {
      if (this.$store.state.user.id === id) {
        return this.$store.state.user.username
      }
      const list = this.$store.state.userList
      const name = list.find(x => x.id === id)
      if (name) {
        return name.username
      } else {
        return id
      }
    },
  },
}
</script>

<style>
.card {
  /* background-color: rgba(50, 50, 50, 0.1); */
}
</style>
