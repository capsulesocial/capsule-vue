<template>
  <article>
    <!-- Unverified -->
    <div v-if="!this.isActive" class="flex justify-between text-gray5">
      <div class="flex flex-row items-center text-xl">
        <TwitterIcon v-if="this.$props.platform === 'twitter'" class="mr-4" />
        <GitHubIcon v-if="this.$props.platform === 'github'" class="mr-4" />
        <ExternalURLIcon v-if="this.$props.platform === 'website'" class="mr-4" />
        {{ this.$props.platform.toUpperCase() }}
      </div>
      <button
        class="focus:outline-none text-primary font-bold"
        @click="toggleVerify()"
      >
        Connect
      </button>
    </div>

    <div v-else class="h-12 w-full flex justify-between items-center">
      <div v-if="!this.isVerified">
        <label
          for="handle"
        >
          <span v-if="this.$props.platform !== 'website'">handle: @</span><span v-else>URL:</span>
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
        <ExternalURLIcon v-if="this.$props.platform === 'website'" />
      </button>
      <button
        v-else
        class="flex bg-white border border-red-500 hover:bg-red-200  font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        @click="removeSocial()"
      >
        <TwitterIcon v-if="this.$props.platform === 'twitter'" />
        <GitHubIcon v-if="this.$props.platform === 'github'" />
        <ExternalURLIcon v-if="this.$props.platform === 'website'" />
        <span class="mx-2">Remove</span>
        <XIcon />
      </button>
    </div>
  </article>
</template>

<script>
import TwitterIcon from '@/components/icons/brands/Twitter'
import GitHubIcon from '@/components/icons/brands/GitHub'
import ExternalURLIcon from '@/components/icons/ExternalURL'
import XIcon from '@/components/icons/X'

export default {
  components: {
    TwitterIcon,
    GitHubIcon,
    ExternalURLIcon,
    XIcon,
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
      if (this.$props.platform === 'website' && !this.$quality.validateURL(this.handle)) {
        alert('Check URL!')
        return
      }
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
