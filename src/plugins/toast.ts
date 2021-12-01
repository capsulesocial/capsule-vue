import type { Plugin } from '@nuxt/types'
import Toastify from 'toastify-js'

type Success = (text: string) => void
type Warning = (text: string) => void
type Error = (text: string) => void
type Message = (text: string) => void

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$toastSuccess: Success
		$toastWarning: Warning
		$toastError: Error
		$toastMessage: Message
	}
}

// Use HTML DOM styles: https://www.w3schools.com/jsref/dom_obj_style.asp

const toastSuccess: Success = (text: string): void => {
	Toastify({
		text,
		duration: 3000,
		close: true,
		gravity: `top`, // `top` or `bottom`
		position: `center`, // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		// @ts-ignore
		style: {
			background: `rgba(31, 125, 173, .1)`,
			border: `2px solid`,
			borderColor: `#1F7DAD`,
			borderRadius: `0.5rem`,
			color: `#1F7DAD`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			zIndex: `999`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastWarning: Warning = (text: string): void => {
	Toastify({
		text,
		duration: 3000,
		gravity: `top`, // `top` or `bottom`
		position: `left`, // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		// @ts-ignore
		style: {
			background: `rgba(240, 183, 133, .1)`,
			border: `2px solid`,
			borderColor: `#F0B785`,
			borderRadius: `0.5rem`,
			color: `#F0B785`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			zIndex: `999`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastError: Error = (text: string): void => {
	Toastify({
		text,
		duration: 3000,
		gravity: `top`, // `top` or `bottom`
		position: `left`, // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		// @ts-ignore
		style: {
			background: `rgba(238, 31, 99, .1)`,
			border: `2px solid`,
			borderColor: `#EE1F63`,
			borderRadius: `0.5rem`,
			color: `#EE1F63`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			zIndex: `999`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastMessage: Message = (text: string): void => {
	Toastify({
		text,
		duration: 3000,
		gravity: `top`, // `top` or `bottom`
		position: `left`, // `left`, `center` or `right`
		stopOnFocus: true, // Prevents dismissing of toast on hover
		// @ts-ignore
		style: {
			background: `rgba(104, 104, 104, .1)`,
			border: `2px solid`,
			borderColor: `#686868`,
			borderRadius: `0.5rem`,
			color: `#686868`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			zIndex: `999`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastPlugin: Plugin = (_context, inject) => {
	inject(`toastSuccess`, toastSuccess)
	inject(`toastWarning`, toastWarning)
	inject(`toastError`, toastError)
	inject(`toastMessage`, toastMessage)
}

export default toastPlugin
