import Quill from 'quill'
const BlockEmbed = Quill.import(`blots/block/embed`)

export class ImageBlot extends BlockEmbed {
	static blotName = `image`
	static tagName = `img`

	static create(value: { alt: string; url: string }) {
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

export function transformPostToTemplate(body: string, postImages?: Array<string>) {
	if (!postImages) {
		return body
	}
	for (const p of postImages) {
		body = body.replace(
			new RegExp(
				`<ipfsimage ((alt="${p}")|(cid="${p}")|(class="ipfs_img"))\\s+((alt="${p}")|(class="ipfs_img")|(cid="${p}"))\\s+((alt="${p}")|(class="ipfs_img")|(cid="${p}"))></ipfsimage>`,
				`g`,
			),
			`<IpfsImage alt="${p}" class="ipfs_img" :cid="'${p}'" />`,
		)
	}
	return body
}
