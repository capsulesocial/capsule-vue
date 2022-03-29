<template>
	<nuxt-link :to="'/id/' + authorID" class="mr-4 flex" :class="isHoverCard ? `flex-col` : ``">
		<span
			v-if="authorName != ``"
			class="text-base dark:text-darkPrimaryText transition ease-in-out hover:underline"
			:class="isHoverCard ? `font-bold` : `font-medium`"
		>
			{{ authorName }}
		</span>
		<span
			v-else
			class="text-gray5 dark:text-gray3 text-base transition ease-in-out hover:underline"
			:class="isHoverCard ? `font-bold` : `font-medium`"
		>
			{{ authorID }}
		</span>
		<span class="text-primary dark:text-secondary" :class="isHoverCard ? `` : `ml-2`"> @{{ authorID }} </span>
	</nuxt-link>
</template>

<script lang="ts">
import Vue, { PropType } from 'vue'
export default Vue.extend({
	props: {
		authorID: {
			type: String as PropType<String>,
			required: true,
		},
		authorName: {
			type: String as PropType<String>,
			required: true,
		},
		isHoverCard: {
			type: Boolean as PropType<Boolean>,
			default: false,
		},
	},
})
</script>
