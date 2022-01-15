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

export function transformEditorPost(body: string) {
	const images = body.match(/<img.*?[^>]+>/gm)

	if (!images) {
		return body
	}

	const parser = new DOMParser()

	for (const i of images) {
		const img = parser.parseFromString(i, `text/html`)
		const cid = img.querySelector(`img`)?.getAttribute(`alt`)
		body = body.replace(i, `[ipfs_img cid="${cid}"]`)
	}

	return body
}

export function transformPostToTemplate(body: string, postImages?: Array<string>) {
	if (!postImages) {
		return body
	}
	for (const p of postImages) {
		body = body.replace(
			new RegExp(`<ipfsimage cid="${p}" class="ipfs_img" alt="${p}"></ipfsimage>`, `g`),
			`<IpfsImage alt="${p}" class="ipfs_img" :cid="'${p}'" />`,
		)
	}
	return body
}
