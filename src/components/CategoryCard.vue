<template>
	<article class="flex justify-center">
		<nuxt-link
			v-if="layout === `block` && bgImage !== ``"
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
					{{ text }}
				</h4>
			</div>
		</nuxt-link>
		<!-- List View -->
		<div v-else class="flex flex-row justify-between">
			<nuxt-link :to="'/discover/' + text" class="flex w-full">
				<img v-if="bgImage !== ``" :src="bgImage" :alt="text" class="h-20 w-24 rounded-lg object-cover shadow-lg" />
				<div class="flex w-full items-center px-4">
					<span>
						<h4 class="text-lg capitalize">
							{{ text }}
						</h4>
						<h5 class="text-gray5 text-sm">0 members</h5>
					</span>
				</div>
			</nuxt-link>
			<div class="flex items-center">
				<button class="bg-primary focus:outline-none rounded-full border border-white p-2 shadow-lg">
					<span class="text-white"><PlusIcon /></span>
				</button>
			</div>
		</div>
	</article>
</template>

<script lang="ts">
import Vue from 'vue'
import PlusIcon from '@/components/icons/Plus.vue'

export default Vue.extend({
	components: {
		PlusIcon,
	},
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
})
</script>
