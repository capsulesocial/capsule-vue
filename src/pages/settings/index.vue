<template>
  <section>
    <article class="grid grid-cols-2 gap-2 border p-2 rounded">
      <h4 class="text-lg bold">Name</h4>
      <input
        type="text"
        v-model="newUsername"
        :placeholder="this.$store.state.user.username"
        class="focus:outline-none"
      />

      <h4 class="text-lg bold">ID</h4>
      <input
        type="text"
        v-model="newID"
        :placeholder="this.$store.state.user.id"
        class="focus:outline-none"
      />

      <h4 class="text-lg bold">Contact</h4>
      <input
        type="email"
        v-model="newEmail"
        :placeholder="this.$store.state.user.email"
        class="focus:outline-none"
      />
    </article>

    <article class="mt-8">
      <h4 class="text-lg bold">
        Current Password <span class="text-primary">*</span>
      </h4>
      <input
        type="password"
        class="w-full border rounded-full focus:outline-none p-2"
      />

      <h4 class="text-lg bold pt-2">New Password</h4>
      <input
        type="password"
        class="w-full border rounded-full focus:outline-none p-2"
      />

      <h4 class="text-lg bold pt-2">New Password</h4>
      <input
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
  }
};
</script>
