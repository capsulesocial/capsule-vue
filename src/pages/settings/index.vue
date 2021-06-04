<template>
  <main>
    <section>
      <article class="pt-4">
        <!-- General Settings (Username, ID, Email) -->
        <h2 class="text-2xl bold text-primary">
          General Settings
        </h2>
        <div class="grid grid-cols-2 gap-2 border rounded-lg p-4">
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

          <label for="location" class="text-lg bold">Location</label>
          <input
            id="location"
            v-model="location"
            type="text"
            :placeholder="this.$store.state.me.location === '' ? 'Enter Location' : this.$store.state.me.location"
            class="focus:outline-none"
          />
        </div>
      </article>

      <!-- Profile Picture Upload -->
      <article class="pt-4">
        <label for="profile_pic">Upload Profile Picture</label>
        <input
          id="file-input"
          ref="uploadedPic"
          name="file"
          type="file"
          accept="image/*"
          @change="uploadImage"
        >
        <img :src="profilePic" />
      </article>

      <article class="pt-4">
        <label for="bio">
          <h2 class="text-2xl bold text-primary">
            Bio:
          </h2>
        </label>
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

      <article class="grid grid-cols-1 gap-4">
        <h2 class="text-2xl bold text-primary">
          Social Links
        </h2>
        <VerifySocial platform="twitter" />
        <VerifySocial platform="github" />
        <VerifySocial platform="website" />
      </article>

      <article class="pt-4">
        <h2 class="text-2xl bold text-primary">
          Change Password
        </h2>
        <label for="password" class="text-sm py-2">
          Current Password <span class="text-primary">*</span>
        </label>
        <input
          id="password"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />

        <label for="newPassword" class="text-sm py-2">New Password</label>
        <input
          id="newPassword"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />

        <label for="confirmPassword" class="text-sm py-2">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2 focus:border-primary"
        />
      </article>

      <article class="text-right pt-4">
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
  layout: 'Extended',
  data () {
    return {
      newUsername: '',
      profilePic: null,
      newID: '',
      newEmail: '',
      location: '',
      bio: this.$store.state.me.bio,
      maxCharBio: 256,
    }
  },
  methods: {
    uploadImage (e) {
      const image = e.target.files[0]
      const reader = new FileReader()
      reader.readAsDataURL(image)
      reader.onload = (i) => {
        this.profilePic = i.target.result
        this.$store.commit('me/updateAvatar', this.profilePic)
      }
    },
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
      if (this.location !== this.$store.state.me.location && this.$quality.validate(this.location)) {
        this.$store.commit('me/updateLocation', this.location)
      }
      alert('Settings updated!')
      this.$router.push('/' + this.$store.state.me.id)
    },
  },
}
</script>
