import type { Plugin } from '@nuxt/types'

type dateString = (date: Date, hideYear?: boolean, preformattedDate?: string | null) => string
type dateFormat = (input: object | Date | number) => string
type isErrorFormat = (obj: Record<string, unknown>) => obj is { error: string }

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getFormat: dateString
		$formatDate: dateFormat
		$isError: isErrorFormat
	}
}

const MONTH_NAMES = [`Jan`, `Feb`, `Mar`, `Apr`, `May`, `Jun`, `Jul`, `Aug`, `Sep`, `Oct`, `Nov`, `Dec`]

const getFormat: dateString = (date, hideYear = false, preformattedDate = null) => {
	const day = date.getDate()
	const month = MONTH_NAMES[date.getMonth()]
	const year = date.getFullYear()
	const hours = date.getHours()
	const minutes = date.getMinutes()

	let minutesString = `${minutes}`
	if (minutes < 10) {
		// Adding leading zero to minutes
		minutesString = `0${minutes}`
	}

	if (preformattedDate) {
		// Today at 4:20
		return `${preformattedDate} at ${hours}:${minutesString}`
	}

	if (hideYear) {
		return `${day} ${month} at ${hours}:${minutesString}`
	}

	return `${day} ${month} ${year} at ${hours}:${minutesString}`
}

const formatDate = (input: string | Date | number) => {
	const date = input instanceof Date ? input : new Date(input)
	const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
	const today = new Date()
	const seconds = Math.round((today.getTime() - date.getTime()) / 1000)

	if (seconds < 5) {
		return `now`
	}
	if (seconds < 60) {
		return `${seconds} seconds ago`
	}

	const minutes = Math.round(seconds / 60)
	if (minutes < 60) {
		return `${minutes} minutes ago`
	}

	const yesterday = new Date(today.getTime() - DAY_IN_MS)
	const isToday = today.toDateString() === date.toDateString()
	const isYesterday = yesterday.toDateString() === date.toDateString()
	if (isToday) {
		return getFormat(date, true, `Today`)
	}
	if (isYesterday) {
		return getFormat(date, true, `Yesterday`)
	}

	const isThisYear = today.getFullYear() === date.getFullYear()
	if (isThisYear) {
		return getFormat(date, true)
	}

	return getFormat(date)
}

const isError = (obj: Record<string, unknown>) => {
	return `error` in obj
}

const helperPlugin: Plugin = (_context, inject) => {
	inject(`getFormat`, getFormat)
	inject(`formatDate`, formatDate)
	inject(`isError`, isError)
}

export default helperPlugin
