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
		duration: 4000,
		gravity: `bottom`, // `top` or `bottom`
		position: `left`,
		avatar: require(`~/assets/images/util/success.png`),
		// @ts-ignore
		style: {
			background: `rgba(233, 242, 247, .9)`,
			border: `1px solid`,
			borderColor: `#1F7DAD`,
			borderRadius: `0.5rem`,
			fontSize: `0.875rem`,
			color: `#1F7DAD`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.8rem`,
			paddingBottom: `0.9rem`,
			position: `fixed`,
			right: `7.4%`,
			marginBottom: `1%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastWarning: Warning = (text: string): void => {
	Toastify({
		text,
		duration: 4000,
		gravity: `top`, // `top` or `bottom`
		position: `left`,
		avatar: require(`~/assets/images/util/warning.png`),
		// @ts-ignore
		style: {
			background: `rgba(240, 183, 133, .1)`,
			border: `1px solid`,
			borderColor: `#F0B785`,
			borderRadius: `0.5rem`,
			color: `#F0B785`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			left: `50%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

export const toastError: Error = (text: string): void => {
	Toastify({
		text,
		duration: 4000,
		gravity: `top`, // `top` or `bottom`
		position: `left`,
		avatar: require(`~/assets/images/util/error.png`),
		// @ts-ignore
		style: {
			background: `rgba(238, 31, 99, .1)`,
			border: `1px solid`,
			borderColor: `#EE1F63`,
			borderRadius: `0.5rem`,
			color: `#EE1F63`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			left: `50%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
		},
		onClick() {}, // Callback after click
	}).showToast()
}

const toastMessage: Message = (text: string): void => {
	Toastify({
		text,
		duration: 4000,
		gravity: `top`, // `top` or `bottom`
		position: `left`,
		stopOnFocus: true, // Prevents dismissing of toast on hover
		avatar: require(`~/assets/images/util/message.png`),
		// @ts-ignore
		style: {
			background: `rgba(104, 104, 104, .1)`,
			border: `1px solid`,
			borderColor: `#686868`,
			borderRadius: `0.5rem`,
			color: `#686868`,
			paddingLeft: `1rem`,
			paddingRight: `1rem`,
			paddingTop: `0.5rem`,
			paddingBottom: `0.5rem`,
			position: `fixed`,
			left: `50%`,
			zIndex: `999`,
			display: `flex`,
			alignItems: `center`,
			justifyContent: `center`,
			flexDirection: `row-reverse`,
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
