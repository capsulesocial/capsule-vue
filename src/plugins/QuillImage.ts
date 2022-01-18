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
		const regex = /<ipfsimage \w*="\w*" \w*="\w*" \w*="\w*"><\/ipfsimage>/gm
		body = body.replace(new RegExp(regex, `g`), `<IpfsImage alt="${p}" class="ipfs_img" :cid="'${p}'" />`)
	}
	return body
}
