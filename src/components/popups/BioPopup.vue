<template>
	<div class="popup">
		<!-- Container -->
		<section
			class="popup bg-darkBG dark:bg-gray5 modal-animation fixed top-0 bottom-0 left-0 right-0 z-30 flex h-screen w-full items-center justify-center bg-opacity-50 dark:bg-opacity-50"
		>
			<CloseIcon @click="closePopup" />
			<div
				class="min-h-40 w-full lg:w-600 from-lightBGStart to-lightBGStop dark:from-darkBGStart dark:to-darkBGStop card-animation max-h-90 z-10 overflow-y-auto rounded-lg bg-gradient-to-r px-6 pt-4 pb-2 shadow-lg"
				style="width: 600px; backdrop-filter: blur(5px)"
			>
				<p>{{ bio }}</p>
			</div>
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
