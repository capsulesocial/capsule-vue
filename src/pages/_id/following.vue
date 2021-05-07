<template>
  <section v-if="this.targetUser !== null">
    <article>
      <PageTitle :title="'Following ' + this.targetUser.username" />
    </article>
    <article>
      <div v-for="i in this.targetUser['following']" :key="i">
        <nuxt-link class="text-primary underline" :to="'/' + i">{{
          i
        }}</nuxt-link>
      </div>
    </article>
  </section>
</template>

<script>
import PageTitle from "@/components/PageTitle";

export default {
  data() {
    return {
      targetUser: null
    };
  },
  async created() {
    if (this.$route.params.id === this.$store.state.user.id) {
      this.targetUser = this.$store.state.user;
    } else {
      // Get user profile
      // this.targetUser = this.$api.profile.getProfile(this.$route.params.id)
      let l = this.$store.state.userList;
      for (let p = 0; p < l.length; p++) {
        if (l[p].id === this.$route.params.id) {
          this.targetUser = l[p];
        }
      }
    }
  },
  components: {
    PageTitle
  }
};
</script>
