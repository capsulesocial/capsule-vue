<template>
  <main>
    <section>
      <article class="grid grid-cols-2 gap-2 border p-2 rounded">
        <label for="newUsername" class="text-lg bold">Name</label>
        <input
          id="newUsername"
          type="text"
          v-model="newUsername"
          :placeholder="this.$store.state.user.username"
          class="focus:outline-none"
        />

        <label for="newID" class="text-lg bold">ID</label>
        <input
          id="newID"
          type="text"
          v-model.trim="newID"
          :placeholder="this.$store.state.user.id"
          class="focus:outline-none"
        />

        <label for="newEmail" class="text-lg bold">Contact</label>
        <input
          id="newEmail"
          type="email"
          v-model="newEmail"
          :placeholder="this.$store.state.user.email"
          class="focus:outline-none"
        />
      </article>

      <article class="pt-5">
        <label for="bio" class="text-lg bold">Bio:</label>
        <textarea
          id="bio"
          :maxlength="maxCharBio"
          :value="bio"
          @input="bio = $event.target.value"
          @keyup="checkBio()"
          rows="4"
          class="w-full border focus:border-primary focus:outline-none p-1 resize-none"
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
          >Confirm Password</label
        >
        <input
          id="confirmPassword"
          type="password"
          class="w-full border rounded-full focus:outline-none p-2"
        />
      </article>

      <article class="pt-5 text-right">
        <BrandedButton text="Save Changes" :action="updateSettings" />
      </article>
    </section>
  </main>
</template>

<script>
import _ from "lodash";
import DOMPurify from "dompurify";
import VerifySocial from "@/components/VerifySocial";
import BrandedButton from "@/components/BrandedButton";

export default {
  data() {
    return {
      newUsername: "",
      newID: "",
      newEmail: "",
      bio: this.$store.state.user.bio,
      maxCharBio: 256
    };
  },
  methods: {
    checkBio() {
      let charCount = this.bio.length;
      return this.maxCharBio - charCount;
    },
    updateSettings() {
      // Run quality rules before saving
      if (this.newUsername !== "") {
        this.$store.commit("updateUsername", this.newUsername);
      }
      if (this.newID !== "" && this.$quality.id(this.newID)) {
        this.$store.commit("updateID", this.newID);
      }
      if (this.bio !== this.$store.state.user.bio && this.checkBio() > 0) {
        this.$store.commit("updateBio", this.bio);
      }
      if (this.newEmail !== "" && this.$quality.email(this.newEmail)) {
        this.$store.commit("updateEmail", this.newEmail);
      }
    }
  },
  components: {
    VerifySocial,
    BrandedButton
  }
};
</script>
