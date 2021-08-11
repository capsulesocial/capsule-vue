<template>
	<section>
		<article>Comments</article>
		{{ this.$props.profile }}
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
