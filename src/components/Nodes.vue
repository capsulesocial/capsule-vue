<template>
	<!-- Peered nodes -->
	<div class="flex items-center bg-gray1 px-3 rounded-lg">
		<span class="text-sm mr-1 text-gray5">n peered nodes</span>
		<CapsuleIcon :shrink="true" />
		<span class="bg-connectGreen rounded-xl w-3 h-3"></span>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import CapsuleIcon from '@/components/icons/Capsule.vue'

export default Vue.extend({
	components: {
		CapsuleIcon,
	},
})
</script>