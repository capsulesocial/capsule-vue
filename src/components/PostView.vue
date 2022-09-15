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
import type { PropType } from 'vue'
import { marked } from 'marked'
import { markedRenderer, transformPostToHTML } from '../pages/post/readerExtensions'
import ImagePopup from '@/components/popups/Image.vue'
import { decryptData } from '@/backend/crypto'
import { IPostImageKey } from '@/backend/post'
import { isValidPhoto, getPhotoFromIPFS } from '@/backend/getPhoto'
import { afterSanitizeAttrsHook, BASE_ALLOWED_ATTRS, BASE_ALLOWED_TAGS, sanitizeHtml } from '@/plugins/helpers'

const ALLOWED_TAGS = [...BASE_ALLOWED_TAGS, `ipfsimage`]
const ALLOWED_ATTR = [...BASE_ALLOWED_ATTRS, `cid`, `alt`]

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
		postImages: {
			type: Array as PropType<string[] | undefined>,
			default: () => [],
		},
		encrypted: { type: Boolean as PropType<boolean | undefined>, default: () => false },
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
			const sanitizedHtml = sanitizeHtml(html, ALLOWED_TAGS, ALLOWED_ATTR)
			return transformPostToHTML(sanitizedHtml, this.postImages)
		},
	},
	created() {
		marked.use({ renderer: markedRenderer })
		afterSanitizeAttrsHook()
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
.editable img {
	display: block;
	margin-left: auto;
	margin-right: auto;
	width: 100%;
	margin-top: 10px;
	margin-bottom: 10px;
	cursor: pointer;
}
</style>
