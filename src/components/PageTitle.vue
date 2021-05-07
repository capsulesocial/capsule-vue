<template>
  <div>
    <h2 class="text-2xl capitalize">
      {{ this.$props.title }}
    </h2>
  </div>
</template>

<script>
export default {
  props: {
    title: String,
    default: "Title"
  }
};
</script>
