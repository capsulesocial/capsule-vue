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
	}
	if (color === `Orange`) {
		document.documentElement.classList.add(`orange`)
	}
	if (color === `Blue`) {
		document.documentElement.classList.add(`blue`)
	}
	if (color === `Pink`) {
		document.documentElement.classList.add(`pink`)
	}
}

const colorPlugin: Plugin = (_context, inject) => {
	inject(`setColor`, setColor)
}

export default colorPlugin
