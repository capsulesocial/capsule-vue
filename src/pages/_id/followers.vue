<template>
  <section v-if="this.targetUser !== null" class="px-4">
    <article>
      <div v-for="i in this.targetUser['followers']" :key="i">
        <nuxt-link class="text-primary underline" :to="'/' + i">
          {{ i }}
        </nuxt-link>
      </div>
    </article>
  </section>
</template>

<script>

export default {
  data () {
    return {
      targetUser: null,
    }
  },
  created () {
    if (this.$route.params.id === this.$store.state.me.id) {
      this.targetUser = this.$store.state.me
    } else {
      // Get user profile
      // this.targetUser = this.$api.profile.getProfile(this.$route.params.id)
      const l = this.$store.state.authors
      for (let p = 0; p < l.length; p++) {
        if (l[p].id === this.$route.params.id) {
          this.targetUser = l[p]
        }
      }
    }
  },
}
</script>
