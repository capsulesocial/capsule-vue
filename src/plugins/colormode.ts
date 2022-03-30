import type { Plugin } from '@nuxt/types'
import VueInstance from 'vue'

type SetColorMode = (newMode?: `Dark` | `Light` | `OS`) => void

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$setColorMode: SetColorMode
		$colorMode: { dark: boolean }
	}
}

const colorModePlugin: Plugin = (_context, inject) => {
	const state: { dark: boolean } = VueInstance.observable({ dark: false })
	let mode: `Dark` | `Light` | `OS` = `OS`

	const darkEventListener = (e: MediaQueryListEvent) => {
		if (e.matches && mode === `OS`) {
			state.dark = true
			document.documentElement.classList.add(`dark`)
		}
	}

	const lightEventListener = (e: MediaQueryListEvent) => {
		if (e.matches && mode === `OS`) {
			state.dark = false
			document.documentElement.classList.remove(`dark`)
		}
	}

	window.matchMedia(`(prefers-color-scheme: dark)`).addEventListener(`change`, darkEventListener)
	window.matchMedia(`(prefers-color-scheme: light)`).addEventListener(`change`, lightEventListener)

	const setColorMode: SetColorMode = (newMode = `OS`) => {
		mode = newMode
		switch (mode) {
			case `Dark`:
				document.documentElement.classList.add(`dark`)
				break
			case `Light`:
				document.documentElement.classList.remove(`dark`)
				break
			case `OS`:
				if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
					document.documentElement.classList.add(`dark`)
				} else if (window.matchMedia(`(prefers-color-scheme: light)`).matches) {
					document.documentElement.classList.remove(`dark`)
				}
				break
			default:
				document.documentElement.classList.remove(`dark`)
				break
		}

		if (document.documentElement.classList.contains(`dark`)) {
			state.dark = true
		} else {
			state.dark = false
		}
	}

	inject(`setColorMode`, setColorMode)
	inject(`colorMode`, state)
}

export default colorModePlugin
