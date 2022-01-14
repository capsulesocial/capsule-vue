import hljs from 'highlight.js'
import { marked } from 'marked'

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
}

export const ipfsImgExtension = {
	name: `ipfsImg`,
	level: `inline`,
	start(src: string) {
		return src.match(/\\\[ipfs\\_img/)?.index
	},
	tokenizer(src: string) {
		const ipfsImgRule = /\\\[ipfs\\_img [^>]*cid="[^"]*"\\]/
		const ipfsCidRule = /cid="([A-Za-z0-9]*)"/
		const ipfsImgMatch = ipfsImgRule.exec(src)
		const ipfsCidMatch = ipfsCidRule.exec(src)
		if (ipfsImgMatch && ipfsCidMatch) {
			return {
				type: `ipfsImg`,
				raw: ipfsImgMatch[0],
				cid: ipfsCidMatch[1],
			}
		}

		return null
	},
	renderer(token: any) {
		return `<ipfsimage alt="${token.cid}" class="ipfs_img" cid="${token.cid}" />`
	},
}
