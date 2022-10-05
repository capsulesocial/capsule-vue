import TurndownService from 'turndown'
import { strikethrough } from 'turndown-plugin-gfm'

// rules
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
			return `<ipfsimage alt="${node.getAttribute(`alt`)}" cid="${node.getAttribute(`alt`)}"></ipfsimage>`
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

const turndownService = new TurndownService()
turndownService.addRule(`codeblock`, preRule)
turndownService.addRule(`ipfsimage`, ipfsImageRule)
turndownService.addRule(`listRule`, listRule)
turndownService.use(strikethrough)

export default turndownService
