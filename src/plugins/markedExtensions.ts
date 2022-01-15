import hljs from 'highlight.js'
import { marked } from 'marked'

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
}

export const parseIpfsImage = (src: string): Array<string> => {
	const regex = /cid="([A-Za-z0-9]*)"/gm
	const str = src
	const cids: Array<string> = []
	let m: RegExpExecArray | null = null

	while ((m = regex.exec(str)) !== null) {
		// This is necessary to avoid infinite loops with zero-width matches
		if (m.index === regex.lastIndex) {
			regex.lastIndex++
		}

		// The result can be accessed through the `m`-variable.
		m.forEach((match, groupIndex) => {
			if (groupIndex === 1) {
				cids.push(match)
			}
		})
	}

	return cids
}

export const ipfsImgExtension = {
	name: `ipfsImg`,
	level: `inline`,
	start(src: string) {
		return src.match(/\\\[ipfs\\_img/)?.index
	},
	tokenizer(src: string) {
		const ipfsImgRule = /\\\[ipfs\\_img [^>]*cid="[^"]*"\\]/
		const ipfsCidRule = /cid="([A-Za-z0-9]*)"/gm
		const ipfsImgMatch = ipfsImgRule.exec(src)
		const ipfsCidMatch = ipfsCidRule.exec(src)
		if (ipfsImgMatch && ipfsCidMatch) {
			return {
				type: `ipfsImg`,
				raw: ipfsImgMatch[0],
				cids: parseIpfsImage(src),
			}
		}

		return null
	},
	renderer(token: any) {
		let content = ``
		for (const cid of token.cids) {
			content += `<ipfsimage alt="${cid}" class="ipfs_img" cid="${cid}"></ipfsimage>`
		}
		return content
	},
}
