<template>
  <main
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'"
    class="h-full"
  >
    <div
      v-if="this.$store.state.settings.draftMode === true"
      class="w-full h-full z-30 bg-white absolute"
    >
      <PostEditor class="z-40" />
    </div>

    <Header class="sticky top-0" />

    <div class="flex justify-center">
      <!-- Left Nav Menu -->
      <Navigation class="flex lg:pr-0 xl:pr-8" />
      <!-- Main Content -->
      <Nuxt class="mb-20 md:mb-5 border-l md:ml-24 xl:ml-64 md:min-w-max md:max-w-3xl" />
      <!-- Right Explore Menu -->
      <Explore v-if="this.$route.name !== 'settings'" class="hidden lg:block w-32" />
    </div>
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import Header from '@/components/Header.vue'
import PostEditor from '@/components/post/Editor.vue'
import ColorMode from '@/components/ColorMode.vue'
import Explore from '@/components/Explore.vue'

export default Vue.extend({
	components: {
		Navigation,
		Header,
		PostEditor,
		ColorMode,
		Explore,
	},
	created () {
		if (this.$store.state.session.cid === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
