<template>
  <section class="bg-white h-full">
    <article
      v-if="this.$store.state.settings.draftMode === true"
      class="w-full h-screen z-30 bg-white absolute"
    >
      <PostEditor class="z-40" />
    </article>

    <Header class="sticky top-0" />

    <div class="lg:grid lg:grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation class="flex flex-row-reverse md:pr-8" />
      <!-- Main Content -->
      <Nuxt class="overscroll-contain col-span-3 w-full mb-20 lg:mb-5 md:pr-16 border-l border-gray1" />
    </div>
  </section>
</template>

<script lang="ts">
import Vue from 'vue'
import Navigation from '@/components/Navigation.vue'
import Header from '@/components/Header.vue'
import PostEditor from '@/components/post/Editor.vue'

export default Vue.extend({
	components: {
		Navigation,
		Header,
		PostEditor,
	},
	created () {
		console.log(this.$store.state.session.cid)
		if (this.$store.state.session.cid === ``) {
			console.log(`ROUTER PUSH`)
			this.$router.push(`/auth`)
		}
	},
})
</script>
