<template>
	<article>
		<nuxt-link
			v-if="this.$props.layout === `block`"
			:to="'/discover/' + this.$props.text"
			class="
				flex
				items-end
				transition
				duration-500
				ease-in-out
				transform
				hover:scale-105
				overflow-hidden
				rounded-lg
				shadow-lg
				bg-primary
			"
			style="width: 300px; height: 211.5px"
		>
			<img
				v-if="this.$props.bgImage !== ``"
				:src="this.$props.bgImage"
				:alt="this.$props.text"
				class="opacity-75 absolute left-0 top-0 object-contain w-full"
			/>
			<div class="flex flex-col font-sans p-4">
				<h4 class="text-lg text-white font-extrabold capitalize z-20" style="text-shadow: 2px 2px 4px #000000">
					{{ this.$props.text }}
				</h4>
			</div>
		</nuxt-link>
		<!-- List View -->
		<div v-else class="flex flex-row justify-between">
			<nuxt-link :to="'/discover/' + this.$props.text" class="flex w-full">
				<img
					v-if="this.$props.bgImage !== ``"
					:src="this.$props.bgImage"
					:alt="this.$props.text"
					class="opacity-75 h-20 w-24 object-cover rounded-lg shadow-lg"
				/>
				<div class="px-4 w-full flex items-center">
					<span>
						<h4 class="text-lg capitalize">
							{{ this.$props.text }}
						</h4>
						<h5 class="text-gray5 text-sm">0 members</h5>
					</span>
				</div>
			</nuxt-link>
			<div class="flex items-center">
				<button class="border border-white rounded-full p-2 bg-primary shadow-lg focus:outline-none">
					<span class="text-white"><PlusIcon /></span>
				</button>
			</div>
		</div>
	</article>
</template>

<script>
import PlusIcon from '@/components/icons/Plus.vue'

export default {
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
}
</script>
