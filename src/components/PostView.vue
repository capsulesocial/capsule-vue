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
import type { PropType } from 'vue'
import Vue from 'vue'
import { transformPostToTemplate } from '../pages/post/readerExtensions'
import { getPhotoFromIPFS } from '@/backend/getPhoto'
import ImagePopup from '@/components/popups/Image.vue'
import { decryptData } from '@/backend/crypto'
import { IPostImageKey } from '@/backend/post'
import { isValidPhoto } from '@/backend/photos'

interface IData {
	clickedImage: null | string
	imageError: null | string
	displayImagePopup: boolean
}

function setupSanitization() {
	DOMPurify.addHook(`afterSanitizeAttributes`, (node: Element) => {
		// set all elements owning target to target=_blank
		if (node.getAttribute(`target`)) {
			node.setAttribute(`target`, `_blank`)
			node.setAttribute(`rel`, `noopener`)
		}
	})
}

function sanitizeHTML(input: string) {
	return DOMPurify.sanitize(input, {
		USE_PROFILES: { html: true },
		ALLOWED_TAGS: [`pre`],
		ADD_ATTR: [`cid`],
		ADD_TAGS: [`ipfsimage`],
		FORBID_ATTR: [`style`],
		FORBID_TAGS: [`style`, `img`],
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
			type: Array as PropType<string[]>,
			required: true,
		},
		encrypted: { type: Boolean, required: true },
		postImageKeys: {
			type: Array as PropType<Array<IPostImageKey>>,
			default() {
				return []
			},
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
			const sanitizedHtml = sanitizeHTML(html)
			const transformedHtml = transformPostToTemplate(sanitizedHtml, this.postImages)
			return transformedHtml
		},
	},
	mounted() {
		const images = this.$el.querySelectorAll(`img`)
		images.forEach((image) => {
			this.lazyLoad(image)
		})
		setupSanitization()
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
				.then(async (dataUrl) => {
					if (dataUrl.startsWith(`data:encryptedImage:`) && this.encrypted) {
						const keyData = this.postImageKeys.find((k) => k.imageCID === cid)
						if (!keyData) {
							this.$toastError(`key not found to decrypt image!`)
							return
						}

						dataUrl = await decryptData(dataUrl.substring(`data:encryptedImage:`.length), keyData.key, keyData.counter)
					}

					// To prevent linking to a malicious third party image
					if (!isValidPhoto(dataUrl)) {
						this.$toastError(`invalid in-post image`)
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
