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
import { IBackground, backgrounds } from '@/config/backgrounds'

type BackgroundURLFunction = (id?: string) => IBackground

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getBGImage: BackgroundURLFunction
	}
}

const getBGImage: BackgroundURLFunction = (id?: string) => {
	const bg = backgrounds.filter((background) => {
		return background.id === id
	})

	if (bg.length < 1) {
		return backgrounds[0]
	}
	return bg[0]
}

const backgroundPlugin: Plugin = (_context, inject) => {
	inject(`getBGImage`, getBGImage)
}

export default backgroundPlugin
