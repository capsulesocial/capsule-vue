import Quill, { RangeStatic } from 'quill'
import TurndownService from 'turndown'

// Quill
export function counterModuleFactory(
	onTextChange: () => void,
	onSelectionChange: (range: RangeStatic) => void,
	onEditorChange: (eventName: string, ...args: any[]) => void,
) {
	const Module = Quill.import(`core/module`)
	return class CounterModule extends Module {
		constructor(quill: Quill) {
			super()
			quill.on(`text-change`, onTextChange)
			quill.on(`selection-change`, onSelectionChange)
			quill.on(`editor-change`, onEditorChange)
		}
	}
}

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

export const listRule: TurndownService.Rule = {
	filter: [`li`],
	replacement: (_, node) => {
		if (`outerHTML` in node) {
			return node.outerHTML
		}
		throw new Error(`outerHTML does not exist on node`)
	},
}

// Misc

const imgRegexp = (cid: string) =>
	new RegExp(
		`<ipfsimage ((alt="${cid}")|(cid="${cid}")|(class="ipfs_img"))\\s+((alt="${cid}")|(class="ipfs_img")|(cid="${cid}"))\\s+((alt="${cid}")|(class="ipfs_img")|(cid="${cid}"))></ipfsimage>`,
		`g`,
	)

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
