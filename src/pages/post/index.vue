<template>
	<main>
		<PostEditor class="w-full h-screen" />
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
