import type { Plugin } from '@nuxt/types'

type typeColor = (color: string) => void

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$setColor: typeColor
	}
}

const setColor: typeColor = (color) => {
	if (color === `Green`) {
		document.documentElement.classList.add(`green`)
		document.documentElement.classList.remove(`orange`)
		document.documentElement.classList.remove(`blue`)
		document.documentElement.classList.remove(`pink`)
	}
	if (color === `Orange`) {
		document.documentElement.classList.add(`orange`)
		document.documentElement.classList.remove(`green`)
		document.documentElement.classList.remove(`blue`)
		document.documentElement.classList.remove(`pink`)
	}
	if (color === `Blue`) {
		document.documentElement.classList.add(`blue`)
		document.documentElement.classList.remove(`orange`)
		document.documentElement.classList.remove(`green`)
		document.documentElement.classList.remove(`pink`)
	}
	if (color === `Pink`) {
		document.documentElement.classList.add(`pink`)
		document.documentElement.classList.remove(`orange`)
		document.documentElement.classList.remove(`blue`)
		document.documentElement.classList.remove(`green`)
	}
}

const colorPlugin: Plugin = (_context, inject) => {
	inject(`setColor`, setColor)
}

export default colorPlugin
