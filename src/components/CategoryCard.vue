<template>
	<article class="flex justify-center">
		<nuxt-link
			v-if="bgImage !== ``"
			:to="'/discover/' + text"
			class="bg-primary flex w-full transform items-end overflow-hidden rounded-lg shadow-lg transition duration-500 ease-in-out hover:scale-105"
			:style="{
				background: `linear-gradient(180deg, rgba(0, 0, 0, 0) 50%, rgba(0, 0, 0, 0.8) 100%), url(` + bgImage + `)`,
				backgroundSize: 'cover',
				height: '200px',
			}"
		>
			<!-- <img v-if="bgImage !== ``" :src="bgImage" :alt="text" class="absolute left-0 top-0 object-contain w-full" /> -->
			<div class="flex flex-col p-4 font-sans">
				<h4 class="z-20 text-2xl font-extrabold capitalize text-white">
					{{ text.replace(`-`, ` `) }}
				</h4>
			</div>
		</nuxt-link>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
	props: {
		text: {
			type: String,
			required: true,
		},
		bgImage: {
			type: String,
			required: true,
		},
	},
})
</script>
