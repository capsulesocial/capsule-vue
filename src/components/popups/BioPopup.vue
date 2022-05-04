<template>
	<div
		class="bg-darkBG dark:bg-lightBG fixed z-40 h-screen w-full overflow-auto bg-opacity-50 dark:bg-opacity-50 pt-16 flex flex-col justify-center items-center"
	>
		<!-- Container -->
		<section
			style="backdrop-filter: blur(10px)"
			class="min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
		>
			<button class="bg-gray1 dark:bg-gray5 focus:outline-none mb-5 rounded-full p-1" @click="$emit(`close`)">
				<CloseIcon />
			</button>
			<article>
				<div class="modal-content">
					<p>{{ bio }}</p>
				</div>
			</article>
		</section>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CloseIcon from '@/components/icons/X.vue'

export default Vue.extend({
	components: { CloseIcon },
	props: {
		bio: {
			type: String,
			required: true,
		},
	},
	created() {
		/* eslint-disable no-console */
		console.log(this.bio)
	},
	methods: {
		closePopup(): void {
			this.$router.go(-1)
		},
	},
})
</script>
<style>
.modal-content {
	display: block;
	max-width: 100%;
	height: 100%;
	max-height: 88%;
}

/* Add Animation */
.modal-content,
#caption {
	animation-name: zoom;
	animation-duration: 0.6s;
}
</style>
