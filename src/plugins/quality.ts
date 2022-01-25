import type { Plugin } from '@nuxt/types'

// Declare types of functions
type StringInputCheck = (input: string) => { error: string } | { success: boolean }
type Text = (input: string) => boolean

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$qualityID: StringInputCheck
		$qualityEmail: StringInputCheck
		$qualityURL: StringInputCheck
		$qualityText: Text
	}
}

const qualityID: StringInputCheck = (input) => {
	const blockListed = new Set<string>([`root`, `support`, `admin`])
	if (input === `` || input === null) {
		return { error: `Missing ID!` }
	}
	if (input.length < 3) {
		return { error: `ID must be longer than 3 characters` }
	}
	if (input.length > 16) {
		return { error: `ID must be 16 characters or less` }
	}
	if (!/^\w{3,16}$/.test(input)) {
		return { error: `ID must only contain numbers, letters, and underscores` }
	}
	if (blockListed.has(input)) {
		return { error: `ID unavailable` }
	}
	if (input.includes(`capsule`)) {
		return { error: `ID cannot contain capsule as a keyword` }
	}
	return { success: true }
}

const qualityEmail: StringInputCheck = (input) => {
	if (input === `` || input === null) {
		return { error: `Missing Email!` }
	}

	const regex =
		// eslint-disable-next-line no-control-regex
		/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21\x23-\x5B\x5D-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0B\x0C\x0E-\x1F\x21-\x5A\x53-\x7F]|\\[\x01-\x09\x0B\x0C\x0E-\x7F])+)\])/

	if (!regex.test(input)) {
		return { error: `Invalid email syntax!` }
	}
	return { success: true }
}

const qualityURL: StringInputCheck = (url) => {
	// URL starting with http://, https://, or www.
	const regex = /^((https?:\/\/(www\.)?|www\.)[a-zA-Z0-9][\w+\d+&@\-#/%?=~_|!:,.;+]*)$/gi

	if (!regex.test(url)) {
		return { error: `Invalid URL` }
	}

	return { success: true }
}

const qualityText: Text = (input) => {
	return input.trim().length > 0
}

const qualityPlugin: Plugin = (_context, inject) => {
	inject(`qualityID`, qualityID)
	inject(`qualityEmail`, qualityEmail)
	inject(`qualityURL`, qualityURL)
	inject(`qualityText`, qualityText)
}

export default qualityPlugin
