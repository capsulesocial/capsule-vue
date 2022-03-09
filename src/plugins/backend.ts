import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (_context) => {
	try {
		await Promise.all([initIPFS(), initNear()])
		initWalletConnection()
		const accountId = window.localStorage.getItem(`accountId`)
		if (accountId) {
			initContract(accountId)
		} else {
			initContract(``)
		}
	} catch (err: unknown) {
		if (err instanceof Error) {
			_context.$toastError(err.message)
		}

		throw err
	}
}

export default backend
