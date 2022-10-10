import type { RangeStatic, Quill } from 'quill'

export type EditorImages = Map<string, { key: string; counter: string } | {}>

// Quill
export function counterModuleFactory(
	QuillClass: typeof Quill,
	onTextChange: () => void,
	onSelectionChange: (range: RangeStatic) => void,
	onEditorChange: (eventName: string, ...args: any[]) => void,
) {
	const Module = QuillClass.import(`core/module`)
	return class CounterModule extends Module {
		constructor(quill: Quill) {
			super()
			quill.on(`text-change`, onTextChange)
			quill.on(`selection-change`, onSelectionChange)
			quill.on(`editor-change`, onEditorChange)
		}
	}
}

export function ImageBlotFactory(QuillClass: typeof Quill) {
	const BlockEmbed = QuillClass.import(`blots/block/embed`)
	return class ImageBlot extends BlockEmbed {
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
}

// Misc

const imgRegexp = (cid: string) =>
	new RegExp(`<ipfsimage ((alt="${cid}" cid="${cid}")|(cid="${cid}" alt="${cid}"))></ipfsimage>`, `g`)

export function createEditorImageSet(content: string, uploadedImages: EditorImages) {
	const usedImages: EditorImages = new Map()
	uploadedImages.forEach((val, cid) => {
		if (!content.match(imgRegexp(cid))) {
			return
		}
		usedImages.set(cid, val)
	})

	return usedImages
}
