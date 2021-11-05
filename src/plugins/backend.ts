import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'

// eslint-disable-next-line quotes
declare module 'vue/types/vue' {
	interface Vue {
		$walletLogin: () => Promise<void>
	}
}

const backend: Plugin = async (_context) => {
	await initIPFS()
}

export default backend
