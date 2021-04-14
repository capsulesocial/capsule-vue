<template>
  <section
    class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12"
  >
    <article class="self-center mb-5">
      <CapsuleIcon />
    </article>

    <!-- Login -->
    <article
      class="bg-white mx-auto lg:w-full lg:max-w-md rounded shadow-lg divide-y divide-gray-200"
    >
      <div class="flex justify-around">
        <span
          v-if="isLogin"
          class="text-primary p-5 inline-block border-b-2 border-primary font-bold"
        >
          Sign In
        </span>
        <button @click="toggleFormType" class="focus:outline-none" v-else>
          Sign In
        </button>
        <span
          v-if="!isLogin"
          class="text-primary p-5 inline-block border-b-2 border-primary font-bold"
        >
          Sign Up
        </span>
        <button @click="toggleFormType" class="focus:outline-none" v-else>
          Sign Up
        </button>
      </div>

      <div class="px-10 py-6">
        <!-- Register: Name -->
        <label
          v-if="!isLogin"
          for="name"
          class="font-semibold text-sm text-gray-600 pb-1 block"
          >Name</label
        >
        <input
          v-model="name"
          v-if="!isLogin"
          type="text"
          placeholder="Tom Brady"
          id="name"
          class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary"
        />
        <!-- Sign in + Register: ID -->
        <label for="id" class="font-semibold text-sm text-gray-600 pb-1 block"
          >ID</label
        >
        <input
          v-model="id"
          type="text"
          placeholder="tombrady"
          id="id"
          class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary"
        />
        <!-- Register: Contact -->
        <label
          v-if="!isLogin"
          for="contact"
          class="font-semibold text-sm text-gray-600 pb-1 block"
          >Contact</label
        >
        <input
          v-model="email"
          v-if="!isLogin"
          type="email"
          placeholder="tb12@nfl.com"
          id="contact"
          class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary text-primary"
        />
        <label
          for="password"
          class="font-semibold text-sm text-gray-600 pb-1 block"
          >Password</label
        >
        <input
          v-model="password"
          type="password"
          placeholder="************"
          id="loginPassword"
          class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
        />
        <label
          v-if="!isLogin"
          for="confirmPassword"
          class="font-semibold text-sm text-gray-600 pb-1 block"
          >Confirm Password</label
        >
        <input
          v-model="confirmPassword"
          v-if="!isLogin"
          type="password"
          placeholder="************"
          id="confirmPassword"
          class="border rounded-lg px-3 py-2 mt-1 mb-5 text-sm w-full focus:outline-none focus:border-primary"
        />
        <button
          type="button"
          class="bg-primary hover:bg-green-600 text-white w-full py-2.5 rounded-lg text-sm shadow-sm font-semibold text-center inline-block h-10 focus:outline-none"
          @click="verify"
        >
          <span v-if="!isLogin" class="inline-block">Sign Up</span>
          <span v-else class="inline-block">Sign In</span>
        </button>
      </div>
      <div class="px-10 py-5 grid grid-cols-2 gap-1">
        <button
          class="h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none focus:border-primary focus:text-primary"
        >
          Twitter
        </button>
        <button
          class="h-12 border text-gray-600 w-full py-2.5 rounded-lg focus:outline-none focus:border-primary focus:text-primary"
        >
          GitHub
        </button>
      </div>
      <div
        class="text-center whitespace-nowrap flex justify-between text-sm p-5 text-gray-600"
        v-if="isLogin"
      >
        <button class="px-4 py-2 focus:outline-none">
          Forgot Password
        </button>
        <button class="px-4 py-2 focus:outline-none">Help</button>
      </div>
      <div v-else class="flex justify-center">
        <label class="items-center p-5 text-gray-600 inline-flex">
          <input
            v-model="consent"
            type="checkbox"
            class="form-checkbox h-4 w-4 text-primary"
            checked
          /><span class="ml-2 text-gray-700"
            >I agree to the Terms and Conditions
          </span>
        </label>
      </div>
    </article>
  </section>
</template>

<script>
import CapsuleIcon from "@/components/icons/Capsule";
export default {
  layout: "unauth",
  data() {
    return {
      isLogin: true,
      name: null,
      id: null,
      email: null,
      password: null,
      confirmPassword: null,
      consent: true
    };
  },
  components: {
    CapsuleIcon
  },
  methods: {
    toggleFormType: function() {
      this.isLogin = !this.isLogin;
    },
    verify: async function() {
      if (this.isLogin) {
        const res = await this.$api.auth.login(this.id, this.password);
        if (res) {
          // this.$store.state.setSession(res.user)
        } else alert("Invalid login!");
      } else {
        // Registration
        if (!this.consent) {
          alert("Please accept the Terms & Conditions");
          return;
        }
        if (this.password === this.confirmPassword) {
          const res = await this.$api.auth.register({
            id: this.id,
            username: this.name,
            email: this.email,
            password: this.password,
            likes: [],
            followers: [],
            following: []
          });
        } else {
          alert("Password mismatch!");
          return;
        }
      }
      this.$router.push("/");
    }
  }
};
</script>
