import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initLibSodium } from '@/backend/utilities/keys'
import { initContract, initNear, initWalletConnection } from '@/backend/near'
import { nearNetwork } from '@/backend/utilities/config'

const backend: Plugin = async (context) => {
	try {
		// If the user has refreshed or backtracked etc
		// eslint-disable-next-line no-unmodified-loop-condition
		for (let i = 0; i < localStorage.length && nearNetwork === `mainnet`; i++) {
			const key = localStorage.key(i)
			if (key && key.startsWith(`near-api-js:keystore`)) {
				if (key.endsWith(`testnet`)) {
					const privateKey = localStorage.getItem(key)
					if (privateKey) {
						localStorage.setItem(key.replace(`testnet`, `mainnet`), privateKey)
					}
				}
			}
		}
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
