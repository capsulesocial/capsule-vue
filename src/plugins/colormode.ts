import type { Plugin } from '@nuxt/types'

type typeColorMode = (mode: string) => void

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$setColorMode: typeColorMode
	}
}

const setColorMode: typeColorMode = (mode) => {
	if (mode === `Dark`) {
		document.documentElement.classList.add(`dark`)
	} else if (mode === `Light`) {
		document.documentElement.classList.remove(`dark`)
	} else {
		if (window.matchMedia(`(prefers-color-scheme: dark)`).matches) {
			document.documentElement.classList.add(`dark`)
		} else if (window.matchMedia(`(prefers-color-scheme: light)`).matches) {
			document.documentElement.classList.remove(`dark`)
		}
		window
			.matchMedia(`(prefers-color-scheme: dark)`)
			.addEventListener(`change`, (e) => e.matches && document.documentElement.classList.add(`dark`))
		window
			.matchMedia(`(prefers-color-scheme: light)`)
			.addEventListener(`change`, (e) => e.matches && document.documentElement.classList.remove(`dark`))
	}
}

const colorModePlugin: Plugin = (_context, inject) => {
	inject(`setColorMode`, setColorMode)
}

export default colorModePlugin
