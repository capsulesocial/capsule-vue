import { Plugin } from '@nuxt/types'
import { initIPFS } from '@/backend/utilities/ipfs'
import { initContract, initNear, initWalletConnection } from '@/backend/near'

const backend: Plugin = async (_context) => {
	await initIPFS()
	await initNear()
	initWalletConnection()
	const accountId = window.localStorage.getItem(`accountId`)
	if (accountId) {
		initContract(accountId)
	}
}

export default backend
