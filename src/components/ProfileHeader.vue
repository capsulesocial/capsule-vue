<template>
  <div class="mt-3">
    <!-- Name, socials, follow, bio -->
    <article class="flex flex-row justify-between">
      <div>
        <h3 class="text-3xl">
          {{ this.currentUser.username }}
        </h3>
        <h5 class="text-xl text-gray-700">
          @{{ this.currentUser.id }}
        </h5>
      </div>
      <div class="flex items-center">
        <span
          v-for="s in this.currentUser.socials"
          :key="s.platform"
          class="px-2"
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
      </div>

      <FriendButton :targetUser="currentUser" />
    </article>

    <article>
      <p class="text-sm italic py-2">
        {{ this.currentUser.bio }}
      </p>
    </article>

    <article class="font-sans flex flex-row mt-3">
      <nuxt-link
        :to="'/' + this.currentUser.id"
        class="border-b hover:border-primary text-gray-700 mr-4"
      >
        <span class="text-primary">
          {{ this.currentUser.posts.length }}
        </span>
        Posts
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/followers'"
        class="border-b hover:border-primary text-gray-700 mr-4"
      >
        <span class="text-primary">
          {{ this.currentUser.followers.length }}
        </span>
        Followers
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/following'"
        class="border-b hover:border-primary text-gray-700 mr-4"
      >
        <span class="text-primary">
          {{ this.currentUser.following.length }}
        </span>
        Following
      </nuxt-link>
      <nuxt-link
        :to="'/' + this.currentUser.id + '/bookmarks'"
        class="border-b hover:border-primary text-gray-700"
      >
        <span class="text-primary">
          {{ this.currentUser.bookmarks.length }}
        </span>
        Bookmarks
      </nuxt-link>
    </article>
  </div>
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
  props: {
    currentUser: {
      type: Object,
      default: null,
    },
  },
  methods: {
    openWindow (url) {
      if (process.client) {
        window.open(url, '_blank')
      }
    },
  },
}
</script>
