<template>
	<section>
		<article>
			<CategoryCard
				text="test"
				:bgImage="require('@/assets/images/category/education/education.jpg')"
				layout="list"
				class="p-5"
			/>
		</article>
	</section>
</template>

<script lang="ts">
import Vue from 'vue'
import CategoryCard from '@/components/CategoryCard.vue'

export default Vue.extend({
	components: {
		CategoryCard,
	},
})
</script>
