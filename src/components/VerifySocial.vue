<template>
  <article class="flex flex-row">
    <!-- Unverified -->
    <button
      v-if="!this.isActive"
      class="flex items-center justify-center h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none hover:border-primary hover:text-primary"
      @click="toggleVerify()"
    >
      <TwitterIcon v-if="this.$props.platform === 'twitter'" class="mr-2" />
      <GitHubIcon v-if="this.$props.platform === 'github'" class="mr-2" />
      <span class="text-xl">
        {{ this.$props.platform.toUpperCase() }}
      </span>
    </button>
    <div v-else class="h-12 w-full flex justify-between items-center">
      <div v-if="!this.isVerified">
        <label
          for="handle"
        >
          Enter your {{ this.$props.platform }} handle:
          <span class="text-primary">@</span>
        </label>
        <input
          id="handle"
          v-model="handle"
          type="text"
          placeholder="handle"
          class="text-primary border-b border-primary focus:outline-none"
        />
      </div>
      <div v-else>
        <span>
          ({{ this.handle }}) {{ this.$props.platform }} account has been verified
        </span>
      </div>
      <button
        v-if="!this.isVerified"
        class="flex bg-primary hover:bg-third text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        @click="verifySocial()"
      >
        <span class="mr-2">Verify</span>
        <TwitterIcon v-if="this.$props.platform === 'twitter'" />
        <GitHubIcon v-if="this.$props.platform === 'github'" />
      </button>
      <button
        v-else
        class="flex bg-white border border-red-500 hover:bg-red-200  font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        @click="removeSocial()"
      >
        <TwitterIcon v-if="this.$props.platform === 'twitter'" />
        <GitHubIcon v-if="this.$props.platform === 'github'" />
        <span class="mx-2">Remove</span>
        ❌
      </button>
    </div>
  </article>
</template>

<script>
import TwitterIcon from '@/components/icons/brands/Twitter'
import GitHubIcon from '@/components/icons/brands/GitHub'

export default {
  components: {
    TwitterIcon,
    GitHubIcon,
  },
  props: {
    platform: {
      type: String,
      default: '',
    },
  },
  data () {
    return {
      isActive: false,
      handle: '',
      isVerified: false,
    }
  },
  mounted () {
    const socials = this.$store.state.me.socials
    for (const s in socials) {
      if (socials[s].platform === this.$props.platform) {
        this.isActive = true
        this.isVerified = true
        this.handle = socials[s].username
      }
    }
  },
  methods: {
    toggleVerify () {
      this.isActive = !this.isActive
    },
    verifySocial (platform, handle) {
      this.$store.commit('me/addSocial', {
        platform: this.$props.platform,
        username: this.handle,
      })
      this.isVerified = true
    },
    removeSocial () {
      this.$api.settings.removeSocial(
        this.$store.state.me.id,
        this.$props.platform,
      )
      this.$store.commit('me/removeSocial', {
        platform: this.$props.platform,
      })
      this.isVerified = false
      this.isActive = false
    },
  },
}
</script>
