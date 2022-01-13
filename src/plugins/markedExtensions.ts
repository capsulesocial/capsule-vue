import hljs from 'highlight.js'
import { marked } from 'marked'

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
	image(href: string | null, title: string | null, text: string | null) {
		return `<img src="${href}" alt="${title}" alt="${text}">`
	},
}

export const ipfsImgExtension = {
	name: `ipfsImg`,
	level: `inline`,
	start(src: string) {
		return src.match(/\\\[ipfs\\_img/)?.index
	},
	// eslint-disable-next-line consistent-return
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
	},
	renderer(token: any) {
		return `<img alt="${token.cid}" class="ipfs_img" />`
	},
}
