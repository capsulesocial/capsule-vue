<template>
	<div>
		<div v-html="htmlContent"></div>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DOMPurify from 'dompurify'

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
			const sanitizedHtml = DOMPurify.sanitize(this.content, {
				ALLOWED_TAGS,
				ALLOWED_ATTR,
			})
			return sanitizedHtml
		},
	},
	created() {
		DOMPurify.addHook(`afterSanitizeAttributes`, (node: Element) => {
			// set all elements owning target and all links to target=_blank
			if (node.getAttribute(`target`) || node.tagName === `A`) {
				node.setAttribute(`target`, `_blank`)
				node.setAttribute(`rel`, `noopener noreferrer`)
			}
		})
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
