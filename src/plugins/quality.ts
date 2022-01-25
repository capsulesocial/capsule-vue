import type { Plugin } from '@nuxt/types'

// Declare types of functions
type Id = (input: string) => { error: string } | { success: boolean }
type Email = (input: string) => { error: string } | { success: boolean }
type URL = (url: string) => boolean
type Text = (input: string) => boolean
type PhoneNumber = (input: string) => boolean

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$qualityPhoneNumber: PhoneNumber
		$qualityID: Id
		$qualityEmail: Email
		$qualityURL: URL
		$qualityText: Text
	}
}

const phoneRegex = /^\+(?:[0-9] ?){6,14}[0-9]$/

const qualityPhoneNumber: PhoneNumber = (input: string): boolean => {
	if (input.length < 10) {
		return false
	}
	return phoneRegex.test(input)
}

const qualityID: Id = (input) => {
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

const qualityEmail: Email = (input) => {
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

const qualityURL: URL = (url) => {
	// URL starting with http://, https://, or www.
	const regex = /^((https?:\/\/(www\.)?|www\.)[a-zA-Z0-9][\w+\d+&@\-#/%?=~_|!:,.;+]*)$/gi
	return regex.test(url)
}

const qualityText: Text = (input) => {
	return input.trim().length > 0
}

const qualityPlugin: Plugin = (_context, inject) => {
	inject(`qualityPhoneNumber`, qualityPhoneNumber)
	inject(`qualityID`, qualityID)
	inject(`qualityEmail`, qualityEmail)
	inject(`qualityURL`, qualityURL)
	inject(`qualityText`, qualityText)
}

export default qualityPlugin
