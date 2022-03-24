import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (context) => {
	try {
		// eslint-disable-next-line no-console
		console.log(`Initialising IPFS and NEAR`)
		await Promise.all([initIPFS(), initNear()])
		// eslint-disable-next-line no-console
		console.log(`IPFS and NEAR initialised!`)
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
