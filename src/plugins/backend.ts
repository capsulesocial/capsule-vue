import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (context) => {
	try {
		console.log(`Initialising IPFS and NEAR`)
		await Promise.all([initIPFS(), initNear()])
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
