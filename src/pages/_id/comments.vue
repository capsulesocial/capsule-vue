<template>
	<section>
		<article>Comments</article>
		{{ profile }}
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
