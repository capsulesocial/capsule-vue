<template>
  <article class="shadow rounded-lg my-2 card p-5">
    <!-- Post Preview Link -->
    <div class="mb-2 flex justify-between items-center">
      <nuxt-link :to="'/' + this.authorID" class="flex">
        <div class="mr-2">
          <div class="p-1 border-2 rounded-full">
            <ProfileIcon class="w-6 h-6" />
          </div>
        </div>
        <div class="flex items-center flex-wrap mr-2">
          <h4 class="text-bold mr-2">
            {{ getFullName(this.authorID) }}
          </h4>
          <h5 class="hover:text-primary text-subtitle mr-2">
            @{{ this.authorID }}
          </h5>
        </div>
      </nuxt-link>
      <div class="flex">
        <button class="hover:text-primary focus:outline-none">
          <MoreIcon />
        </button>
      </div>
    </div>

    <div class="hover:text-primary">
      <nuxt-link :to="'/' + this.authorID + '/' + this.post.id">
        <h3 class="text-base font-bold">
          {{ this.post.title }}
        </h3>
        <h4 class="text-subtitle pt-2 text-sm">
          {{ this.post.subtitle }}
        </h4>
      </nuxt-link>
    </div>

    <div class="pt-2">
      <h6 class="text-xs text-subtitle">
        {{ this.$helpers.formatDate(this.post.timestamp) }}
      </h6>
    </div>
    <PostActions :post="this.post" :authorID="this.authorID" />
  </article>
</template>

<script>
import PostActions from '@/components/post/Actions'
import MoreIcon from '@/components/icons/More'
import ProfileIcon from '@/components/icons/Person'

export default {
  components: {
    PostActions,
    MoreIcon,
    ProfileIcon,
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
    return {}
  },
  methods: {
    getFullName (id) {
      if (this.$store.state.me.id === id) {
        return this.$store.state.me.username
      }
      const list = this.$store.state.authors
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
