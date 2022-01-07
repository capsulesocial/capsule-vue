import Quill from 'quill'
import { IRegularPost } from '@/backend/post'
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

export async function parseRegularPost(post: IRegularPost) {
	const images = post.content.match(/!\\\[[^\]]*\\\]\((?<filename>.*?)(?="|\))(?<optionalpart>".*")?\)/gm)
	if (images) {
		for (const i of images) {
			const indexOfCid = i.indexOf(`Qm`)
			const cid = i.slice(indexOfCid, 52)
			const photo = await getPhotoFromIPFS(cid)
			post.content = post.content.replace(i, `![](${photo})`)
		}
	}
	return post
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
		body = body.replace(i, `![](${cid})`)
	}

	return body
}
