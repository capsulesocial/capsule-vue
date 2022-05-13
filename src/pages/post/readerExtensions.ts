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

export function transformPostToTemplate(body: string, postImages?: Array<string>) {
	let removeExecution = body.replace(/\{\{(.*)\}\}/g, (_, p1) => `<span v-html="\`{{ ${sanitizeHTML(p1)} }}\`" />`)
	if (!postImages) {
		return removeExecution
	}
	for (const p of postImages) {
		removeExecution = removeExecution.replace(
			imgRegexp(p),
			`<IpfsImage alt="${sanitizeHTML(p)}" class="ipfs_img" :cid="'${sanitizeHTML(p)}'" />`,
		)
	}
	return removeExecution
}
