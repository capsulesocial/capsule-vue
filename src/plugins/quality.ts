import type { Plugin } from '@nuxt/types'

// Declare types of functions
type Id = (input: string) => string | boolean
type Email = (input: string) => string | boolean
type URL = (url: string) => boolean
type Text = (input: string) => boolean

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$qualityID: Id
		$qualityEmail: Email
		$qualityURL: URL
		$qualityText: Text
	}
}

const qualityID: Id = (input) => {
	if (input === `` || input === null) {
		return `Missing ID!`
	}
	if (input.length < 3) {
		return `ID must be > 3 characters`
	}
	if (input.length > 25) {
		return `ID must be <= 25 characters`
	}
	if (input.search(/\s/) !== -1) {
		return `ID must not contain a space!`
	}
	if (!/^[a-zA-Z0-9]+$/.test(input)) {
		return `ID must only contain numbers and letters`
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
	inject(`qualityID`, qualityID)
	inject(`qualityEmail`, qualityEmail)
	inject(`qualityURL`, qualityURL)
	inject(`qualityText`, qualityText)
}

export default qualityPlugin
