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
			targetUser: {},
		}
	},
	async created () {
		if (this.$route.params.id === this.$store.state.session.cid) {
			this.targetUser = this.$store.state.session
		} else {
			// Get user profile
			this.targetUser = await this.$getProfile(this.$route.params.id)
		}
	},
}
</script>
