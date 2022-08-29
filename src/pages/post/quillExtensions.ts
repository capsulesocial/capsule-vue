/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
import type { RangeStatic, Quill } from 'quill'
import TurndownService from 'turndown'

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
	filter: [`ul`, `ol`, `li`],
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

export function createPostImagesSet(content: string, uploadedImages: Map<string, { key?: string; counter?: string }>) {
	const usedImages: Map<string, { key?: string; counter?: string }> = new Map()
	uploadedImages.forEach((val, cid) => {
		if (!content.match(imgRegexp(cid))) {
			return
		}
		usedImages.set(cid, val)
	})

	return usedImages
}
