<template>
  <main>
    <section class="font-sans">
      <article class="grid grid-cols-2 gap-2 border p-2 rounded-lg">
        <label for="newUsername" class="text-lg bold">Name</label>
        <input
          id="newUsername"
          v-model="newUsername"
          type="text"
          :placeholder="this.$store.state.me.username"
          class="focus:outline-none"
        />

        <label for="newID" class="text-lg bold">ID</label>
        <input
          id="newID"
          v-model.trim="newID"
          type="text"
          :placeholder="this.$store.state.me.id"
          class="focus:outline-none"
        />

        <label for="newEmail" class="text-lg bold">Contact</label>
        <input
          id="newEmail"
          v-model="newEmail"
          type="email"
          :placeholder="this.$store.state.me.email"
          class="focus:outline-none"
        />
      </article>

      <article class="pt-5">
        <label for="bio" class="text-sm bold text-primary">Bio:</label>
        <textarea
          id="bio"
          :maxlength="maxCharBio"
          :value="bio"
          rows="4"
          class="w-full border rounded-lg focus:border-primary focus:outline-none p-1 resize-none"
          @input="bio = $event.target.value"
          @keyup="checkBio()"
        ></textarea>
        <p class="text-xs text-right">
          {{ this.checkBio() }} Characters Remaining
        </p>
      </article>

      <article class="grid grid-cols-1 gap-5 mt-5">
        <VerifySocial platform="twitter" />
        <VerifySocial platform="github" />
      </article>

      <article class="mt-5">
        <label for="password" class="text-lg bold">
          Current Password <span class="text-primary">*</span>
        </label>
        <input
          id="password"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />

        <label for="newPassword" class="text-lg bold pt-2">New Password</label>
        <input
          id="newPassword"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />

        <label
          for="confirmPassword"
          class="text-lg bold pt-2 focus:border-primary"
        >
          Confirm Password
        </label>
        <input
          id="confirmPassword"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />
      </article>

      <article class="pt-5 text-right">
        <BrandedButton text="Save Changes" :action="updateSettings" />
      </article>
    </section>
  </main>
</template>

<script>
import BrandedButton from '@/components/BrandedButton'

export default {
  components: {
    VerifySocial: () => import('@/components/VerifySocial/'),
    BrandedButton,
  },
  data () {
    return {
      newUsername: '',
      newID: '',
      newEmail: '',
      bio: this.$store.state.me.bio,
      maxCharBio: 256,
    }
  },
  methods: {
    checkBio () {
      const charCount = this.bio.length
      return this.maxCharBio - charCount
    },
    updateSettings () {
      // Run quality rules before saving
      if (this.newUsername !== '') {
        this.$store.commit('me/updateUsername', this.newUsername)
      }
      if (this.newID !== '' && this.$quality.id(this.newID)) {
        this.$store.commit('me/updateID', this.newID)
      }
      if (this.bio !== this.$store.state.me.bio && this.checkBio() > 0) {
        this.$store.commit('me/updateBio', this.bio)
      }
      if (this.newEmail !== '' && this.$quality.email(this.newEmail)) {
        this.$store.commit('me/updateEmail', this.newEmail)
      }
      alert('Settings updated!')
      this.$router.push('/' + this.$store.state.me.id)
    },
  },
}
</script>
