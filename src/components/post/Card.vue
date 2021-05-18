<template>
  <article class="border rounded-lg my-2 card p-5">
    <!-- Post Preview Link -->
    <div class="mb-2 flex justify-between items-center">
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
          <ShareIcon class="mr-2" />
        </span>
        <button class="hover:text-primary focus:outline-none" @click="toggleMoreMenu">
          <MoreIcon />
        </button>
      </div>
    </div>

    <div class="hover:text-primary">
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
  /* padding: 20px; */
}
</style>
