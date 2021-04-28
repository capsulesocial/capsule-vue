<template>
  <main>
    <h1 class="text-4xl font-bold text-red-500 text-center">
      {{ this.$props.error["statusCode"] }}: {{ this.$props.error["message"] }}
    </h1>
    <h6 class="text-xl text-center p-10">
      😰 We're so sorry... An error has occurred 😓
    </h6>
    <div class="flex justify-center">
      <BrandedButton text="Return" :action="goBack" class="w-64" />
    </div>
  </main>
</template>

<script>
import BrandedButton from "@/components/BrandedButton";

export default {
  props: ["error"],
  layout: "error",
  components: [BrandedButton],
  created() {
    if (this.$store.state.user === null) {
      this.$router.push("/auth");
    }
  },
  methods: {
    goBack: function() {
      this.$router.push("/");
    }
  }
};
</script>
