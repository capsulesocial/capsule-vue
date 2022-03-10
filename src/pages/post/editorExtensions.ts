import Quill from 'quill'
import TurndownService from 'turndown'
import hljs from 'highlight.js'
import { marked } from 'marked'

// Marked

export const markedRenderer: marked.RendererObject = {
	code(src: string) {
		const highlightedCode = hljs.highlightAuto(src).value
		return `<pre><code class="hljs">${highlightedCode}</code></pre>`
	},
}

// Quill

const BlockEmbed = Quill.import(`blots/block/embed`)

export class ImageBlot extends BlockEmbed {
	static blotName = `image`
	static tagName = `img`

	static create(value: { alt: string; url: string; ipfsimage: string }) {
		const node = super.create()
		node.setAttribute(`alt`, value.alt)
		node.setAttribute(`src`, value.url)
		return node
	}

	static value(node: { getAttribute: (arg0: string) => any }) {
		return {
			alt: node.getAttribute(`alt`),
			url: node.getAttribute(`src`),
		}
	}
}

// Turndown

export const preRule: TurndownService.Rule = {
	filter: [`pre`],
	replacement: (_, node) => {
		// eslint-disable-next-line quotes
		return '```\n' + node.textContent + '```'
	},
}

export const ipfsImageRule: TurndownService.Rule = {
	filter: [`img`],
	replacement: (_, node) => {
		if (`getAttribute` in node) {
			return `<ipfsimage alt="${node.getAttribute(`alt`)}" class="ipfs_img" cid="${node.getAttribute(
				`alt`,
			)}"></ipfsimage>`
		}

		throw new Error(`getAttributes does not exist on node`)
	},
}

// Misc

export const imgRegexp = (cid: string) =>
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

export function createPostImagesSet(content: string, uploadedImages: Set<string>) {
	const usedImages: Set<string> = new Set()
	uploadedImages.forEach((cid) => {
		if (!content.match(imgRegexp(cid))) {
			return
		}
		usedImages.add(cid)
	})

	return usedImages
}
