import { Plugin } from '@nuxt/types'
import { ready } from 'libsodium-wrappers'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (context) => {
	try {
		const [, ipfs] = await Promise.all([initNear(), initIPFS(), ready])
		ipfs.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				context.$toastError(err.message)
			}

			throw err
		})
		initWalletConnection()

		const accountId = window.localStorage.getItem(`accountId`)
		if (accountId) {
			initContract(accountId)
			return
		}

		initContract(``)
	} catch (err: unknown) {
		if (err instanceof Error) {
			context.$toastError(err.message)
		}

		throw err
	}
}

export default backend
