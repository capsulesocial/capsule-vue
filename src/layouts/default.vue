<template>
  <main
    class="h-full"
    :class="this.$store.state.settings.darkMode ? 'bg-lightBG' : 'bg-darkBG'"
  >
    <article
      v-if="this.$store.state.settings.draftMode === true"
      class="w-full h-full z-30 bg-white absolute"
    >
      <PostEditor class="z-40" />
    </article>

    <Header class="pb-2 sticky top-0" />

    <div class="lg:grid lg:grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation class="flex flex-row-reverse md:pr-8" />
      <!-- Main Content -->
      <Nuxt class="overscroll-contain col-span-2 w-full mb-20 lg:mb-5 border-l border-r border-gray1" />
      <!-- Right Explore Menu -->
      <Explore v-if="this.$route.name !== 'settings'" class="hidden lg:block" />
    </div>
    <!-- Toggle Light / Dark Mode -->
    <ColorMode class="fixed bottom-0 right-0 m-5" />
  </main>
</template>

<script lang="ts">
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import Explore from '@/components/Explore.vue'
import Header from '@/components/Header.vue'
import PostEditor from '@/components/post/Editor.vue'
import ColorMode from '@/components/ColorMode.vue'

export default Vue.extend({
	components: {
		Navigation,
		Explore,
		Header,
		PostEditor,
		ColorMode,
	},
	created () {
		if (this.$store.state.session.cid === ``) {
			this.$router.push(`/auth`)
		}
	},
})
</script>
