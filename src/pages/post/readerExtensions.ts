// Turndown

import hljs from 'highlight.js/lib/common'
import { marked } from 'marked'
import { sanitizeHTML } from './readerView'

// Marked

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
}

// Misc

const imgRegexp = (cid: string) =>
	new RegExp(
		`<ipfsimage ((alt="${cid}")|(cid="${cid}")|(class="ipfs_img"))\\s+((alt="${cid}")|(class="ipfs_img")|(cid="${cid}"))\\s+((alt="${cid}")|(class="ipfs_img")|(cid="${cid}"))></ipfsimage>`,
		`g`,
	)

const blankImage = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAIAAAABCAQAAABeK7cBAAAADUlEQVR42mM8fIaBAQAFegGROSevSQAAAABJRU5ErkJggg==`

export function transformPostToTemplate(body: string, postImages?: Array<string>) {
	if (!postImages) {
		return body
	}
	for (const p of postImages) {
		const sanP = sanitizeHTML(p)
		body = body.replace(imgRegexp(sanP), `<img alt="${sanP}" class="ipfs_img" cid="${sanP}" src="${blankImage}" />`)
	}
	return body
}
