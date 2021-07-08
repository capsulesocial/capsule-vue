<template>
  <article>
    <nuxt-link
      v-if="this.$props.layout === `block`"
      :to="'/discover/' + this.$props.text"
      class="flex items-end transition duration-500 ease-in-out transform hover:scale-110 overflow-hidden h-40 rounded-lg shadow-lg bg-primary"
    >
      <img
        v-if="this.$props.bgImage !== ``"
        :src="this.$props.bgImage"
        :alt="this.$props.text"
        class="opacity-75 absolute left-0 top-0 object-cover h-40 w-full "
      />
      <div class="flex flex-col font-sans p-4">
        <h4 class="text-lg text-white font-extrabold capitalize z-20">
          {{ this.$props.text }}
        </h4>
      </div>
    </nuxt-link>
    <!-- List View -->
    <div v-else class="flex flex-row justify-between">
      <nuxt-link
        :to="'/discover/' + this.$props.text"
        class="flex w-full"
      >
        <img
          v-if="this.$props.bgImage !== ``"
          :src="this.$props.bgImage"
          :alt="this.$props.text"
          class="opacity-75 h-20 w-24 object-cover rounded-lg shadow-lg"
        />
        <div class="px-4 w-full flex items-center">
          <span>
            <h4>
              {{ this.$props.text }}
            </h4>
            <h5>
              0 Members
            </h5>
          </span>
        </div>
      </nuxt-link>
      <button class=" px-3 text-2xl bg-primary rounded-full text-white self-center">+</button>
    </div>
  </article>
</template>

<script>
export default {
	props: {
		text: {
			type: String,
			default: `No Title`,
		},
		bgImage: {
			type: String,
			default: ``,
		},
		layout: {
			type: String,
			default: `block`,
		},
	},
}
</script>
