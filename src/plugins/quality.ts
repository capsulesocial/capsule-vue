import type { Plugin } from '@nuxt/types'

// Declare types of functions
type Id = (input: string) => string | boolean
type Email = (input: string) => string | boolean
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
	if (input === `` || input === null) {
		return `Missing ID!`
	}
	if (input.length < 3) {
		return `ID must be longer than 3 characters`
	}
	if (input.length > 16) {
		return `ID must be 16 characters or less`
	}
	if (!/^\w{3,16}$/.test(input)) {
		return `ID must only contain numbers, letters, and underscores`
	}
	return true
}

const qualityEmail: Email = (input) => {
	if (input === `` || input === null) {
		return `Missing Email!`
	}
	if (!/\S+@\S+\.\S+/.test(input)) {
		return `Invalid email syntax!`
	}
	return true
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
