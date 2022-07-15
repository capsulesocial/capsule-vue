<template>
	<div>
		<div v-html="htmlContent"></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import { afterSanitizeAttrsHook, sanitizeHtml } from '@/plugins/helpers'

const ALLOWED_TAGS = [
	`pre`,
	`img`,
	`p`,
	`code`,
	`ol`,
	`li`,
	`strong`,
	`em`,
	`u`,
	`del`,
	`blockquote`,
	`h1`,
	`h2`,
	`h3`,
	`h4`,
	`h5`,
	`a`,
	`span`,
]

const ALLOWED_ATTR = [`class`, `id`, `href`, `src`]

export default Vue.extend({
	props: {
		content: {
			type: String,
			required: true,
		},
	},
	computed: {
		htmlContent() {
			return sanitizeHtml(this.content, ALLOWED_TAGS, ALLOWED_ATTR)
		},
	},
	created() {
		afterSanitizeAttrsHook()
	},
})
</script>
<style>
.ipfs_img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}
</style>
