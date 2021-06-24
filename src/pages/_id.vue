<template>
  <main class="p-4">
    <!-- Name, socials, follow, bio -->
    <section class="flex flex-row justify-between">
      <article class="flex items-center">
        <img
          v-if="this.currentUser.avatar !== null"
          :src="this.avatar"
          class="w-16 h-16 rounded-lg mr-4 object-cover"
        />
        <div class="flex flex-col">
          <!-- Name Username, Follow button -->
          <div class="flex flex-row items-center">
            <h3 class="text-2xl pr-4">
              {{ this.currentUser.username }}
            </h3>
            <h5 class="text-xl text-gray-700">
              @{{ this.currentUser.id }}
            </h5>
          </div>
          <div class="flex flex-row">
            <!-- Categories, following, followers -->
            <nuxt-link
              :to="'/' + this.currentUser.id + '/categories'"
            >
              <!-- {{ this.currentUser.categories.length }} -->0
              <span class="text-gray5">
                categories
              </span>
            </nuxt-link>
            <nuxt-link
              :to="'/' + this.currentUser.id + '/followers'"
              class="pl-4"
            >
              {{ this.currentUser.followers.length }}
              <span class="text-gray5">
                Followers
              </span>
            </nuxt-link>
            <nuxt-link
              :to="'/' + this.currentUser.id + '/following'"
              class="pl-4"
            >
              {{ this.currentUser.following.length }}
              <span class="text-gray5">
                Following
              </span>
            </nuxt-link>
          </div>
        </div>
      </article>
      <div class="flex items-center">
      </div>
      <FriendButton :authorID="currentUser.id" />
    </section>

    <section>
      <p class="text-sm italic py-2">
        {{ this.currentUser.bio }}
      </p>
      <span
        v-for="s in this.currentUser.socials"
        :key="s.platform"
        class="p-2"
      >
        <!-- Twitter -->
        <button
          v-if="s.platform === 'twitter'"
          class="focus:outline-none text-primary"
          @click="openWindow('https://twitter.com/' + s.username)"
        >
          <TwitterIcon />
        </button>
        <!-- GitHub -->
        <button
          v-if="s.platform === 'github'"
          class="focus:outline-none text-primary"
          @click="openWindow('https://github.com/' + s.username)"
        >
          <GitHubIcon />
        </button>
        <button
          v-if="s.platform === 'website'"
          class="focus:outline-none text-primary"
          @click="openWindow(s.username)"
        >
          <ExternalURLIcon />
        </button>
      </span>
    </section>

    <section class="flex flex-col md:flex-row w-full justify-between border-b">
      <nuxt-link
        :to="'/' + this.currentUser.id"
        class="text-gray5 font-bold px-2 pb-1"
        :class="this.$route.name === 'id' ? 'border-primary border-b-2' : ''"
      >
        Posts
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/comments'"
        class="text-gray5 font-bold px-2 pb-1"
        :class="this.$route.name === 'id-comments' ? 'border-primary border-b-2' : ''"
      >
        Comments
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/bookmarks'"
        class="text-gray5 font-bold px-2 pb-1"
        :class="this.$route.name === 'id-bookmarks' ? 'border-primary border-b-2' : ''"
      >
        Bookmarks
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/reposts'"
        class="text-gray5 font-bold px-2 pb-1"
        :class="this.$route.name === 'id-reposts' ? 'border-primary border-b-2' : ''"
      >
        Reposts
      </nuxt-link>
    </section>
    <section>
      <nuxt-child />
    </section>
  </main>
</template>

<script>
import TwitterIcon from '@/components/icons/brands/Twitter'
import GitHubIcon from '@/components/icons/brands/GitHub'
import FriendButton from '@/components/FriendButton'
import ExternalURLIcon from '@/components/icons/ExternalURL'

export default {
  components: {
    TwitterIcon,
    GitHubIcon,
    FriendButton,
    ExternalURLIcon,
  },
  // layout: 'Extended',
  data () {
    return {
      avatar: null,
      currentUser: null,
      posts: [],
    }
  },
  created () {
    // The user in which I am currently viewing
    // Check if this is my profile
    if (this.$route.params.id === this.$store.state.me.id) {
      this.currentUser = this.$store.state.me
    }
    // Get user profile
    // this.currentUser = this.$api.profile.getProfile(this.$route.params.id)
    const l = this.$store.state.authors
    for (let p = 0; p < l.length; p++) {
      if (l[p].id === this.$route.params.id) {
        this.currentUser = l[p]
      }
    }
    // Get avatar
    if (this.currentUser.avatar !== null) {
      this.$api.settings.downloadAvatar(this.currentUser.avatar).then((image) => {
        this.avatar = image
      })
    }
    this.userPosts()
  },
  methods: {
    openWindow (url) {
      if (process.client) {
        window.open(url, '_blank')
      }
    },
    async userPosts () {
      const p = this.currentUser.posts
      for (let i = 0; i < p.length; i++) {
        const post = await this.$api.post.getPost(p[i])
        post.id = p[i]
        this.posts.push(post)
      }
    },
  },
}
</script>
