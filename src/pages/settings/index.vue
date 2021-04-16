<template>
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
        v-model="newID"
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

    <article class="px-5 py-5 grid grid-cols-2 gap-1 mt-5">
      <button
        class="flex items-center justify-center h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none focus:border-primary focus:text-primary"
      >
        <TwitterIcon class="mr-2" />
        <span class="text-xl">
          Twitter
        </span>
      </button>
      <button
        class="flex items-center justify-center h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none focus:border-primary focus:text-primary"
      >
        <GitHubIcon class="mr-2" />
        <span class="text-xl">
          GitHub
        </span>
      </button>
    </article>

    <article class="mt-8">
      <label for="password" class="text-lg bold">
        Current Password <span class="text-primary">*</span>
      </label>
      <input
        id="password"
        type="password"
        class="w-full border rounded-full focus:outline-none p-2"
      />

      <label for="newPassword" class="text-lg bold pt-2">New Password</label>
      <input
        id="newPassword"
        type="password"
        class="w-full border rounded-full focus:outline-none p-2"
      />

      <label for="confirmPassword" class="text-lg bold pt-2"
        >Confirm Password</label
      >
      <input
        id="confirmPassword"
        type="password"
        class="w-full border rounded-full focus:outline-none p-2"
      />
    </article>

    <article>
      <button
        class="bg-primary w-48 mt-5 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-lg shadow-lg focus:outline-none"
        @click="updateSettings()"
      >
        Save Changes
      </button>
    </article>
  </section>
</template>

<script>
import TwitterIcon from "@/components/icons/brands/Twitter";
import GitHubIcon from "@/components/icons/brands/GitHub";
export default {
  data() {
    return {
      newUsername: "",
      newID: "",
      newEmail: ""
    };
  },
  methods: {
    updateSettings() {
      // Run quality rules before saving
      if (this.newUsername !== "") {
        this.$store.commit("updateUsername", this.newUsername);
      }
      if (this.newID !== "") {
        this.$store.commit("updateID", this.newID);
      }
      if (this.newEmail !== "") {
        this.$store.commit("updateEmail", this.newEmail);
      }
    }
  },
  components: {
    TwitterIcon,
    GitHubIcon
  }
};
</script>
