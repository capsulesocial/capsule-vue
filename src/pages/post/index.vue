<template>
	<main class="w-full h-auto">
		<PostEditor />
	</main>
</template>

<script lang="ts">
import Vue from 'vue'
import PostEditor from '@/components/post/Editor.vue'
export default Vue.extend({
	components: {
		PostEditor,
	},
	layout: `Editor`,
})
</script>
