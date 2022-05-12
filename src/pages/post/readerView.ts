import Vue from 'vue'
import DOMPurify from 'dompurify'
import { marked } from 'marked'

import { transformPostToTemplate, markedRenderer } from './readerExtensions'
import IpfsImage from '@/components/IpfsImage.vue'

marked.use({ renderer: markedRenderer })

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
		ADD_TAGS: [`ipfsimage`],
		ADD_ATTR: [`cid`],
	})
}

export default function readerViewFactory(markdown: string, postImages?: Array<string>) {
	const html = marked.parse(markdown)
	const sanitizedHtml = sanitizeHTML(html)
	const removeExecution = sanitizedHtml.replace(/\{\{(.*)\}\}/g, `<span v-html="\`{{ $1 }}\`" />`)
	const template = `<div>${transformPostToTemplate(removeExecution, postImages)}</div>`
	return Vue.component(`ReaderView`, {
		components: { IpfsImage },
		template,
	})
}
