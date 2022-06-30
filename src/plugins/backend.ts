import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initLibSodium } from '@/backend/utilities/keys'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (context) => {
	try {
		await initNear()
		const libsodium = initLibSodium()
		libsodium.initResult.catch((err: unknown) => {
			if (err instanceof Error) {
				context.$toastError(err.message)
			}

			throw err
		})
		const ipfs = initIPFS()
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
