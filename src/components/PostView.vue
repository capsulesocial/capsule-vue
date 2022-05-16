<template>
	<div>
		<div v-html="htmlContent"></div>
		<portal to="postPage">
			<ImagePopup v-if="displayImagePopup" :image="clickedImage" @close="displayImagePopup = false" />
		</portal>
	</div>
</template>

<script lang="ts">
import DOMPurify from 'dompurify'
import { marked } from 'marked'
import Vue from 'vue'
import { transformPostToTemplate } from '../pages/post/readerExtensions'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import ImagePopup from '@/components/popups/Image.vue'

interface IData {
	clickedImage: null | string
	imageError: null | string
	displayImagePopup: boolean
}

function sanitizeHTML(input: string) {
	DOMPurify.addHook(`afterSanitizeAttributes`, (node: Element) => {
		// set all elements owning target to target=_blank
		if ((`target` in node) as unknown as Element) {
			node.setAttribute(`target`, `_blank`)
			node.setAttribute(`rel`, `noopener`)
		}
	})
	return DOMPurify.sanitize(input, {
		USE_PROFILES: { html: true },
		ALLOWED_TAGS: [`pre`],
		ADD_ATTR: [`cid`],
	})
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
		postImages: {
			type: Array as () => string[],
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
			const html = marked.parse(this.content)
			const transformedHtml = transformPostToTemplate(html, this.postImages)
			const sanitizedHtml = sanitizeHTML(transformedHtml)
			return sanitizedHtml
		},
	},
	mounted() {
		const images = this.$el.querySelectorAll(`img`)
		images.forEach((image) => {
			this.lazyLoad(image)
		})
	},
	methods: {
		openImagePopup(image: HTMLImageElement) {
			this.clickedImage = image.src
			this.displayImagePopup = true
		},
		lazyLoad(image: HTMLImageElement) {
			const cid = image.getAttribute(`cid`)
			if (!cid) {
				this.$toastError(`Invalid image`)
				return
			}
			getPhotoFromIPFS(cid)
				.then((dataUrl) => {
					if (!dataUrl.startsWith(`data:image`)) {
						// To prevent linking to a malicious third party image
						this.$toastError(`Ipfs image with invalid mimetype`)
						return
					}

					image.src = dataUrl
					image.onclick = () => {
						this.openImagePopup(image)
					}
				})
				.catch((error) => {
					this.imageError = error
					this.$toastError(`error malformed image ${error.message}`)
				})
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