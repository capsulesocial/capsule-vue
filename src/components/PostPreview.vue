<template>
	<div>
		<div v-html="htmlContent"></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import hljs from 'highlight.js'
import { afterSanitizeAttrsHook, BASE_ALLOWED_ATTRS, BASE_ALLOWED_TAGS, sanitizeHtml } from '@/plugins/helpers'

const ALLOWED_TAGS = BASE_ALLOWED_TAGS
const ALLOWED_ATTR = [...BASE_ALLOWED_ATTRS, `src`]

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
	mounted() {
		document.querySelectorAll(`pre`).forEach((block) => {
			hljs.highlightBlock(block)
		})
	},
})
</script>
<style>
@import 'https://cdn.jsdelivr.net/gh/highlightjs/cdn-release@11.6.0/build/styles/monokai-sublime.min.css';
.editable img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}

pre {
	white-space: pre-wrap;
	margin-bottom: 5px;
	margin-top: 5px;
	padding: 5px 10px;
	border-radius: 3px;
}

pre.ql-syntax {
	background-color: rgb(35, 36, 31);
	color: rgb(248, 248, 242);
	overflow: visible;
}
</style>
