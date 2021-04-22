<template>
  <article class="flex flex-row">
    <button
      v-if="!this.isActive"
      @click="toggleVerify()"
      class="flex items-center justify-center h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none hover:border-primary hover:text-primary"
    >
      <TwitterIcon v-if="this.$props.platform === 'twitter'" class="mr-2" />
      <GitHubIcon v-if="this.$props.platform === 'github'" class="mr-2" />
      <span class="text-xl">
        {{ this.$props.platform.toUpperCase() }}
      </span>
    </button>
    <div v-else class="h-12 w-full flex justify-between items-center">
      <button @click="toggleVerify()" class="focus:outline-none">
        ❌
      </button>
      <div>
        <label for="handle"
          >Enter your {{ this.$props.platform }} handle:
          <span class="text-primary">@</span>
        </label>
        <input
          v-model="handle"
          type="text"
          id="handle"
          placeholder="handle"
          class="text-primary border-b border-primary focus:outline-none"
        />
      </div>
      <button
        @click="verifySocial()"
        class="flex bg-primary hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
      >
        <span class="mr-2">Verify</span>
        <TwitterIcon v-if="this.$props.platform === 'twitter'" />
        <GitHubIcon v-if="this.$props.platform === 'github'" />
      </button>
    </div>
  </article>
</template>

<script>
import TwitterIcon from "@/components/icons/brands/Twitter";
import GitHubIcon from "@/components/icons/brands/GitHub";

export default {
  data() {
    return {
      isActive: false,
      handle: ""
    };
  },
  props: {
    platform: {
      type: String,
      default: ""
    }
  },
  methods: {
    toggleVerify() {
      this.isActive = !this.isActive;
    },
    verifySocial(platform, handle) {
      this.$api.settings.verifySocial(
        this.$store.state.user.id,
        this.$props.platform,
        this.handle
      );
    }
  },
  components: {
    TwitterIcon,
    GitHubIcon
  }
};
</script>
