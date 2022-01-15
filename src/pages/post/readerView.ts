import Vue from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

import IpfsImage from '@/components/IpfsImage.vue'

import { ipfsImgExtension, markedRenderer } from '@/plugins/markedExtensions'
import { transformPostToTemplate } from '@/plugins/QuillImage'

marked.use({ renderer: markedRenderer, extensions: [ipfsImgExtension] })

function sanitizeHTML(input: string) {
	return DOMPurify.sanitize(input, {
		USE_PROFILES: { html: true },
		ALLOWED_TAGS: [`pre`],
		ADD_TAGS: [`ipfsimage`],
		ADD_ATTR: [`cid`],
	})
}

export default function readerViewFactory(markdown: string, postImages?: Array<string>) {
	const html = marked.parse(markdown)
	const sanitizedHtml = sanitizeHTML(html)
	const template = `<div>${transformPostToTemplate(sanitizedHtml, postImages)}</div>`

	return Vue.component(`ReaderView`, {
		components: { IpfsImage },
		template,
	})
}
