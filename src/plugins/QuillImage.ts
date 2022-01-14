import Quill from 'quill'
import { getPhotoFromIPFS } from '@/backend/photos'
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

export async function parseRegularPost(content: string) {
	const element = document.createElement(`div`)
	element.innerHTML = content
	const images: HTMLImageElement[] = element.getElementsByClassName(`ipfs_img`) as unknown as Array<HTMLImageElement>
	for (const i in images) {
		if (images[i].nodeName === `IMG`) {
			const img: HTMLImageElement = images[i] as HTMLImageElement
			const cid = img.alt
			images[i].src = await getPhotoFromIPFS(cid)
		}
	}
	return element
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
