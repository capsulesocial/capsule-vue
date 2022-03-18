// Turndown

import hljs from 'highlight.js/lib/common'
import { marked } from 'marked'

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
	if (!postImages) {
		return body
	}
	for (const p of postImages) {
		body = body.replace(imgRegexp(p), `<IpfsImage alt="${p}" class="ipfs_img" :cid="'${p}'" />`)
	}
	return body
}
