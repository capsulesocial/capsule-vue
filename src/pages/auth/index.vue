<template>
  <main class="min-h-screen bg-gray-100 flex flex-col justify-center sm:py-12">
    <div class="self-center mb-5">
      <CapsuleIcon />
    </div>

    <!-- Login -->
    <section
      class="bg-white mx-auto lg:w-full lg:max-w-md rounded shadow-lg divide-y divide-gray-200"
    >
      <article class="flex justify-around">
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
      </article>

      <article class="px-10 py-6">
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
        <BrandedButton
          :text="isLogin ? 'Sign In' : 'Sign Up'"
          :action="verify"
          class="w-full"
        />
      </article>
      <article
        class="text-center whitespace-nowrap flex justify-between text-sm p-5 text-gray-600"
        v-if="isLogin"
      >
        <button class="px-4 py-2 focus:outline-none">
          Forgot Password
        </button>
        <button class="px-4 py-2 focus:outline-none">Help</button>
      </article>
      <article v-else class="flex justify-center">
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
      </article>
    </section>
  </main>
</template>

<script>
import CapsuleIcon from "@/components/icons/Capsule";
import BrandedButton from "@/components/BrandedButton";

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
    CapsuleIcon,
    BrandedButton
  },
  methods: {
    toggleFormType: function() {
      this.isLogin = !this.isLogin;
    },
    verify: async function() {
      let pwCheck = this.$quality.password(this.password);
      let idCheck = this.$quality.id(this.id);
      if (pwCheck !== true) {
        alert(pwCheck);
        return;
      }
      if (idCheck !== true) {
        alert(idCheck);
        return;
      }

      // Login
      if (this.isLogin) {
        const res = await this.$api.auth.login(this.id, this.password);
        if (res) {
          // this.$store.state.setSession(res.user)
          this.$router.push("/");
        } else {
          alert("Invalid login!");
        }
      } else {
        // Registration
        if (!this.consent) {
          alert("Please accept the Terms & Conditions");
          return;
        }
        if (this.$quality.email(this.email) !== true) {
          alert("Invalid email!");
          return;
        }
        if (this.password === this.confirmPassword) {
          let account = {
            id: this.id,
            username: this.name,
            email: this.email,
            password: this.password,
            bio: "",
            posts: [],
            socials: [],
            bookmarks: [],
            followers: [],
            following: []
          };
          const res = await this.$api.auth.register(account);
          account.password = null;
          this.$store.commit("startSession", account);
          this.$router.push("/settings");
        } else {
          alert("Password mismatch!");
          return;
        }
      }
    }
  }
};
</script>
