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

    <Header class="pb-2 sticky top-0" />

    <div class="lg:grid lg:grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation />
      <!-- Main Content -->
      <Nuxt class="overscroll-contain col-span-3 w-full px-4 mb-20 lg:mb-5 pr-16" />
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

<style>
a.nuxt-link-active {
  font-weight: italic;
}

a.nuxt-link-exact-active {
  background-color: #89B8CA;
  font-weight: bold;
  color: #1E566C;
}
</style>
