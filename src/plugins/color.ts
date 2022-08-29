/*
 * Copyright (c) 2021-2022 Capsule Social, Inc.
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 *
 */
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
