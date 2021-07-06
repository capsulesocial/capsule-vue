<template>
  <span>
    <svg
      v-if="this.$props.downsize"
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-down"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      stroke-width="2"
      stroke-linecap="round"
      stroke-linejoin="round"
      class="feather feather-chevron-down"
    >
      <polyline points="6 9 12 15 18 9"></polyline>
    </svg>
  </span>
</template>

<script>
export default {
	props: {
		downsize: {
			type: Boolean,
			default: false,
		},
	},
}
</script>
