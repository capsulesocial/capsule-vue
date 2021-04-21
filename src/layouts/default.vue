<template>
  <section>
    <article
      v-if="this.$store.state.isComposing === true"
      class="w-full h-screen z-30 bg-gray-100 absolute"
    >
      <PostEditor class="z-40" />
    </article>

    <Header class="pb-2 sticky top-0" />

    <div class="lg:grid lg:grid-cols-4">
      <!-- Left Nav Menu -->
      <Navigation />
      <!-- Main Content -->
      <Nuxt class="overscroll-contain col-span-2 w-full px-4" />
      <!-- Right Explore Menu -->
      <Explore class="hidden lg:block" />
    </div>
  </section>
</template>

<script>
import Navigation from "@/components/Navigation";
import Explore from "@/components/Explore";
import Header from "@/components/Header";
import PostEditor from "@/components/post/Editor";

export default {
  components: {
    Navigation,
    Explore,
    Header,
    PostEditor
  }
};
</script>

<style>
a.nuxt-link-active {
  font-weight: italic;
}

a.nuxt-link-exact-active {
  font-weight: bold;
  color: #6fa786;
}
</style>
