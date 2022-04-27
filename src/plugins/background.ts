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
