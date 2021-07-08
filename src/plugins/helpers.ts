import type { Plugin } from '@nuxt/types'

type dateString = (date: Date, preformattedDate: any, hideYear: boolean | null) => string
type dateFormat = (input: object | Date) => string

declare module 'vue/types/vue' {
  interface Vue {
    $getFormat: dateString,
    $formatDate: dateFormat
  }
}

const MONTH_NAMES = [
	`January`,
	`February`,
	`March`,
	`April`,
	`May`,
	`June`,
	`July`,
	`August`,
	`September`,
	`October`,
	`November`,
	`December`,
]

const getFormat: dateString = (date, preformattedDate = false, hideYear = false) => {
	const day = date.getDate()
	const month = MONTH_NAMES[date.getMonth()]
	const year = date.getFullYear()
	const hours = date.getHours()
	let minutes:any = date.getMinutes()

	if (minutes < 10) {
		// Adding leading zero to minutes
		minutes = `0${minutes}`
	}
	if (preformattedDate) {
		// Today at 4:20
		return `${preformattedDate} at ${hours}:${minutes}`
	}
	if (hideYear) {
		return `${day}. ${month} at ${hours}:${minutes}`
	}
	return `${day}. ${month} ${year}. at ${hours}:${minutes}`
}

const formatDate = (input) => {
	if (!input) {
		return null
	}
	const date = typeof input === `object` ? input : new Date(input)
	const DAY_IN_MS = 86400000 // 24 * 60 * 60 * 1000
	const today: any = new Date()
	const yesterday = new Date(today - DAY_IN_MS)
	const seconds = Math.round((today - date) / 1000)
	const minutes = Math.round(seconds / 60)
	const isToday = today.toDateString() === date
	const isYesterday = yesterday.toDateString() === date.toDateString()
	const isThisYear = today.getFullYear() === date.getFullYear()

	if (seconds < 5) {
		return `now`
	} else if (seconds < 60) {
		return `${seconds} seconds ago`
	} else if (minutes < 60) {
		return `${minutes} minutes ago`
	} else if (isToday) {
		return getFormat(date, `Today`, false)
	} else if (isYesterday) {
		return getFormat(date, `Yesterday`, false)
	} else if (isThisYear) {
		return getFormat(date, false, true)
	}
	return getFormat(date, false, false)
}

const helperPlugin: Plugin = (_context, inject) => {
	inject(`getFormat`, getFormat)
	inject(`formatDate`, formatDate)
}

export default helperPlugin
