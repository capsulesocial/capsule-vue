<template>
	<div>
		<div v-html="htmlContent"></div>
		<portal to="postPage">
			<ImagePopup v-if="displayImagePopup" :image="clickedImage" @close="displayImagePopup = false" />
		</portal>
	</div>
</template>

<script lang="ts">
import Vue from 'vue'
import DOMPurify from 'dompurify'
import ImagePopup from '@/components/popups/Image.vue'

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

interface IData {
	clickedImage: null | string
	imageError: null | string
	displayImagePopup: boolean
}

export default Vue.extend({
	components: {
		ImagePopup,
	},
	props: {
		content: {
			type: String,
			required: true,
		},
	},
	data(): IData {
		return {
			clickedImage: null,
			imageError: null,
			displayImagePopup: false,
		}
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
	mounted() {
		const images = this.$el.querySelectorAll(`img`)
		images.forEach((image) => {
			image.onclick = () => {
				this.openImagePopup(image)
			}
		})
	},
	methods: {
		openImagePopup(image: HTMLImageElement) {
			this.clickedImage = image.src
			this.displayImagePopup = true
		},
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
