import type { Plugin } from '@nuxt/types'
import { IBackground, backgrounds } from '@/config/backgrounds'

type backgroundURL = (id: string | undefined, type: `local` | `ipfs`) => IBackground

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$getBGImage: backgroundURL
	}
}

const getBGImage: backgroundURL = (id: string | undefined) => {
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
