<template>
  <section
    v-if="this.$store.state.me !== null"
    class="bg-white h-full"
  >
    <article
      v-if="this.$store.state.draft.isComposing === true"
      class="w-full h-screen z-30 bg-white absolute"
    >
      <PostEditor class="z-40" />
    </article>

    <Header class="sticky top-0" />

    <div class="lg:grid lg:grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation class="flex flex-row-reverse pr-8" />
      <!-- Main Content -->
      <Nuxt class="overscroll-contain col-span-3 w-full mb-20 lg:mb-5 pr-16 border-l border-gray1" />
    </div>
  </section>
</template>

<script>
import Navigation from '@/components/Navigation'
import Header from '@/components/Header'
import PostEditor from '@/components/post/Editor'

export default {
  components: {
    Navigation,
    Header,
    PostEditor,
  },
  created () {
    if (this.$store.state.me.id === '') {
      this.$router.push('/auth')
    }
  },
}
</script>
