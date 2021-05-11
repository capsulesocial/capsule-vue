<template>
  <section v-if="this.targetUser !== null">
    <ProfileHeader :currentUser="this.targetUser" />
    <article>
      <div v-for="i in this.targetUser['following']" :key="i">
        <nuxt-link class="text-primary underline" :to="'/' + i">
          {{ i }}
        </nuxt-link>
      </div>
    </article>
  </section>
</template>

<script>
import ProfileHeader from '@/components/ProfileHeader'

export default {
  components: {
    ProfileHeader,
  },
  data () {
    return {
      targetUser: null,
    }
  },
  created () {
    if (this.$route.params.id === this.$store.state.user.id) {
      this.targetUser = this.$store.state.user
    } else {
      // Get user profile
      // this.targetUser = this.$api.profile.getProfile(this.$route.params.id)
      const l = this.$store.state.userList
      for (let p = 0; p < l.length; p++) {
        if (l[p].id === this.$route.params.id) {
          this.targetUser = l[p]
        }
      }
    }
  },
}
</script>
