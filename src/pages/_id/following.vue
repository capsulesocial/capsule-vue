<template>
	<section v-if="profile !== null" class="px-4">
		<article>
			<div v-for="i in profile.following" :key="i">
				<nuxt-link class="text-primary underline" :to="'/' + i">
					{{ i }}
				</nuxt-link>
			</div>
		</article>
	</section>
</template>

<script>
export default {
	props: {
		profile: {
			type: Object,
			default: null,
		},
	},
}
</script>
