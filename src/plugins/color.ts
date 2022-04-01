import type { Plugin } from '@nuxt/types'
import VueInstance from 'vue'

type SetColor = (newColor?: `Green` | `Orange` | `Blue` | `Pink` | `Yellow`) => void

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$setColor: SetColor
		$color: { hex: string }
	}
}

const colorPlugin: Plugin = (_context, inject) => {
	const state: { hex: string } = VueInstance.observable({ hex: `#7097ac` })

	const setColor: SetColor = (newColor = `Green`) => {
		switch (newColor) {
			case `Green`:
				document.documentElement.classList.add(`green`)
				document.documentElement.classList.remove(`orange`)
				document.documentElement.classList.remove(`blue`)
				document.documentElement.classList.remove(`pink`)
				document.documentElement.classList.remove(`yellow`)
				state.hex = `#7097ac`
				break
			case `Orange`:
				document.documentElement.classList.add(`orange`)
				document.documentElement.classList.remove(`green`)
				document.documentElement.classList.remove(`blue`)
				document.documentElement.classList.remove(`pink`)
				document.documentElement.classList.remove(`yellow`)
				state.hex = `#ff4747`
				break
			case `Blue`:
				document.documentElement.classList.add(`blue`)
				document.documentElement.classList.remove(`orange`)
				document.documentElement.classList.remove(`green`)
				document.documentElement.classList.remove(`pink`)
				document.documentElement.classList.remove(`yellow`)
				state.hex = `#396bf8`
				break
			case `Pink`:
				document.documentElement.classList.add(`pink`)
				document.documentElement.classList.remove(`orange`)
				document.documentElement.classList.remove(`blue`)
				document.documentElement.classList.remove(`green`)
				document.documentElement.classList.remove(`yellow`)
				state.hex = `#eb3d7c`
				break
			case `Yellow`:
				document.documentElement.classList.add(`yellow`)
				document.documentElement.classList.remove(`orange`)
				document.documentElement.classList.remove(`blue`)
				document.documentElement.classList.remove(`green`)
				document.documentElement.classList.remove(`pink`)
				state.hex = `#ffcc33`
				break
			default:
				document.documentElement.classList.add(`green`)
				document.documentElement.classList.remove(`orange`)
				document.documentElement.classList.remove(`blue`)
				document.documentElement.classList.remove(`pink`)
				document.documentElement.classList.remove(`yellow`)
				state.hex = `#7097ac`
				break
		}
	}

	inject(`setColor`, setColor)
	inject(`color`, state)
}

export default colorPlugin
